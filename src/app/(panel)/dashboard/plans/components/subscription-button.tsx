"use client"

import { Button } from "@/components/ui/button"
import { createSubscription } from '../_actions/create-subscription'
import { toast } from 'sonner'
import { Plan } from "../../../../../../prisma/generated/prisma/enums"

interface SubscriptionButtonProps {
    type: Plan
}

export function SubscriptionButton({ type }: SubscriptionButtonProps) {

    async function handleCreateBilling() {
        const { url, error } = await createSubscription({ type: type })

        if (error) {
            toast.error(error)
            return;
        }

        if (url) {
            window.location.href = url
        }
    }

    return (
        <Button
            className={`w-full ${type === "PROFESSIONAL" && "bg-accent-primary hover:bg-accent-primary/90 text-white"}`}
            onClick={handleCreateBilling}

        >
            Ativar assinatura
        </Button>
    )
}