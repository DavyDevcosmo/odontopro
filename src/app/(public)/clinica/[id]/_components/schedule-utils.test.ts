import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import {
  isSlotInThePast,
  isSlotSequenceAvaliable,
  isToday,
} from "./schedule-utils"

describe("isToday", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 6, 9, 12, 0, 0))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test.each([
    { descricao: "o mesmo ano/mês/dia de hoje", data: new Date(2026, 6, 9, 0, 0, 0), esperado: true },
    { descricao: "hora diferente no mesmo dia", data: new Date(2026, 6, 9, 23, 59, 59), esperado: true },
    { descricao: "outro dia do mesmo mês", data: new Date(2026, 6, 10, 12, 0, 0), esperado: false },
    { descricao: "outro mês", data: new Date(2026, 7, 9, 12, 0, 0), esperado: false },
    { descricao: "outro ano", data: new Date(2025, 6, 9, 12, 0, 0), esperado: false },
  ])("retorna $esperado quando é $descricao", ({ data, esperado }) => {
    expect(isToday(data)).toBe(esperado)
  })
})

describe("isSlotInThePast", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 6, 9, 10, 30, 0))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test.each([
    { descricao: "hora do slot menor que a atual", slot: "09:00", esperado: true },
    { descricao: "mesma hora e minuto igual ao atual", slot: "10:30", esperado: true },
    { descricao: "mesma hora e minuto menor que o atual", slot: "10:00", esperado: true },
    { descricao: "mesma hora e minuto maior que o atual", slot: "10:45", esperado: false },
    { descricao: "hora do slot maior que a atual", slot: "11:00", esperado: false },
  ])("retorna $esperado quando $descricao", ({ slot, esperado }) => {
    expect(isSlotInThePast(slot)).toBe(esperado)
  })
})

describe("isSlotSequenceAvaliable", () => {
  const allSlots = ["09:00", "09:30", "10:00", "10:30", "11:00"]

  test.each([
    {
      descricao: "toda a sequência necessária está livre",
      startSlot: "09:00",
      requeredSlots: 2,
      blockedSlots: [] as string[],
      esperado: true,
    },
    {
      descricao: "sequência de um único slot livre",
      startSlot: "10:00",
      requeredSlots: 1,
      blockedSlots: ["09:00"],
      esperado: true,
    },
    {
      descricao: "algum slot da sequência está bloqueado",
      startSlot: "09:00",
      requeredSlots: 2,
      blockedSlots: ["09:30"],
      esperado: false,
    },
    {
      descricao: "o próprio slot inicial está bloqueado",
      startSlot: "09:00",
      requeredSlots: 1,
      blockedSlots: ["09:00"],
      esperado: false,
    },
    {
      descricao: "startSlot não existe na lista",
      startSlot: "08:00",
      requeredSlots: 1,
      blockedSlots: [],
      esperado: false,
    },
    {
      descricao: "sequência ultrapassa o fim da lista",
      startSlot: "10:30",
      requeredSlots: 3,
      blockedSlots: [],
      esperado: false,
    },
    {
      descricao: "sequência termina exatamente no último slot",
      startSlot: "10:30",
      requeredSlots: 2,
      blockedSlots: [],
      esperado: true,
    },
  ])("retorna $esperado quando $descricao", ({ startSlot, requeredSlots, blockedSlots, esperado }) => {
    expect(isSlotSequenceAvaliable(startSlot, requeredSlots, allSlots, blockedSlots)).toBe(esperado)
  })
})