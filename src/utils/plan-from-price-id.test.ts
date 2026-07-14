import { afterEach, describe, expect, test, vi } from "vitest"
import { planFromPriceId } from "./plan-from-price-id"

describe("planFromPriceId", () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  test("retorna PROFESSIONAL quando priceId é igual a STRIPE_PLAN_PROFESSIONAL", () => {
    vi.stubEnv("STRIPE_PLAN_PROFESSIONAL", "price_pro")

    expect(planFromPriceId("price_pro")).toBe("PROFESSIONAL")
  })

  test.each([
    { descricao: "price ID não reconhecido", priceId: "price_other" },
    { descricao: "string vazia", priceId: "" },
    { descricao: "price ID diferente do env", priceId: "price_basic" },
  ])("retorna BASIC como fallback quando $descricao", ({ priceId }) => {
    vi.stubEnv("STRIPE_PLAN_PROFESSIONAL", "price_pro")

    expect(planFromPriceId(priceId)).toBe("BASIC")
  })

  test("retorna BASIC quando STRIPE_PLAN_PROFESSIONAL não está definido", () => {
    vi.stubEnv("STRIPE_PLAN_PROFESSIONAL", "")

    expect(planFromPriceId("price_pro")).toBe("BASIC")
  })
})
