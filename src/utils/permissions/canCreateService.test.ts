import type { Session } from "next-auth"
import type { Subscription } from "../../../prisma/generated/prisma/client"
import { PLANS } from "../plans"
import { canCreateService } from "./canCreateService"
import { TRIAL_DAYS } from "./trial-limits"

vi.mock("@/lib/prisma", () => ({
  default: {
    service: { count: vi.fn() },
    user: { findUnique: vi.fn() },
  },
}))

vi.mock("./get-plans", async (importOriginal) => {
  const original = await importOriginal<typeof import("./get-plans")>()
  return { ...original, getPlan: vi.fn() }
})

const prisma = (await import("@/lib/prisma")).default as unknown as {
  service: { count: ReturnType<typeof vi.fn> }
  user: { findUnique: ReturnType<typeof vi.fn> }
}

const getPlanMock = vi.mocked((await import("./get-plans")).getPlan)

const AGORA = new Date("2026-03-10T12:00:00.000Z")

const session = { user: { id: "user-1" }, expires: "2099-01-01" } as unknown as Session

function assinatura(plan: "BASIC" | "PROFESSIONAL", status: string): Subscription {
  return {
    id: "sub_1",
    userId: "user-1",
    status,
    priceId: "price_1",
    plan,
  } as unknown as Subscription
}

describe("canCreateService", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(AGORA)
    getPlanMock.mockImplementation(async (planId) => PLANS[planId as keyof typeof PLANS])
  })

  describe("com assinatura ativa", () => {
    test.each([
      { plan: "BASIC" as const, servicos: 0, esperado: true },
      { plan: "BASIC" as const, servicos: 2, esperado: true },
      { plan: "BASIC" as const, servicos: 3, esperado: false },
      { plan: "BASIC" as const, servicos: 10, esperado: false },
      { plan: "PROFESSIONAL" as const, servicos: 49, esperado: true },
      { plan: "PROFESSIONAL" as const, servicos: 50, esperado: false },
    ])(
      "plano $plan com $servicos serviços permite criar: $esperado",
      async ({ plan, servicos, esperado }) => {
        prisma.service.count.mockResolvedValue(servicos)

        const resultado = await canCreateService(assinatura(plan, "active"), session)

        expect(resultado).toEqual({
          hasPermission: esperado,
          planId: plan,
          expired: false,
          plan: PLANS[plan],
        })
      },
    )

    test("trata assinatura em trialing como ativa", async () => {
      prisma.service.count.mockResolvedValue(0)

      const resultado = await canCreateService(assinatura("BASIC", "trialing"), session)

      expect(resultado.hasPermission).toBe(true)
      expect(resultado.expired).toBe(false)
    })

    test("permite criação ilimitada quando o plano não tem limite", async () => {
      prisma.service.count.mockResolvedValue(9999)
      getPlanMock.mockResolvedValue({ maxServices: null as unknown as number })

      const resultado = await canCreateService(assinatura("PROFESSIONAL", "active"), session)

      expect(resultado.hasPermission).toBe(true)
    })

    test("conta apenas os serviços do usuário da sessão", async () => {
      prisma.service.count.mockResolvedValue(0)

      await canCreateService(assinatura("BASIC", "active"), session)

      expect(prisma.service.count).toHaveBeenCalledWith({ where: { userId: "user-1" } })
      expect(prisma.user.findUnique).not.toHaveBeenCalled()
    })
  })

  describe("sem assinatura ativa", () => {
    test("cai no trial quando não há assinatura", async () => {
      prisma.service.count.mockResolvedValue(0)
      prisma.user.findUnique.mockResolvedValue({ createdAt: AGORA })

      await expect(canCreateService(null, session)).resolves.toEqual({
        hasPermission: true,
        planId: "TRIAL",
        expired: false,
        plan: null,
      })
    })

    test.each(["canceled", "incomplete", "past_due", "unpaid"])(
      "cai no trial quando o status é %s",
      async (status) => {
        prisma.service.count.mockResolvedValue(0)
        prisma.user.findUnique.mockResolvedValue({ createdAt: AGORA })

        const resultado = await canCreateService(assinatura("BASIC", status), session)

        expect(resultado.planId).toBe("TRIAL")
        expect(resultado.hasPermission).toBe(true)
      },
    )

    test("bloqueia quando a assinatura está inativa e o trial já expirou", async () => {
      prisma.service.count.mockResolvedValue(0)
      prisma.user.findUnique.mockResolvedValue({
        createdAt: new Date(AGORA.getTime() - (TRIAL_DAYS + 1) * 24 * 60 * 60 * 1000),
      })

      await expect(canCreateService(assinatura("BASIC", "canceled"), session)).resolves.toEqual({
        hasPermission: false,
        planId: "EXPIRED",
        expired: true,
        plan: null,
      })
    })
  })

  test("nega permissão quando a consulta ao banco falha", async () => {
    prisma.service.count.mockRejectedValue(new Error("db offline"))

    await expect(canCreateService(assinatura("BASIC", "active"), session)).resolves.toEqual({
      hasPermission: false,
      planId: "EXPIRED",
      expired: false,
      plan: null,
    })
  })
})
