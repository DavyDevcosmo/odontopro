"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import z from "zod"

export const reminderSchema = z.object({
    description: z.string().min(1, "A descrição do lembrete é obrigatória")
})

export type ReminderFormData = z.infer<typeof reminderSchema>

export function useReminderForm() {
    return useForm<ReminderFormData>({
        resolver: zodResolver(reminderSchema),
        defaultValues: {
            description: ""
        }
    })
}