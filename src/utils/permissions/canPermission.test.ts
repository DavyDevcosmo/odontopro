import type { Session } from "next-auth"
import { canPermission } from "./canPermission"

vi.mock("@/lib/auth", () => ({ auth: vi.fn() }))

vi.mock("@/lib/prisma", () => ({
  default: {
    subscription: { findFirst: vi.fn() },
  },
}))

vi.mock("./canCreateService", () => ({ canCreateService: vi.fn() }))

const auth = vi.mocked((await import("@/lib/auth")).auth) as unknown as ReturnType<typeof vi.fn>

const prisma = (await import("@/lib/prisma")).default as unknown as {
  subscription: { findFirst: ReturnType<typeof vi.fn> }
}

const canCreateService = vi.mocked((await import("./canCreateService")).canCreateService)

const SEM_PERMISSAO = {
  hasPermission: false,
  planId: "EXPIRED",
  expired: true,
  plan: null,
}

const session = { user: { id: "user-1" }, expires: "2099-01-01" } as unknown as Session

describe("canPermission", () => {
  test("nega permissão quando não há sessão", async () => {
    auth.mockResolvedValue(null)

    await expect(canPermission({ type: "service" })).resolves.toEqual(SEM_PERMISSAO)

    expect(prisma.subscription.findFirst).not.toHaveBeenCalled()
    expect(canCreateService).not.toHaveBeenCalled()
  })

  test("nega permissão quando a sessão não tem id de usuário", async () => {
    auth.mockResolvedValue({ user: {}, expires: "2099-01-01" })

    await expect(canPermission({ type: "service" })).resolves.toEqual(SEM_PERMISSAO)
  })

  test("delega para canCreateService com a assinatura do usuário", async () => {
    const subscription = { id: "sub_1", userId: "user-1", plan: "BASIC", status: "active" }
    const permissao = { hasPermission: true, planId: "BASIC" as const, expired: false, plan: null }

    auth.mockResolvedValue(session)
    prisma.subscription.findFirst.mockResolvedValue(subscription)
    canCreateService.mockResolvedValue(permissao)

    await expect(canPermission({ type: "service" })).resolves.toEqual(permissao)

    expect(prisma.subscription.findFirst).toHaveBeenCalledWith({
      where: { userId: "user-1" },
    })
    expect(canCreateService).toHaveBeenCalledWith(subscription, session)
  })

  test("repassa assinatura nula para canCreateService", async () => {
    auth.mockResolvedValue(session)
    prisma.subscription.findFirst.mockResolvedValue(null)
    canCreateService.mockResolvedValue({
      hasPermission: true,
      planId: "TRIAL",
      expired: false,
      plan: null,
    })

    await canPermission({ type: "service" })

    expect(canCreateService).toHaveBeenCalledWith(null, session)
  })

  test("nega permissão para um tipo não suportado", async () => {
    auth.mockResolvedValue(session)
    prisma.subscription.findFirst.mockResolvedValue(null)

    const tipoInvalido = "report" as unknown as "service"

    await expect(canPermission({ type: tipoInvalido })).resolves.toEqual(SEM_PERMISSAO)

    expect(canCreateService).not.toHaveBeenCalled()
  })
})
