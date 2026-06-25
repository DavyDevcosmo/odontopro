import { GridPlans } from "./components/grid-plans"
import { redirect } from "next/navigation"
import { getSubscription } from "@/utils/get-subscription"
import { auth } from "@/lib/auth"
import { SubscriptionDetail } from "./components/subscription-detail"

export default async function Plans() {

    const session = await auth()

    if (!session) {
        redirect("/")
    }

    const subscritpion = await getSubscription({ userId: session?.user?.id! })

    return (
        <div>
            {subscritpion?.status !== "active" && (
                <GridPlans />
            )}

            {subscritpion?.status === "active" && (
                <SubscriptionDetail subscription={subscritpion} />
            )}
        </div>
    )
}