import { extractPhoneNumber, formatPhone } from "./formatPhone"

describe("formatPhone", () => {
  test.each([
    { descricao: "string vazia", entrada: "", esperado: "" },
    { descricao: "1 dígito", entrada: "1", esperado: "1" },
    { descricao: "2 dígitos (DDD incompleto)", entrada: "11", esperado: "11" },
    { descricao: "3 dígitos (DDD + 1)", entrada: "119", esperado: "(11) 9" },
    { descricao: "8 dígitos", entrada: "11987654", esperado: "(11) 98765-4" },
    { descricao: "11 dígitos (celular completo)", entrada: "11999999999", esperado: "(11) 99999-9999" },
    { descricao: "remove caracteres não numéricos antes de mascarar", entrada: "(11) 99999-9999", esperado: "(11) 99999-9999" },
    { descricao: "aceita entrada já parcialmente formatada", entrada: "11 9876", esperado: "(11) 9876" },
  ])("$descricao", ({ entrada, esperado }) => {
    expect(formatPhone(entrada)).toBe(esperado)
  })

  test.each([
    {
      descricao: "mais de 11 dígitos retorna slice(0, 15) do valor original",
      entrada: "11999999999999",
      esperado: "11999999999999",
    },
    {
      descricao: "mais de 11 dígitos com máscara retorna os 15 primeiros caracteres do original",
      entrada: "(11) 99999-9999999",
      esperado: "(11) 99999-9999",
    },
  ])("$descricao", ({ entrada, esperado }) => {
    expect(formatPhone(entrada)).toBe(esperado)
  })
})

describe("extractPhoneNumber", () => {
  test.each([
    { descricao: "remove parênteses", entrada: "(11)999999999", esperado: "11999999999" },
    { descricao: "remove hífen", entrada: "11-99999-9999", esperado: "11999999999" },
    { descricao: "remove espaços", entrada: "(11) 99999 9999", esperado: "11999999999" },
    { descricao: "remove parênteses, hífen e espaços juntos", entrada: "(11) 99999-9999", esperado: "11999999999" },
    { descricao: "mantém apenas dígitos quando já está limpo", entrada: "11999999999", esperado: "11999999999" },
    { descricao: "string vazia", entrada: "", esperado: "" },
  ])("$descricao", ({ entrada, esperado }) => {
    expect(extractPhoneNumber(entrada)).toBe(esperado)
  })
})
