import {
  getBlockedSlots,
  getDayRange,
  getSlotsForDuration,
  hasSlotConflict,
  parseAppointmentDate,
} from "./slot-blocking"

const userTimes = ["09:00", "09:30", "10:00", "10:30", "11:00"]

describe("getBlockedSlots", () => {
  test.each([
    {
      descricao: "duração de 30 min bloqueia 1 slot",
      appointments: [{ time: "09:00", service: { duration: 30 } }],
      esperado: ["09:00"],
    },
    {
      descricao: "duração de 60 min bloqueia 2 slots",
      appointments: [{ time: "09:00", service: { duration: 60 } }],
      esperado: ["09:00", "09:30"],
    },
    {
      descricao: "duração de 45 min bloqueia 2 slots (ceil de 1.5)",
      appointments: [{ time: "09:00", service: { duration: 45 } }],
      esperado: ["09:00", "09:30"],
    },
    {
      descricao: "não bloqueia quando o horário do appointment não existe em userTimes",
      appointments: [{ time: "08:00", service: { duration: 60 } }],
      esperado: [],
    },
    {
      descricao: "não estoura o fim do array quando a duração excede os slots restantes",
      appointments: [{ time: "10:30", service: { duration: 90 } }],
      esperado: ["10:30", "11:00"],
    },
  ])("$descricao", ({ appointments, esperado }) => {
    const blocked = getBlockedSlots(userTimes, appointments)

    expect([...blocked].sort()).toEqual(esperado.sort())
  })

  test("combina bloqueios de múltiplos appointments", () => {
    const blocked = getBlockedSlots(userTimes, [
      { time: "09:00", service: { duration: 30 } },
      { time: "10:00", service: { duration: 60 } },
    ])

    expect(blocked).toEqual(new Set(["09:00", "10:00", "10:30"]))
  })
})

describe("getSlotsForDuration", () => {
  test.each([
    {
      descricao: "duração de 30 min retorna 1 slot",
      startTime: "09:00",
      durationMinutes: 30,
      esperado: ["09:00"],
    },
    {
      descricao: "duração de 60 min retorna 2 slots",
      startTime: "09:00",
      durationMinutes: 60,
      esperado: ["09:00", "09:30"],
    },
    {
      descricao: "duração de 45 min retorna 2 slots (ceil)",
      startTime: "09:00",
      durationMinutes: 45,
      esperado: ["09:00", "09:30"],
    },
    {
      descricao: "retorna array vazio quando startTime não existe",
      startTime: "08:00",
      durationMinutes: 30,
      esperado: [],
    },
    {
      descricao: "retorna apenas os slots disponíveis até o fim do array",
      startTime: "10:30",
      durationMinutes: 90,
      esperado: ["10:30", "11:00"],
    },
  ])("$descricao", ({ startTime, durationMinutes, esperado }) => {
    expect(getSlotsForDuration(userTimes, startTime, durationMinutes)).toEqual(esperado)
  })
})

describe("hasSlotConflict", () => {
  const blockedSlots = getBlockedSlots(userTimes, [
    { time: "09:00", service: { duration: 30 } },
  ])

  test.each([
    {
      descricao: "há conflito quando algum slot necessário está bloqueado",
      startTime: "09:00",
      durationMinutes: 30,
      esperado: true,
    },
    {
      descricao: "não há conflito quando os slots necessários estão livres",
      startTime: "10:00",
      durationMinutes: 30,
      esperado: false,
    },
    {
      descricao: "retorna true quando startTime é inválido (nenhum slot retornado)",
      startTime: "08:00",
      durationMinutes: 30,
      esperado: true,
    },
    {
      descricao: "há conflito quando apenas o segundo slot da sequência está bloqueado",
      startTime: "09:00",
      durationMinutes: 60,
      esperado: true,
    },
  ])("$descricao", ({ startTime, durationMinutes, esperado }) => {
    expect(hasSlotConflict(userTimes, blockedSlots, startTime, durationMinutes)).toBe(esperado)
  })
})

describe("parseAppointmentDate", () => {
  test.each([
    {
      descricao: "converte data local para UTC 00:00 do mesmo dia",
      data: new Date(2026, 6, 9, 15, 30, 45),
      esperado: new Date(Date.UTC(2026, 6, 9, 0, 0, 0, 0)),
    },
    {
      descricao: "ignora hora/minuto/segundo da entrada",
      data: new Date(2026, 0, 1, 23, 59, 59),
      esperado: new Date(Date.UTC(2026, 0, 1, 0, 0, 0, 0)),
    },
  ])("$descricao", ({ data, esperado }) => {
    expect(parseAppointmentDate(data)).toEqual(esperado)
  })
})

describe("getDayRange", () => {
  test.each([
    {
      descricao: "retorna início e fim do dia em UTC",
      appointmentDate: new Date(Date.UTC(2026, 6, 9, 0, 0, 0, 0)),
      startDate: new Date(Date.UTC(2026, 6, 9, 0, 0, 0, 0)),
      endDate: new Date(Date.UTC(2026, 6, 9, 23, 59, 59, 999)),
    },
    {
      descricao: "usa componentes UTC mesmo quando a data tem hora intermediária",
      appointmentDate: new Date(Date.UTC(2026, 6, 9, 14, 30, 0, 0)),
      startDate: new Date(Date.UTC(2026, 6, 9, 0, 0, 0, 0)),
      endDate: new Date(Date.UTC(2026, 6, 9, 23, 59, 59, 999)),
    },
  ])("$descricao", ({ appointmentDate, startDate, endDate }) => {
    expect(getDayRange(appointmentDate)).toEqual({ startDate, endDate })
  })

  test("funciona em cadeia com parseAppointmentDate", () => {
    const parsed = parseAppointmentDate(new Date(2026, 6, 9, 18, 0, 0))
    const range = getDayRange(parsed)

    expect(range).toEqual({
      startDate: new Date(Date.UTC(2026, 6, 9, 0, 0, 0, 0)),
      endDate: new Date(Date.UTC(2026, 6, 9, 23, 59, 59, 999)),
    })
  })
})
