import { POST } from "./route"

vi.mock("@/utils/stripe", () => ({
  stripe: { webhooks: { constructEvent: vi.fn() } },
}))

vi.mock("@/utils/manage-subscription", () => ({ manageSubscription: vi.fn() }))

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }))

const { stripe } = (await import("@/utils/stripe")) as unknown as {
  stripe: { webhooks: { constructEvent: ReturnType<typeof vi.fn> } }
}

const manageSubscription = vi.mocked(
  (await import("@/utils/manage-subscription")).manageSubscription,
)

const revalidatePath = vi.mocked((await import("next/cache")).revalidatePath)

const PAGINAS_REVALIDADAS = ["/dashboard", "/dashboard/plans", "/dashboard/services"]

function requisicao(assinatura: string | null = "assinatura-valida"): Request {
  return new Request("http://localhost/api/webhook", {
    method: "POST",
    headers: assinatura ? { "stripe-signature": assinatura } : {},
    body: JSON.stringify({ id: "evt_1" }),
  })
}

describe("POST /api/webhook", () => {
  beforeEach(() => {
    vi.stubEnv("STRIPE_WEBHOOK_SECRET", "whsec_teste")
    vi.spyOn(console, "error").mockImplementation(() => {})
    vi.spyOn(console, "log").mockImplementation(() => {})
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  describe("validação da requisição", () => {
    test("recusa requisição sem o header stripe-signature", async () => {
      const response = await POST(requisicao(null))

      expect(response.status).toBe(400)
      await expect(response.json()).resolves.toEqual({
        error: "Missing stripe-signature header",
      })
      expect(stripe.webhooks.constructEvent).not.toHaveBeenCalled()
    })

    test("falha quando nenhum segredo de webhook está configurado", async () => {
      vi.stubEnv("STRIPE_WEBHOOK_SECRET", undefined)
      vi.stubEnv("STRIPE_SECRET_WEBHOOK_KEY", undefined)

      const response = await POST(requisicao())

      expect(response.status).toBe(500)
      await expect(response.json()).resolves.toEqual({
        error: "Webhook secret not configured",
      })
    })

    test("aceita o segredo legado STRIPE_SECRET_WEBHOOK_KEY", async () => {
      vi.stubEnv("STRIPE_WEBHOOK_SECRET", undefined)
      vi.stubEnv("STRIPE_SECRET_WEBHOOK_KEY", "whsec_legado")
      stripe.webhooks.constructEvent.mockReturnValue({ type: "invoice.paid", data: { object: {} } })

      const response = await POST(requisicao())

      expect(response.status).toBe(200)
      expect(stripe.webhooks.constructEvent).toHaveBeenCalledWith(
        expect.any(String),
        "assinatura-valida",
        "whsec_legado",
      )
    })

    test("cai no segredo legado quando STRIPE_WEBHOOK_SECRET está vazio", async () => {
      vi.stubEnv("STRIPE_WEBHOOK_SECRET", "")
      vi.stubEnv("STRIPE_SECRET_WEBHOOK_KEY", "whsec_legado")
      stripe.webhooks.constructEvent.mockReturnValue({ type: "invoice.paid", data: { object: {} } })

      const response = await POST(requisicao())

      expect(response.status).toBe(200)
      expect(stripe.webhooks.constructEvent).toHaveBeenCalledWith(
        expect.any(String),
        "assinatura-valida",
        "whsec_legado",
      )
    })

    test("retorna 400 quando a assinatura do evento é inválida", async () => {
      stripe.webhooks.constructEvent.mockImplementation(() => {
        throw new Error("Invalid signature")
      })

      const response = await POST(requisicao())

      expect(response.status).toBe(400)
      await expect(response.json()).resolves.toEqual({ error: "Webhook handler failed" })
      expect(manageSubscription).not.toHaveBeenCalled()
    })
  })

  describe("eventos de assinatura", () => {
    test("remove a assinatura em customer.subscription.deleted", async () => {
      stripe.webhooks.constructEvent.mockReturnValue({
        type: "customer.subscription.deleted",
        data: { object: { id: "sub_1", customer: "cus_1" } },
      })

      const response = await POST(requisicao())

      expect(response.status).toBe(200)
      expect(manageSubscription).toHaveBeenCalledWith("sub_1", "cus_1", false, true)
    })

    test("sincroniza a assinatura em customer.subscription.created", async () => {
      stripe.webhooks.constructEvent.mockReturnValue({
        type: "customer.subscription.created",
        data: { object: { id: "sub_1", customer: "cus_1" } },
      })

      await POST(requisicao())

      expect(manageSubscription).toHaveBeenCalledWith("sub_1", "cus_1", true)
    })

    test("sincroniza a assinatura em customer.subscription.updated", async () => {
      stripe.webhooks.constructEvent.mockReturnValue({
        type: "customer.subscription.updated",
        data: { object: { id: "sub_1", customer: "cus_1" } },
      })

      await POST(requisicao())

      expect(manageSubscription).toHaveBeenCalledWith("sub_1", "cus_1", false)
    })

    test("converte o customer em string quando o Stripe envia um objeto", async () => {
      stripe.webhooks.constructEvent.mockReturnValue({
        type: "customer.subscription.updated",
        data: {
          object: { id: "sub_1", customer: { toString: () => "cus_obj" } },
        },
      })

      await POST(requisicao())

      expect(manageSubscription).toHaveBeenCalledWith("sub_1", "cus_obj", false)
    })
  })

  describe("checkout.session.completed", () => {
    test("usa o plano informado no metadata", async () => {
      stripe.webhooks.constructEvent.mockReturnValue({
        type: "checkout.session.completed",
        data: {
          object: {
            subscription: "sub_1",
            customer: "cus_1",
            metadata: { type: "PROFESSIONAL" },
          },
        },
      })

      await POST(requisicao())

      expect(manageSubscription).toHaveBeenCalledWith("sub_1", "cus_1", true, false, "PROFESSIONAL")
    })

    test("usa BASIC como plano padrão quando não há metadata", async () => {
      stripe.webhooks.constructEvent.mockReturnValue({
        type: "checkout.session.completed",
        data: { object: { subscription: "sub_1", customer: "cus_1" } },
      })

      await POST(requisicao())

      expect(manageSubscription).toHaveBeenCalledWith("sub_1", "cus_1", true, false, "BASIC")
    })

    test("ignora a sessão sem assinatura mas ainda revalida as páginas", async () => {
      stripe.webhooks.constructEvent.mockReturnValue({
        type: "checkout.session.completed",
        data: { object: { customer: "cus_1" } },
      })

      const response = await POST(requisicao())

      expect(response.status).toBe(200)
      expect(manageSubscription).not.toHaveBeenCalled()
      expect(revalidatePath).toHaveBeenCalledTimes(PAGINAS_REVALIDADAS.length)
    })
  })

  test("revalida dashboard, planos e serviços após sincronizar", async () => {
    stripe.webhooks.constructEvent.mockReturnValue({
      type: "customer.subscription.updated",
      data: { object: { id: "sub_1", customer: "cus_1" } },
    })

    await POST(requisicao())

    expect(revalidatePath.mock.calls.flat()).toEqual(PAGINAS_REVALIDADAS)
  })

  test("responde 200 sem sincronizar em eventos não tratados", async () => {
    stripe.webhooks.constructEvent.mockReturnValue({
      type: "invoice.payment_failed",
      data: { object: {} },
    })

    const response = await POST(requisicao())

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ received: true })
    expect(manageSubscription).not.toHaveBeenCalled()
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  test("retorna 400 quando a sincronização da assinatura falha", async () => {
    stripe.webhooks.constructEvent.mockReturnValue({
      type: "customer.subscription.updated",
      data: { object: { id: "sub_1", customer: "cus_1" } },
    })
    manageSubscription.mockRejectedValue(new Error("usuário não vinculado"))

    const response = await POST(requisicao())

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({ error: "Webhook handler failed" })
    expect(revalidatePath).not.toHaveBeenCalled()
  })
})
