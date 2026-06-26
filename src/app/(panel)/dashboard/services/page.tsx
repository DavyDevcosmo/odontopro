
import { auth } from "@/lib/auth"
import { ServicesContent } from "./_components/services-content"
import { Suspense } from "react"


export default async function services() {
    const session = await auth()
    const userId = session!.user!.id

    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <ServicesContent userId={userId} />
        </Suspense>
    )
}
