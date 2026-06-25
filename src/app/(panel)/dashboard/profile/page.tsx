
import { redirect } from "next/navigation"
import { getUserData } from "./_data-access/get-info-user"
import getSession from "@/lib/getSession"
import { ProfileContent } from "./_componets/profile"



export default async function Profile() {
    const session = await getSession()
    const userId = session?.user?.id
    const email = session?.user?.email

    if (!userId && !email) {
        redirect("/")
    }

    const user = await getUserData({ userId, email: email ?? undefined })

    if (!user) {
        redirect("/dashboard")
    }
    return (
        <div>
            <ProfileContent user={user} />
        </div>
    )
}