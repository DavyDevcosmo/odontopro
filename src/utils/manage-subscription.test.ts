import { manageSubscription } from "./manage-subscription"

vi.mock("@/lib/prisma", () => ({
  default: {
    user: { findFirst: vi.fn() },
    subscription: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}))

vi.mock("./stripe", () => ({
  stripe: {
    subscriptions: { retrieve: vi.fn() },
  },
}))

const prisma = (await import("@/lib/prisma")).default as unknown as {
  user: { findFirst: ReturnType<typeof vi.fn> }
  subscription: Record<string, ReturnType<typeof vi.fn>>
}

const stripe = (await import("./stripe")).stripe as unknown as {
  subscriptions: { retrieve: ReturnType<typeof vi.fn> }
}

const USUARIO = { id: "user-1", stripe_customer_id: "cus_1" }

function stripeSubscription(overrides: Record<string, unknown> = {}) {
  return {
    id: "sub_stripe",
    status: "active",
    items: { data: [{ price: { id: "price_basic" } }] },
    ...overrides,
  }
}

describe("manageSubscription", () => {
  beforeEach(() => {
    vi.stubEnv("STRIPE_PLAN_PROFESSIONAL", "price_pro")
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  test("lança erro quando o customer do Stripe não está vinculado a um usuário", async () => {
    prisma.user.findFirst.mockResolvedValue(null)

    await expect(manageSubscription("sub_stripe", "cus_orfao")).rejects.toThrow(
      "Stripe customer not linked to user: cus_orfao",
    )

    expect(stripe.subscriptions.retrieve).not.toHaveBeenCalled()
  })

  test("remove as assinaturas do usuário quando é uma exclusão", async () => {
    prisma.user.findFirst.mockResolvedValue(USUARIO)

    await manageSubscription("sub_stripe", "cus_1", false, true)

    expect(prisma.subscription.deleteMany).toHaveBeenCalledWith({
      where: { userId: "user-1" },
    })
    expect(stripe.subscriptions.retrieve).not.toHaveBeenCalled()
    expect(prisma.subscription.create).not.toHaveBeenCalled()
  })

  test("cria a assinatura quando o usuário ainda não tem nenhuma", async () => {
    prisma.user.findFirst.mockResolvedValue(USUARIO)
    stripe.subscriptions.retrieve.mockResolvedValue(stripeSubscription())
    prisma.subscription.findUnique.mockResolvedValue(null)

    await manageSubscription("sub_stripe", "cus_1")

    expect(prisma.subscription.create).toHaveBeenCalledWith({
      data: {
        id: "sub_stripe",
        userId: "user-1",
        status: "active",
        priceId: "price_basic",
        plan: "BASIC",
      },
    })
    expect(prisma.subscription.update).not.toHaveBeenCalled()
  })

  test("deriva o plano a partir do priceId quando o tipo não é informado", async () => {
    prisma.user.findFirst.mockResolvedValue(USUARIO)
    stripe.subscriptions.retrieve.mockResolvedValue(
      stripeSubscription({ items: { data: [{ price: { id: "price_pro" } }] } }),
    )
    prisma.subscription.findUnique.mockResolvedValue(null)

    await manageSubscription("sub_stripe", "cus_1")

    expect(prisma.subscription.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ plan: "PROFESSIONAL" }) }),
    )
  })

  test("o tipo explícito tem precedência sobre o priceId", async () => {
    prisma.user.findFirst.mockResolvedValue(USUARIO)
    stripe.subscriptions.retrieve.mockResolvedValue(stripeSubscription())
    prisma.subscription.findUnique.mockResolvedValue(null)

    await manageSubscription("sub_stripe", "cus_1", true, false, "PROFESSIONAL")

    expect(prisma.subscription.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ plan: "PROFESSIONAL" }) }),
    )
  })

  test("atualiza a assinatura existente quando o id do Stripe é o mesmo", async () => {
    prisma.user.findFirst.mockResolvedValue(USUARIO)
    stripe.subscriptions.retrieve.mockResolvedValue(
      stripeSubscription({ status: "past_due" }),
    )
    prisma.subscription.findUnique.mockResolvedValue({ id: "sub_stripe", userId: "user-1" })

    await manageSubscription("sub_stripe", "cus_1")

    expect(prisma.subscription.update).toHaveBeenCalledWith({
      where: { id: "sub_stripe" },
      data: { status: "past_due", priceId: "price_basic", plan: "BASIC" },
    })
    expect(prisma.subscription.create).not.toHaveBeenCalled()
    expect(prisma.subscription.delete).not.toHaveBeenCalled()
  })

  test("substitui a assinatura antiga quando o usuário troca de assinatura no Stripe", async () => {
    prisma.user.findFirst.mockResolvedValue(USUARIO)
    stripe.subscriptions.retrieve.mockResolvedValue(stripeSubscription({ id: "sub_nova" }))
    prisma.subscription.findUnique.mockResolvedValue({ id: "sub_antiga", userId: "user-1" })

    await manageSubscription("sub_nova", "cus_1")

    expect(prisma.subscription.delete).toHaveBeenCalledWith({
      where: { userId: "user-1" },
    })
    expect(prisma.subscription.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ id: "sub_nova" }) }),
    )
    expect(prisma.subscription.update).not.toHaveBeenCalled()
  })

  test("busca o usuário pelo stripe_customer_id", async () => {
    prisma.user.findFirst.mockResolvedValue(USUARIO)
    stripe.subscriptions.retrieve.mockResolvedValue(stripeSubscription())
    prisma.subscription.findUnique.mockResolvedValue(null)

    await manageSubscription("sub_stripe", "cus_1")

    expect(prisma.user.findFirst).toHaveBeenCalledWith({
      where: { stripe_customer_id: "cus_1" },
    })
    expect(stripe.subscriptions.retrieve).toHaveBeenCalledWith("sub_stripe")
  })
})
