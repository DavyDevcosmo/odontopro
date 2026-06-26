"use server"
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { profileFormSchema, type ProfileFormData } from "@/lib/schemas";

type FormSchema = ProfileFormData

export async function updateProfileImage(imageUrl: string) {
    const session = await auth();

    if (!session?.user.id) {
        return { error: "Usuário não autenticado" };
    }

    if (!imageUrl.startsWith("https://")) {
        return { error: "URL de imagem inválida" };
    }

    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data: { image: imageUrl },
        });

        revalidatePath("/dashboard/profile");
        revalidatePath("/");
        revalidatePath(`/clinica/${session.user.id}`);

        return { data: "Imagem atualizada com sucesso!" };
    } catch (_err) {
        return { error: "Erro ao salvar imagem do perfil" };
    }
}

export async function updateProfile(formData: FormSchema) {
    const session = await auth();

    if (!session?.user.id){
        return{
            error: "Usuário não autenticado"
        }
    }

    const schema = profileFormSchema.safeParse(formData)

    if (!schema.success) {
        return {
            error: schema.error.issues[0]?.message ?? "Preencha todos os campos",
        }
    }

    try {
        await prisma.user.update({
            where: {
                id: session.user.id
            },

            data: {
                name: schema.data.name,
                address: schema.data.address,
                phone: schema.data.phone,
                status: schema.data.status,
                timeZone: schema.data.timeZone,
                times: schema.data.times || [],
            }
        })

        revalidatePath("/dashboard/profile")

        return {
            data: "Clinica atualizada com sucesso!"
        }
    } catch (_err) {
        return{
            error: "Erro ao atualizar a clinica"
        }
    }
}

     