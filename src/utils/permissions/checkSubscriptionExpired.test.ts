import type { Session } from "next-auth"
import { checkSubscriptionExpired } from "./checkSubscriptionExpired"
import { TRIAL_DAYS } from "./trial-limits"

vi.mock("@/lib/prisma", () => ({
  default: {
    user: {
      findUnique: vi.fn(),
    },
  },
}))

const prisma = (await import("@/lib/prisma")).default as unknown as {
  user: { findUnique: ReturnType<typeof vi.fn> }
}

const AGORA = new Date("2026-03-10T12:00:00.000Z")

function sessionFake(userId: string | undefined): Session {
  return {
    user: userId ? { id: userId } : undefined,
    expires: "2099-01-01",
  } as unknown as Session
}

function diasAtras(dias: number): Date {
  return new Date(AGORA.getTime() - dias * 24 * 60 * 60 * 1000)
}

describe("checkSubscriptionExpired", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(AGORA)
  })

  test("nega permissão quando a sessão não tem usuário", async () => {
    await expect(checkSubscriptionExpired(sessionFake(undefined))).resolves.toEqual({
      hasPermission: false,
      planId: "EXPIRED",
      expired: true,
      plan: null,
    })

    expect(prisma.user.findUnique).not.toHaveBeenCalled()
  })

  test("nega permissão quando o usuário não existe no banco", async () => {
    prisma.user.findUnique.mockResolvedValue(null)

    await expect(checkSubscriptionExpired(sessionFake("user-1"))).resolves.toEqual({
      hasPermission: false,
      planId: "EXPIRED",
      expired: true,
      plan: null,
    })
  })

  test("libera acesso durante o período de teste", async () => {
    prisma.user.findUnique.mockResolvedValue({ createdAt: diasAtras(TRIAL_DAYS - 1) })

    await expect(checkSubscriptionExpired(sessionFake("user-1"))).resolves.toEqual({
      hasPermission: true,
      planId: "TRIAL",
      expired: false,
      plan: null,
    })
  })

  test("libera acesso no último instante antes do fim do trial", async () => {
    prisma.user.findUnique.mockResolvedValue({
      createdAt: new Date(AGORA.getTime() - TRIAL_DAYS * 24 * 60 * 60 * 1000 + 1000),
    })

    const resultado = await checkSubscriptionExpired(sessionFake("user-1"))

    expect(resultado.hasPermission).toBe(true)
    expect(resultado.expired).toBe(false)
  })

  test("expira o acesso um segundo depois do fim do trial", async () => {
    prisma.user.findUnique.mockResolvedValue({
      createdAt: new Date(AGORA.getTime() - TRIAL_DAYS * 24 * 60 * 60 * 1000 - 1000),
    })

    await expect(checkSubscriptionExpired(sessionFake("user-1"))).resolves.toEqual({
      hasPermission: false,
      planId: "EXPIRED",
      expired: true,
      plan: null,
    })
  })

  test("consulta o banco apenas pelo id da sessão", async () => {
    prisma.user.findUnique.mockResolvedValue({ createdAt: AGORA })

    await checkSubscriptionExpired(sessionFake("user-42"))

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: "user-42" },
      select: { createdAt: true },
    })
  })
})
