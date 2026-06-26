import z from "zod"

export const appointmentFormSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  email: z.string().email("O email é obrigatório"),
  phone: z.string().min(1, "O telefone é obrigatório"),
  date: z.date(),
  serviceId: z.string().min(1, "O serviço é obrigatório"),
  time: z.string().min(1, "O horário é obrigatório"),
  clinicId: z.string().min(1, "A clínica é obrigatória"),
})

export const serviceFormSchema = z.object({
  name: z.string().min(1, { message: "O nome do serviço é obrigatório" }),
  price: z.number().min(1, { message: "O preço do serviço é obrigatório" }),
  duration: z.number(),
})

export const profileFormSchema = z.object({
  name: z.string().min(1, { message: "o nome é obrigatório" }),
  address: z.string().optional(),
  phone: z.string().optional(),
  status: z.boolean(),
  timeZone: z.string().min(1, { message: "O time zone é obrigatório" }),
  times: z.array(z.string()),
})

export type AppointmentFormData = z.infer<typeof appointmentFormSchema>
export type ServiceFormData = z.infer<typeof serviceFormSchema>
export type ProfileFormData = z.infer<typeof profileFormSchema>

export const updateServiceFormSchema = serviceFormSchema.extend({
  serviceId: z.string().min(1, { message: "ID do serviço é obrigatório" }),
})
