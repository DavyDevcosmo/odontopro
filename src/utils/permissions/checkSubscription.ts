"use server"

import prisma from "@/lib/prisma"
import { TRIAL_DAYS } from "./trial-limits"
import { addDays, isAfter, differenceInDays } from "date-fns"

export async function checkSubscription(userId: string) {
    const user = await prisma.user.findFirst({
        where: {
            id: userId,
        },
        include: {
            subscription: true,
        }
    })

    if (!user) {
        throw new Error("Usuario nao encontrado")
    }

    if (user.subscription && user.subscription.status === 'active') {
        return {
            subscriptionStatus: "active",
            message: "Assinatura ativa.",
            planId: user.subscription.plan
        }
    }

    const trailEndDate = addDays(user.createdAt, TRIAL_DAYS)

    if (isAfter(new Date(), trailEndDate)) {
        return {
            subscriptionStatus: "EXPIRED",
            message: "Seu periodo de teste expirou.",
            planId: "TRIAL"
        }
    }

    const daysRemainig = differenceInDays(trailEndDate, new Date())

    return {
        subscriptionStatus: "TRIAL",
        message: `Você está no período de teste gratuito. Faltam ${daysRemainig} dias`,
        planId: "TRIAL"
    }
}