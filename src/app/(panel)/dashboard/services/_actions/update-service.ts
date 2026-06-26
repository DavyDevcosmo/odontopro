"use server"

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { updateServiceFormSchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import type { z } from "zod";


type FromSchema = z.infer<typeof updateServiceFormSchema>

export async function updateService(formData: FromSchema) {
      const session = await auth();
    
        if (!session?.user?.id) {
            return {
                error: " Falha ao atualizar serviço"
            }
        }
    
        const schema = updateServiceFormSchema.safeParse(formData);
    
        if (!schema.success) {
            return {
                error: schema.error.issues[0].message
            }
        }

        try {

            await prisma.service.update({
                where: {
                    id: formData.serviceId,
                    userId: session?.user?.id,
                },
                data: {
                    name: formData.name,
                    price: formData.price,
                    duration: formData.duration < 30 ? 30 : formData.duration,
                }
            })

            revalidatePath("/dashboard/services")

            return{
                data: "Serviço atualizado com S de sucesso"
            }
        } catch (_err) {
            return{
                error: " Falha ao atualizar serviço"
            }
        }

}