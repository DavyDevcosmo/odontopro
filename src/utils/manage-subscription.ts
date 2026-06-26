/**
 * Salvar, atualizar ou deletar informações das assinaturas (subscription) no banco de  dados, sincronizando com Stripe.
 */

import prisma from "@/lib/prisma";
import { Plan } from "../../prisma/generated/prisma/enums";
import { stripe } from "./stripe";
import { planFromPriceId } from "./plan-from-price-id";

export async function manageSubscription(
    subscriptionId: string,
    customerId: string,
    _createAction = false,
    deleteAction = false,
    type?: Plan
) {
    const findUser = await prisma.user.findFirst({
        where: {
            stripe_customer_id: customerId
        }
    })

    if (!findUser) {
        throw new Error(`Stripe customer not linked to user: ${customerId}`)
    }

    if (subscriptionId && deleteAction) {
        await prisma.subscription.deleteMany({
            where: {
                userId: findUser.id
            }
        })
        return
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    const priceId = subscription.items.data[0].price.id
    const plan = type ?? planFromPriceId(priceId)

    const subscriptionData = {
        id: subscription.id,
        userId: findUser.id,
        status: subscription.status,
        priceId,
        plan,
    }

    const existing = await prisma.subscription.findUnique({
        where: {
            userId: findUser.id
        }
    })

    if (!existing) {
        await prisma.subscription.create({
            data: subscriptionData
        })
        return
    }

    if (existing.id !== subscription.id) {
        await prisma.subscription.delete({
            where: {
                userId: findUser.id
            }
        })

        await prisma.subscription.create({
            data: subscriptionData
        })
        return
    }

    await prisma.subscription.update({
        where: {
            id: existing.id
        },
        data: {
            status: subscription.status,
            priceId,
            plan,
        }
    })
}
