import { checkSubscription } from "./checkSubscription"
import { TRIAL_DAYS } from "./trial-limits"

vi.mock("@/lib/prisma", () => ({
  default: {
    user: { findUnique: vi.fn() },
  },
}))

const prisma = (await import("@/lib/prisma")).default as unknown as {
  user: { findUnique: ReturnType<typeof vi.fn> }
}

const AGORA = new Date("2026-03-10T12:00:00.000Z")

function diasAtras(dias: number): Date {
  return new Date(AGORA.getTime() - dias * 24 * 60 * 60 * 1000)
}

describe("checkSubscription", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(AGORA)
  })

  test("lança erro quando o userId está vazio", async () => {
    await expect(checkSubscription("")).rejects.toThrow("Usuario nao encontrado")

    expect(prisma.user.findUnique).not.toHaveBeenCalled()
  })

  test("lança erro quando o usuário não existe", async () => {
    prisma.user.findUnique.mockResolvedValue(null)

    await expect(checkSubscription("user-1")).rejects.toThrow("Usuario nao encontrado")
  })

  test.each(["active", "trialing"])("reporta assinatura ativa para o status %s", async (status) => {
    prisma.user.findUnique.mockResolvedValue({
      createdAt: diasAtras(100),
      subscription: { status, plan: "PROFESSIONAL" },
    })

    await expect(checkSubscription("user-1")).resolves.toEqual({
      subscriptionStatus: "active",
      message: "Assinatura ativa.",
      planId: "PROFESSIONAL",
    })
  })

  test.each(["canceled", "past_due", "incomplete", "unpaid"])(
    "reporta assinatura inativa para o status %s",
    async (status) => {
      prisma.user.findUnique.mockResolvedValue({
        createdAt: diasAtras(100),
        subscription: { status, plan: "BASIC" },
      })

      const resultado = await checkSubscription("user-1")

      expect(resultado.subscriptionStatus).toBe("INACTIVE")
      expect(resultado.planId).toBe("BASIC")
    },
  )

  test("prioriza a assinatura inativa sobre o trial expirado", async () => {
    prisma.user.findUnique.mockResolvedValue({
      createdAt: diasAtras(TRIAL_DAYS + 10),
      subscription: { status: "canceled", plan: "BASIC" },
    })

    const resultado = await checkSubscription("user-1")

    expect(resultado.subscriptionStatus).toBe("INACTIVE")
  })

  test("reporta trial expirado quando não há assinatura", async () => {
    prisma.user.findUnique.mockResolvedValue({
      createdAt: diasAtras(TRIAL_DAYS + 1),
      subscription: null,
    })

    await expect(checkSubscription("user-1")).resolves.toEqual({
      subscriptionStatus: "EXPIRED",
      message: "Seu periodo de teste expirou.",
      planId: "TRIAL",
    })
  })

  test("reporta os dias restantes do trial", async () => {
    prisma.user.findUnique.mockResolvedValue({
      createdAt: diasAtras(1),
      subscription: null,
    })

    await expect(checkSubscription("user-1")).resolves.toEqual({
      subscriptionStatus: "TRIAL",
      message: `Você está no período de teste gratuito. Faltam ${TRIAL_DAYS - 1} dias`,
      planId: "TRIAL",
    })
  })

  test("carrega a assinatura junto com o usuário", async () => {
    prisma.user.findUnique.mockResolvedValue({ createdAt: AGORA, subscription: null })

    await checkSubscription("user-9")

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: "user-9" },
      include: { subscription: true },
    })
  })
})
