
import { redirect } from "next/navigation"
import { getUserData } from "./_data-access/get-info-user"
import getSession from "@/lib/getSession"
import { ProfileContent } from "./_componets/profile"

export const dynamic = "force-dynamic"

export default async function Profile() {
    const session = await getSession()

    if (!session) {
        redirect("/")
    }

    const userId = session.user?.id
    const email = session.user?.email ?? undefined

    const user = await getUserData({ userId, email })

    if (!user) {
        redirect("/dashboard")
    }
    return (
        <div>
            <ProfileContent user={user} />
        </div>
    )
}