"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { subscriptionPlans } from "@/utils/plans";
import { Subscription } from "@prisma/client";
import { createPortalCustomer } from "../_actions/create-portal-customer";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";


interface SubscriptionDetailProps {
    subscription: Subscription;
}

export function SubscriptionDetail({ subscription }:
    SubscriptionDetailProps) {

    const subscriptionInfo = subscriptionPlans.find(plan => plan.id === subscription.plan)

    async function handleManegeSubscription() {
        const portal = await createPortalCustomer()

        if (portal.error) {
            toast.error("Ocorreu um erro ao criar o portal de assinatura")
        }

        window.location.href = portal.sessionId;

    }
    return (
        <Card className="w-full mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl">Seu Plano Atual</CardTitle>
                <CardDescription>Sua assinatura está ativa!
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg md:text-xl">
                        {subscription.plan === "BASIC" ? "BASIC" : "PROFESSIONAL"}
                    </h3>

                    <div className="bg-status-chip-confirmed-bg text-status-chip-confirmed-text w-fit px-4 py-1 rounded-md font-medium">
                        {subscription.status === "active" ? "ATIVO" : "INATIVO"}
                    </div>
                </div>

                <ul className="list-disc list-inside space-y-2">
                    {subscriptionInfo && subscriptionInfo.features.map(features => (
                        <li key={features}>{features}</li>
                    ))}
                </ul>
            </CardContent>
            <CardFooter>
                <Button onClick={handleManegeSubscription}>Gerenciar assinatura</Button>

            </CardFooter>


        </Card>
    )
}