import getSesion from "../../../lib/getSession"
import { redirect } from "next/navigation"

export default async function Dashboard() {
    const session = await getSesion()


    if (!session) {
        redirect("/")
    }

    return (
        <div>
            <h1>hello dashboard</h1>
        </div>
    )
}