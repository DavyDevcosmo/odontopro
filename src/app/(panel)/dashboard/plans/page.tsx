import { GridPlans } from "./components/grid-plans"
import { redirect } from "next/navigation"
import { getSubscription } from "@/utils/get-subscription"
import { auth } from "@/lib/auth"
import { SubscriptionDetail } from "./components/subscription-detail"
import { isActiveSubscriptionStatus } from "@/utils/subscription-status"

export default async function Plans() {

    const session = await auth()

    if (!session) {
        redirect("/")
    }

    const subscritpion = await getSubscription({ userId: session?.user?.id! })

    return (
        <div>
            {!isActiveSubscriptionStatus(subscritpion?.status) && (
                <GridPlans />
            )}

            {subscritpion && isActiveSubscriptionStatus(subscritpion.status) && (
                <SubscriptionDetail subscription={subscritpion} />
            )}
        </div>
    )
}