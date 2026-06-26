
"use server"

import prisma from '@/lib/prisma'
import { appointmentFormSchema, type AppointmentFormData } from '@/lib/schemas'
import {
  getBlockedSlots,
  getDayRange,
  hasSlotConflict,
  parseAppointmentDate,
} from '@/utils/appointments/slot-blocking'

type FormSchema = AppointmentFormData

function isUniqueConstraintError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code: string }).code === "P2002"
  )
}

export async function createNewAppointment(formData: FormSchema) {
  const schema = appointmentFormSchema.safeParse(formData)

  if (!schema.success) {
    return {
      error: schema.error.issues[0].message
    }
  }

  const data = schema.data

  try {
    const selectedDate = new Date(data.date)

    if (isNaN(selectedDate.getTime())) {
      return { error: "Data inválida" }
    }

    const appointmentDate = parseAppointmentDate(selectedDate)
    const { startDate, endDate } = getDayRange(appointmentDate)

    const newAppointment = await prisma.$transaction(async (tx) => {
      const service = await tx.service.findFirst({
        where: {
          id: data.serviceId,
          userId: data.clinicId,
          status: true,
        },
      })

      if (!service) {
        throw new Error("SERVICE_NOT_FOUND")
      }

      const clinic = await tx.user.findUnique({
        where: { id: data.clinicId },
        select: { times: true, status: true },
      })

      if (!clinic || !clinic.status) {
        throw new Error("CLINIC_UNAVAILABLE")
      }

      const userTimes = (clinic.times as string[]) ?? []

      if (!userTimes.includes(data.time)) {
        throw new Error("INVALID_TIME")
      }

      const existingAppointments = await tx.appointment.findMany({
        where: {
          userId: data.clinicId,
          appointmentDate: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: { service: true },
      })

      const blockedSlots = getBlockedSlots(userTimes, existingAppointments)

      if (hasSlotConflict(userTimes, blockedSlots, data.time, service.duration)) {
        throw new Error("SLOT_UNAVAILABLE")
      }

      return tx.appointment.create({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          time: data.time,
          appointmentDate,
          serviceId: data.serviceId,
          userId: data.clinicId,
        },
      })
    })

    return {
      data: newAppointment
    }

  } catch (err) {
    if (err instanceof Error) {
      switch (err.message) {
        case "SERVICE_NOT_FOUND":
          return { error: "Serviço não encontrado para esta clínica" }
        case "CLINIC_UNAVAILABLE":
          return { error: "Clínica indisponível no momento" }
        case "INVALID_TIME":
          return { error: "Horário inválido" }
        case "SLOT_UNAVAILABLE":
          return { error: "Horário não disponível. Escolha outro horário." }
      }
    }

    if (isUniqueConstraintError(err)) {
      return { error: "Horário não disponível. Escolha outro horário." }
    }

    console.error("Erro ao cadastrar agendamento:", err)
    return {
      error: "Erro ao cadastrar agendamento"
    }
  }
}
