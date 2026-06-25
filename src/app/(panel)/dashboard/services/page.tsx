
import { redirect } from "next/navigation"
import { ServicesContent } from "./_componets/services-content"
import getSession from "@/lib/getSession"
import { Suspense } from "react"


export default async function services() {
    const session = await getSession()

    if (!session) {
        redirect("/")
    }

    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <ServicesContent userId={session.user?.id!} />
        </Suspense>
    )
}