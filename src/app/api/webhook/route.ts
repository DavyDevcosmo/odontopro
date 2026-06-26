import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/utils/stripe'
import { manageSubscription } from '@/utils/manage-subcreption';
import { revalidatePath } from 'next/cache';
import { Plan } from '../../../../prisma/generated/prisma/enums';

function getWebhookSecret() {
    return process.env.STRIPE_WEBHOOK_SECRET ?? process.env.STRIPE_SECRET_WEBHOOK_KEY
}

function revalidateSubscriptionPages() {
    revalidatePath("/dashboard")
    revalidatePath("/dashboard/plans")
}

export const POST = async (request: Request) => {
    const signature = request.headers.get("stripe-signature");
    const webhookSecret = getWebhookSecret()

    if (!signature) {
        return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 })
    }

    if (!webhookSecret) {
        console.error("Missing STRIPE_WEBHOOK_SECRET or STRIPE_SECRET_WEBHOOK_KEY")
        return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })
    }

    try {
        const text = await request.text();

        const event = stripe.webhooks.constructEvent(
            text,
            signature,
            webhookSecret,
        )

        switch (event.type) {
            case "customer.subscription.deleted": {
                const payment = event.data.object as Stripe.Subscription;

                await manageSubscription(
                    payment.id,
                    payment.customer.toString(),
                    false,
                    true
                )

                revalidateSubscriptionPages()
                break;
            }
            case "customer.subscription.created":
            case "customer.subscription.updated": {
                const stripeSubscription = event.data.object as Stripe.Subscription;

                await manageSubscription(
                    stripeSubscription.id,
                    stripeSubscription.customer.toString(),
                    event.type === "customer.subscription.created",
                )

                revalidateSubscriptionPages()
                break;
            }
            case "checkout.session.completed": {
                const checkoutSession = event.data.object as Stripe.Checkout.Session;

                const type = checkoutSession?.metadata?.type ? checkoutSession?.metadata?.type : "BASIC";

                if (checkoutSession.subscription && checkoutSession.customer) {
                    await manageSubscription(
                        checkoutSession.subscription.toString(),
                        checkoutSession.customer.toString(),
                        true,
                        false,
                        type as Plan
                    )
                }

                revalidateSubscriptionPages()
                break;
            }

            default:
                console.log("Evento não tratado: ", event.type)
        }

        return NextResponse.json({ received: true })
    } catch (err) {
        console.error("ERRO NO WEBHOOK:", err)
        return NextResponse.json({ error: "Webhook handler failed" }, { status: 400 })
    }
}
