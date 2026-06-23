
"use server"

import prisma from '@/lib/prisma'
import { z } from 'zod'

const formSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  email: z.string().email("O email é obrigatório"),
  phone: z.string().min(1, "O telefone é obrigatório"),
  date: z.date(),
  serviceId: z.string().min(1, "O serviço é obrigatório"),
  time: z.string().min(1, "O horário é obrigatório"),
  clinicId: z.string().min(1, "A clínica é obrigatória"),
})

type FormSchema = z.infer<typeof formSchema>

export async function createNewAppointment(formData: FormSchema) {
  const schema = formSchema.safeParse(formData)

  if (!schema.success) {
    console.error("Validação falhou:", schema.error.issues)
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

    const year = selectedDate.getFullYear()
    const month = selectedDate.getMonth()
    const day = selectedDate.getDate()

    const appointmentDate = new Date(Date.UTC(year, month, day, 0, 0, 0, 0))

    console.log("Criando agendamento com:", {
      name: data.name,
      email: data.email,
      phone: data.phone,
      time: data.time,
      appointmentDate,
      serviceId: data.serviceId,
      userId: data.clinicId
    })

    const newAppointment = await prisma.appointment.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        time: data.time,
        appointmentDate: appointmentDate,
        serviceId: data.serviceId,
        userId: data.clinicId
      }
    })

    console.log("Agendamento criado com sucesso:", newAppointment.id)

    return {
      data: newAppointment
    }

  } catch (err) {
    console.error("Erro ao cadastrar agendamento:", err)
    return {
      error: "Erro ao cadastrar agendamento"
    }
  }
}