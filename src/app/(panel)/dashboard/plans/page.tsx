import { GridPlans } from "./components/grid-plans"
import { getSubscription } from "@/utils/get-subscription"
import { auth } from "@/lib/auth"
import { SubscriptionDetail } from "./components/subscription-detail"
import { isActiveSubscriptionStatus } from "@/utils/subscription-status"

export default async function Plans() {

    const session = await auth()
    const userId = session!.user!.id

    const subscritpion = await getSubscription({ userId })

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
