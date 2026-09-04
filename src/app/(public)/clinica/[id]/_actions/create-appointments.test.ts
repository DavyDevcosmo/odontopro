import type { AppointmentFormData } from "@/lib/schemas"
import { createNewAppointment } from "./create-appointments"

vi.mock("@/lib/prisma", () => ({
  default: { $transaction: vi.fn() },
}))

const prisma = (await import("@/lib/prisma")).default as unknown as {
  $transaction: ReturnType<typeof vi.fn>
}

const HORARIOS = ["08:00", "08:30", "09:00", "09:30", "10:00"]

const tx = {
  service: { findFirst: vi.fn() },
  user: { findUnique: vi.fn() },
  appointment: { findMany: vi.fn(), create: vi.fn() },
}

function formData(overrides: Partial<AppointmentFormData> = {}): AppointmentFormData {
  return {
    name: "Maria Silva",
    email: "maria@exemplo.com",
    phone: "11999998888",
    date: new Date(2026, 2, 10),
    serviceId: "service-1",
    time: "09:00",
    clinicId: "clinic-1",
    ...overrides,
  }
}

describe("createNewAppointment", () => {
  beforeEach(() => {
    prisma.$transaction.mockImplementation(async (cb: (t: typeof tx) => unknown) => cb(tx))

    tx.service.findFirst.mockResolvedValue({ id: "service-1", duration: 30 })
    tx.user.findUnique.mockResolvedValue({ times: HORARIOS, status: true })
    tx.appointment.findMany.mockResolvedValue([])
    tx.appointment.create.mockImplementation(async ({ data }: { data: unknown }) => ({
      id: "appointment-1",
      ...(data as object),
    }))

    vi.spyOn(console, "error").mockImplementation(() => {})
  })

  describe("validação do formulário", () => {
    test.each([
      { campo: "nome vazio", data: { name: "" }, mensagem: "O nome é obrigatório" },
      { campo: "serviço vazio", data: { serviceId: "" }, mensagem: "O serviço é obrigatório" },
      { campo: "horário vazio", data: { time: "" }, mensagem: "O horário é obrigatório" },
      { campo: "clínica vazia", data: { clinicId: "" }, mensagem: "A clínica é obrigatória" },
    ])("rejeita $campo sem abrir transação", async ({ data, mensagem }) => {
      const resultado = await createNewAppointment(formData(data))

      expect(resultado).toEqual({ error: mensagem })
      expect(prisma.$transaction).not.toHaveBeenCalled()
    })

    test("rejeita data inválida", async () => {
      const resultado = await createNewAppointment(formData({ date: new Date("nao-e-data") }))

      expect(resultado.error).toBeTruthy()
      expect(prisma.$transaction).not.toHaveBeenCalled()
    })
  })

  describe("regras de agendamento", () => {
    test("rejeita serviço inexistente ou de outra clínica", async () => {
      tx.service.findFirst.mockResolvedValue(null)

      await expect(createNewAppointment(formData())).resolves.toEqual({
        error: "Serviço não encontrado para esta clínica",
      })
    })

    test("busca somente serviços ativos da própria clínica", async () => {
      await createNewAppointment(formData())

      expect(tx.service.findFirst).toHaveBeenCalledWith({
        where: { id: "service-1", userId: "clinic-1", status: true },
      })
    })

    test("rejeita clínica inexistente", async () => {
      tx.user.findUnique.mockResolvedValue(null)

      await expect(createNewAppointment(formData())).resolves.toEqual({
        error: "Clínica indisponível no momento",
      })
    })

    test("rejeita clínica desativada", async () => {
      tx.user.findUnique.mockResolvedValue({ times: HORARIOS, status: false })

      await expect(createNewAppointment(formData())).resolves.toEqual({
        error: "Clínica indisponível no momento",
      })
    })

    test("rejeita horário fora da agenda da clínica", async () => {
      await expect(createNewAppointment(formData({ time: "23:00" }))).resolves.toEqual({
        error: "Horário inválido",
      })
    })

    test("rejeita clínica sem horários configurados", async () => {
      tx.user.findUnique.mockResolvedValue({ times: null, status: true })

      await expect(createNewAppointment(formData())).resolves.toEqual({
        error: "Horário inválido",
      })
    })

    test("rejeita horário já ocupado por outro agendamento", async () => {
      tx.appointment.findMany.mockResolvedValue([
        { time: "09:00", service: { duration: 30 } },
      ])

      await expect(createNewAppointment(formData())).resolves.toEqual({
        error: "Horário não disponível. Escolha outro horário.",
      })
    })

    test("rejeita horário bloqueado por um serviço longo anterior", async () => {
      tx.appointment.findMany.mockResolvedValue([
        { time: "08:00", service: { duration: 90 } },
      ])

      await expect(createNewAppointment(formData({ time: "09:00" }))).resolves.toEqual({
        error: "Horário não disponível. Escolha outro horário.",
      })
    })

    test("rejeita serviço longo que invade um horário já ocupado", async () => {
      tx.service.findFirst.mockResolvedValue({ id: "service-1", duration: 90 })
      tx.appointment.findMany.mockResolvedValue([
        { time: "10:00", service: { duration: 30 } },
      ])

      await expect(createNewAppointment(formData({ time: "09:00" }))).resolves.toEqual({
        error: "Horário não disponível. Escolha outro horário.",
      })
    })

    test("aceita horário livre logo após um agendamento existente", async () => {
      tx.appointment.findMany.mockResolvedValue([
        { time: "08:00", service: { duration: 30 } },
      ])

      const resultado = await createNewAppointment(formData({ time: "08:30" }))

      expect(resultado.error).toBeUndefined()
      expect(resultado.data).toBeDefined()
    })
  })

  describe("criação", () => {
    test("cria o agendamento normalizando a data para UTC", async () => {
      const resultado = await createNewAppointment(formData())

      expect(tx.appointment.create).toHaveBeenCalledWith({
        data: {
          name: "Maria Silva",
          email: "maria@exemplo.com",
          phone: "11999998888",
          time: "09:00",
          appointmentDate: new Date("2026-03-10T00:00:00.000Z"),
          serviceId: "service-1",
          userId: "clinic-1",
        },
      })
      expect(resultado.data).toMatchObject({ id: "appointment-1" })
    })

    test("busca os agendamentos do dia inteiro da clínica", async () => {
      await createNewAppointment(formData())

      expect(tx.appointment.findMany).toHaveBeenCalledWith({
        where: {
          userId: "clinic-1",
          appointmentDate: {
            gte: new Date("2026-03-10T00:00:00.000Z"),
            lte: new Date("2026-03-10T23:59:59.999Z"),
          },
        },
        include: { service: true },
      })
    })
  })

  describe("falhas inesperadas", () => {
    test("traduz a violação de unicidade em horário indisponível", async () => {
      tx.appointment.create.mockRejectedValue(Object.assign(new Error("unique"), { code: "P2002" }))

      await expect(createNewAppointment(formData())).resolves.toEqual({
        error: "Horário não disponível. Escolha outro horário.",
      })
    })

    test("reconhece a violação de unicidade lançada como objeto simples", async () => {
      tx.appointment.create.mockRejectedValue({ code: "P2002" })

      await expect(createNewAppointment(formData())).resolves.toEqual({
        error: "Horário não disponível. Escolha outro horário.",
      })
    })

    test("retorna erro genérico quando a transação falha", async () => {
      prisma.$transaction.mockRejectedValue(new Error("conexão perdida"))

      await expect(createNewAppointment(formData())).resolves.toEqual({
        error: "Erro ao cadastrar agendamento",
      })
      expect(console.error).toHaveBeenCalled()
    })
  })
})
