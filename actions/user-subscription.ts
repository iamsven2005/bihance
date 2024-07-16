"use server"

import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils"
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserSubscription } from "./queries";

const returnUrl = absoluteUrl("/event");
export const createStripeUrl = async() => {
    const {userId} = await auth()
    const user = await currentUser()
    if (!userId || !user){
        throw new Error("Unauthorized") && redirect("/")
    }
    const userSubscription = await getUserSubscription()
    if (userSubscription && userSubscription.stripeCustomerId){
        const stripeSession = await stripe.billingPortal.sessions.create({
            customer: userSubscription.stripeCustomerId,
            return_url: returnUrl,
        })
        return {data: stripeSession.url}
    }
    const stripeSession = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        customer_email: user.emailAddresses[0].emailAddress,
        line_items:[
            {
                quantity:1,
                price_data:{
                    currency: "SGD",
                    product_data:{
                        name: "Bihance",
                        description: "Starter Plan",
                    },
                    unit_amount: 24000,
                    recurring:{
                        interval: "year",
                    }
                }
            }
        ],
        metadata: {
            userId,
        },
        success_url: returnUrl,
        cancel_url: returnUrl,
    })
    return{ data: stripeSession.url}
}