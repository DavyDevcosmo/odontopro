import { isActiveSubscriptionStatus } from "./subscription-status"

describe("isActiveSubscriptionStatus", () => {
  test.each([
    { descricao: "status active", status: "active", esperado: true },
    { descricao: "status trialing", status: "trialing", esperado: true },
    { descricao: "status canceled", status: "canceled", esperado: false },
    { descricao: "status null", status: null, esperado: false },
    { descricao: "status undefined", status: undefined, esperado: false },
    { descricao: "string vazia", status: "", esperado: false },
    { descricao: "status desconhecido", status: "past_due", esperado: false },
  ])("retorna $esperado quando $descricao", ({ status, esperado }) => {
    expect(isActiveSubscriptionStatus(status)).toBe(esperado)
  })
})
