import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME as string,
    api_key: process.env.CLOUDINARY_KEY as string,
    api_secret: process.env.CLOUDINARY_SECRET as string
})

export const POST = auth(async function POST(request) {
    if (!request.auth?.user?.id) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const userId = request.auth.user.id

    try {
        const formData = await request.formData()
        const file = formData.get("file")

        if (!file || !(file instanceof File)) {
            return NextResponse.json({ error: "Arquivo não enviado" }, { status: 400 })
        }

        if (file.type !== "image/png" && file.type !== "image/jpeg") {
            return NextResponse.json({ error: "Formato de imagem invalido" }, { status: 400 })
        }

        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({ error: "Imagem muito grande (máx. 5 MB)" }, { status: 400 })
        }

        const arrayBuffer = await file.arrayBuffer()
        const buffer = new Uint8Array(arrayBuffer)

        const results = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({
                tags: [userId],
                public_id: userId,
            }, function (error, result) {
                if (error) {
                    reject(error)
                    return
                }
                resolve(result)
            }).end(buffer)
        })

        return NextResponse.json({ results })
    } catch (err) {
        console.error("Erro no upload Cloudinary:", err)
        return NextResponse.json({ error: "Falha ao enviar imagem" }, { status: 500 })
    }
})
