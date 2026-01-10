
import { redirect } from "next/navigation"
import { ServicesContent } from "./_componets/services-content"
import getSession from "@/lib/getSession"

export default async function services() {
    const session = await getSession()

    if (!session) {
        redirect("/")
    }

    return (
        <ServicesContent userId={session.user?.id!} />
    )
}