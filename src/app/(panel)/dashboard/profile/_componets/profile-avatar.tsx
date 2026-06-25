"use client"

import Image from "next/image";
import { ChangeEvent, useState } from "react";
import semFoto from "../../../../../../public/foto1.png"
import { Loader, Upload } from "lucide-react";
import { toast } from "sonner";

interface AvatarProfileProps {
    avatarUrl: string | null;
    userId: string
}

export function AvatarProfile({ avatarUrl, userId }: AvatarProfileProps) {
    const [previewImage, setPreviewImage] = useState(avatarUrl)
    const [loading, setLoading] = useState(false);

    async function handleChange(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files[0]) {
            setLoading(true);
            const image = e.target.files[0];

            if (image.type !== 'image/jpeg' && image.type !== 'image/png') {
                toast.error("Formato de imagem inválido")
                setLoading(false);
                return;
            }

            const newFile = new File([image], userId, { type: image.type })
            const urlImage = await uploadImage(newFile)

            if (urlImage) {
                setPreviewImage(urlImage)
            }

            setLoading(false);
        }
    }

    async function uploadImage(image: File): Promise<string | null> {
        try {
            toast("Estamos enviando sua imagem...")
            const formData = new FormData();

            formData.append("file", image)
            formData.append("userId", userId)

            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/image/upload`, {
                method: "POST",
                body: formData
            })

            const data = await response.json()

            if (!response.ok) {
                toast.error("Erro ao enviar imagem")
                return null;
            }

            toast.success("Imagem alterada com sucesso!")
            return data.results.secure_url as string

        } catch (err) {
            toast.error("Erro inesperado ao enviar imagem")
            return null;
        }
    }

    return (
        <div className="relative w-40 h-40 md:w-48 md:h-48">
            <div className="relative flex items-center justify-center w-full">
                <span className="absolute cursor-pointer z-[2] bg-surface-card/80 p-2 rounded-full">
                    {loading
                        ? <Loader size={16} className="animate-spin text-content-primary" />
                        : <Upload size={16} className="text-content-primary" />
                    }
                </span>

                <input
                    type="file"
                    onChange={handleChange}
                    className="opacity-0 cursor-pointer relative z-50 w-48 h-48"
                />
            </div>

            <Image
                src={previewImage || semFoto}
                alt="foto do perfil da clinica"
                fill
                className="w-full h-48 object-cover rounded-full bg-surface-slot-hover"
                quality={100}
                priority
                sizes="(max-width: 480px) 100vw, (max-width: 1024px) 75vw, 60vw"
            />
        </div>
    )
}