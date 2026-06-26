"use server"

import { auth } from "@/lib/auth";
import { serviceFormSchema, type ServiceFormData } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { canPermission } from "@/utils/permissions/canPermission";


type FromSchema = ServiceFormData

export async function createNewService(formData: FromSchema) {
    const session = await auth();

    if (!session?.user?.id) {
        return {
            error: " Falha ao cadastrar serviço"
        }
    }

    const schema = serviceFormSchema.safeParse(formData);

    if (!schema.success) {
        return {
            error: schema.error.issues[0].message
        }
    }

    const permission = await canPermission({ type: "service" })
    if (!permission.hasPermission) {
        return {
            error: permission.expired
                ? "Seu período de teste expirou. Assine um plano para cadastrar serviços."
                : "Limite de serviços do seu plano atingido."
        }
    }

    try {
        const newService = await prisma.service.create({
            data: {
                name: schema.data.name,
                price: schema.data.price,
                duration: schema.data.duration,
                userId: session.user.id,
            }
        })

        revalidatePath("/dashboard/services")
        return {
            data: newService
        }

    } catch (_err) {
        return {
            error: "Falha ao cadastrar serviço"
        }
    }
}