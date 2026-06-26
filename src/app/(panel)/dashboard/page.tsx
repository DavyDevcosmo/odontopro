import Link from "next/link"
import { auth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import { ButtonCopyLink } from "./_components/button-copy-link"
import { Reminders } from "./_components/reminders/reminders"
import { Appointments } from "./_components/appointments/appointments"
import { checkSubscription } from "@/utils/permissions/checkSubscription"
import { LabelSubscription } from "@/components/ui/labelSubscription"


export default async function Dashboard() {
    const session = await auth()
    const userId = session!.user!.id

    const subscription = await checkSubscription(userId)
    return (
        <main>
            <div className="space-x-2 flex items-center justify-end">
                <Link href={`/clinica/${userId}`}
                    target="_blank"
                >
                    <Button className="flex-1 md:flex-[0]">
                        <Calendar className="w-5 h-5 " />
                        <span>Novo agendamento</span>
                    </Button>
                </Link>

                <ButtonCopyLink userId={userId} />
            </div>

            {subscription?.subscriptionStatus === "EXPIRED" && (
                <LabelSubscription expired={true} />
            )}

            {subscription?.subscriptionStatus === "TRIAL" && (
                <div className="bg-status-trial-bar-bg text-status-trial-bar-text text-sm md:text-base px-3 py-2 rounded-md">
                    <p className="font-semibold">{subscription?.message}</p>
                </div>
            )}

            {subscription?.subscriptionStatus !== "EXPIRED" && (
                <section className="grid grid-cols1 gap-4 lg:grid-cols-2 mt-4">
                    <Appointments userId={userId} />

                    <Reminders userId={userId} />
                </section>
            )}
        </main>
    )
}
