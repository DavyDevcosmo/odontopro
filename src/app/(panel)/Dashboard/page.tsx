import Link from "next/link"
import getSesion from "../../../lib/getSession"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import { ButtonCopyLink } from "./_components/button-copy-link"
import { Reminders } from "./_components/reminders/reminders"
import { Appointments } from "./_components/appointments/appointments"
import { checkSubscription } from "@/utils/permissions/checkSubscription"
import { LabelSubscription } from "@/components/ui/labelSubscription"


export default async function Dashboard() {
    const session = await getSesion()


    if (!session) {
        redirect("/")
    }

    const subscription = await checkSubscription(session?.user?.id!)
    return (
        <main>
            <div className="space-x-2 flex items-center justify-end">
                <Link href={`/clinica/${session.user?.id}`}
                    target="_black"
                >
                    <Button className="bg-emerald-500 hover:bg-emerald-400 flex-1 md:flex-[0]">
                        <Calendar className="w-5 h-5 " />
                        <span>Novo agendamento</span>
                    </Button>
                </Link>

                <ButtonCopyLink userId={session.user?.id!} />
            </div>

            {subscription?.subscriptionStatus === "EXPIRED" && (
                <LabelSubscription expired={true} />
            )}

            {subscription?.subscriptionStatus === "TRIAL" && (
                <div className="bg-green-500 text-white text-sm md:text-base px-3 py-2 rounded-md">
                    <p className="font-semibold">{subscription?.message}</p>
                </div>
            )}

            {subscription?.subscriptionStatus !== "EXPIRED" && (
                <section className="grid grid-cols1 gap-4 lg:grid-cols-2 mt-4">
                    <Appointments userId={session.user?.id!} />

                    <Reminders userId={session.user?.id!} />
                </section>
            )}
        </main>
    )
}