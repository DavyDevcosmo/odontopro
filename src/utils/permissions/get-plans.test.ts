import { describe, expect, test } from "vitest"
import { getPlan } from "./get-plans"

describe("getPlan", () => {
  test.each([
    {
      descricao: "plano BASIC",
      planId: "BASIC" as const,
      esperado: { maxServices: 3 },
    },
    {
      descricao: "plano PROFESSIONAL",
      planId: "PROFESSIONAL" as const,
      esperado: { maxServices: 50 },
    },
  ])("retorna limite correto para $descricao", async ({ planId, esperado }) => {
    await expect(getPlan(planId)).resolves.toEqual(esperado)
  })

  test("retorna undefined para plano desconhecido", async () => {
    const planoInvalido = "INVALID" as unknown as Parameters<typeof getPlan>[0]

    await expect(getPlan(planoInvalido)).resolves.toBeUndefined()
  })
})
