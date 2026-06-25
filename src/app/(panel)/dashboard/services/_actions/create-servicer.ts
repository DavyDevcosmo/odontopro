"use server"

import { auth } from "@/lib/auth";

import z from "zod";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";


const formSchema = z.object({
    name: z.string().min(1, { message: "O nome do servirço é obrigatório" }),
    price: z.number().min(1, { message: "O preço do serviço é obrigatório" }),
    duration: z.number(),
})

type FromSchema = z.infer<typeof formSchema>

export async function createNewService(formData: FromSchema) {
    const session = await auth();

    if (!session?.user?.id) {
        return {
            error: " Falha ao cadastrar serviço"
        }
    }

    const schema = formSchema.safeParse(formData);

    if (!schema.success) {
        return {
            error: schema.error.issues[0].message
        }
    }

    try {
        const newService = await prisma.service.create({
            data: {
                name: formData.name,
                price: formData.price,
                duration: formData.duration,
                userId: session.user.id,
            }
        })

        revalidatePath("/dashboard/services")
        return {
            data: newService
        }

    } catch (err) {
        console.log(err);
        return {
            error: "Falha ao cafastrar serviço"
        }
    }
}