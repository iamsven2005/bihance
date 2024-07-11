import { stripe } from '@/lib/stripe';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from "next/server";
import Stripe from "stripe";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    const body = await req.text();
    const signature = req.headers.get("Stripe-Signature") as string;
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!,
        );
    } catch (error: any) {
        return new NextResponse(`Webhook error: ${error.message}`, {
            status: 400,
        });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        );

        if (!session.metadata?.userId) {
            return new NextResponse("User ID is required", { status: 400 });
        }

        await prisma.userSubcription.create({
            data: {
                user_id: session.metadata.userId,
                stripeCustomerId: subscription.customer as string,
                stripeSubscriptionId: subscription.id,
                stripePriceId: subscription.items.data[0].price.id,
                stripeEnd: new Date(subscription.current_period_end * 1000),
            },
        });
    }

    if (event.type === "invoice.payment_succeeded") {
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        );

        await prisma.userSubcription.update({
            where: {
                stripeSubscriptionId: subscription.id,
            },
            data: {
                stripePriceId: subscription.items.data[0].price.id,
                stripeEnd: new Date(subscription.current_period_end * 1000),
            },
        });
    }

    return new NextResponse(null, { status: 200 });
}
