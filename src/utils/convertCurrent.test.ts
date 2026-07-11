import { describe, expect, test } from "vitest"
import { convertRealToCents } from "./convertCurrent"

describe("convertRealToCents", () => {
  test.each([
    { descricao: "valor com centavos", entrada: "39,99", esperado: 3999 },
    { descricao: "valor com separador de milhar", entrada: "1.234,56", esperado: 123456 },
    { descricao: "valor inteiro com milhar", entrada: "1.000,00", esperado: 100000 },
    { descricao: "valor inteiro sem centavos", entrada: "27", esperado: 2700 },
    { descricao: "valor com uma casa decimal", entrada: "27,9", esperado: 2790 },
    { descricao: "centavos mínimos", entrada: "0,01", esperado: 1 },
    { descricao: "zero", entrada: "0,00", esperado: 0 },
    { descricao: "valor negativo", entrada: "-10,00", esperado: -1000 },
    { descricao: "arredonda para o centavo mais próximo", entrada: "10,005", esperado: 1001 },
  ])("$descricao", ({ entrada, esperado }) => {
    expect(convertRealToCents(entrada)).toBe(esperado)
  })

  test.each([
    { descricao: "string vazia", entrada: "" },
    { descricao: "texto inválido", entrada: "abc" },
    { descricao: "apenas separadores", entrada: ",," },
  ])("retorna NaN quando entrada é $descricao", ({ entrada }) => {
    expect(convertRealToCents(entrada)).toBeNaN()
  })
})
