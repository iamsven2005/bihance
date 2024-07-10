"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { SignInButton, useUser } from "@clerk/nextjs"
import axios from "axios"
import { loadStripe } from "@stripe/stripe-js"
import { toast } from "sonner"
import { FadeText } from "@/components/magicui/fade-text"
import AnimatedShinyText from "@/components/magicui/animated-shiny-text"
import Link from "next/link"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false)
  const { user } = useUser();

  const handleCheckout = async (priceId: string, subscription: boolean) => {
    try {
      const { data } = await axios.post(`/api/payments/create-checkout-session`, {
        userId: user?.id, email: user?.emailAddresses?.[0]?.emailAddress, priceId, subscription
      });

      if (data.sessionId) {
        const stripe = await stripePromise;
        const response = await stripe?.redirectToCheckout({ sessionId: data.sessionId });
        return response
      } else {
        toast('Failed to create checkout session')
        return
      }
    } catch (error) {
      toast('Error during checkout')
      return
    }
  };

  const plans = [
    {
      title: "Basic",
      monthlyPrice: 10,
      yearlyPrice: 100,
      description: "Essential features you need to get started",
      features: ["Example Feature Number 1", "Example Feature Number 2", "Example Feature Number 3"],
      priceIdMonthly: "price_1PaUeNGZumt4oiwzivMfOtOF",
      priceIdYearly: "price_1PaUeNGZumt4oiwzivMfOtOF",
      actionLabel: "Get Started",
    },
    {
      title: "Pro",
      monthlyPrice: 25,
      yearlyPrice: 250,
      description: "Perfect for owners of small & medium businessess",
      features: ["Example Feature Number 1", "Example Feature Number 2", "Example Feature Number 3"],
      actionLabel: "Get Started",
      priceIdMonthly: "price_1PaUeNGZumt4oiwzivMfOtOF",
      priceIdYearly: "price_1PaUeNGZumt4oiwzivMfOtOF",
      popular: true,
    },
    {
      title: "Enterprise",
      price: "Custom",
      description: "Dedicated support and infrastructure to fit your needs",
      features: ["Example Feature Number 1", "Example Feature Number 2", "Example Feature Number 3", "Super Exclusive Feature"],
      actionLabel: "Contact Sales",
      priceIdMonthly: "price_1PaUeNGZumt4oiwzivMfOtOF",
      priceIdYearly: "price_1PaUeNGZumt4oiwzivMfOtOF",
      exclusive: true,
    },
  ]

  return (
    <main className="m-5 p-5">
      <section className="flex flex-col space-y-8 text-center m-5 p-5">
        <FadeText
          className="text-5xl font-bold text-black dark:text-white"
          direction="up"
          framerProps={{
            show: { transition: { delay: 0.2 } },
          }}
          text="The most comprehensive HR Platform"
        />
        <h1 className="mx-auto mt-4 max-w-2xl text-base/6 text-gray-600 sm:text-lg">
        Need more than just a excel sheet? Bihance is a complete suite of HR solutions to improve your business processes and manage your employees.
        </h1>
        <Button>
          <SignInButton>
            Get Started
          </SignInButton>
        </Button>

      </section>
      <section className="text-center">
        <h2 className="text-3xl lg:text-5xl font-bold">Sample Pricing Plans</h2>
        <p className="text-lg text-gray-400 pt-1">Use these sample pricing cards in your SAAS</p>
        <br />
      </section>
      <Tabs defaultValue="0" className="w-40 mx-auto" onValueChange={(value) => setIsYearly(parseInt(value) === 1)}>
        <TabsList className="py-6 px-2">
          <TabsTrigger value="0" className="text-base">Monthly</TabsTrigger>
          <TabsTrigger value="1" className="text-base">Yearly</TabsTrigger>
        </TabsList>
      </Tabs>
      <section className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-8 mt-8">
        {plans.map((plan) => (
          <Card
            key={plan.title}
            className={cn(`w-72 flex flex-col justify-between py-1 ${plan.popular ? "border-rose-400" : "border-zinc-700"} mx-auto sm:mx-0`, {
              "animate-background-shine bg-white dark:bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] transition-colors": plan.exclusive,
            })}
          >
            <div>
              <CardHeader className="pb-8 pt-4">
                {isYearly && plan.yearlyPrice && plan.monthlyPrice ? (
                  <div className="flex justify-between">
                    <CardTitle className="text-zinc-700 dark:text-zinc-300 text-lg">{plan.title}</CardTitle>
                    <div className={cn("px-2.5 rounded-xl h-fit text-sm py-1 bg-zinc-200 text-black dark:bg-zinc-800 dark:text-white", {
                      "bg-gradient-to-r from-orange-400 to-rose-400 dark:text-black ": plan.popular,
                    })}>
                      Save ${plan.monthlyPrice * 12 - plan.yearlyPrice}
                    </div>
                  </div>
                ) : (
                  <CardTitle className="text-zinc-700 dark:text-zinc-300 text-lg">{plan.title}</CardTitle>
                )}
                <div className="flex gap-0.5">
                  <h3 className="text-3xl font-bold">{plan.yearlyPrice && isYearly ? "$" + plan.yearlyPrice : plan.monthlyPrice ? "$" + plan.monthlyPrice : "Custom"}</h3>
                  <span className="flex flex-col justify-end text-sm mb-1">{plan.yearlyPrice && isYearly ? "/year" : plan.monthlyPrice ? "/month" : null}</span>
                </div>
                <CardDescription className="pt-1.5 h-12">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                {plan.features.map((feature: string) => (
                  <div key={feature} className="flex gap-2">
                    <CheckCircle2 size={18} className="my-auto text-green-400" />
                    <p className="pt-0.5 text-zinc-700 dark:text-zinc-300 text-sm">{feature}</p>
                  </div>
                ))}
              </CardContent>
            </div>
            <CardFooter className="mt-2">
              <Button onClick={() => handleCheckout(isYearly ? plan.priceIdYearly : plan.priceIdMonthly, true)} className="relative inline-flex w-full items-center justify-center rounded-md bg-black text-white dark:bg-white px-6 font-medium  dark:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                <div className="absolute -inset-0.5 -z-10 rounded-lg bg-gradient-to-b from-[#c7d2fe] to-[#8678f9] opacity-75 blur" />
                {plan.actionLabel}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </section>
    </main>
  )
}

export default Pricing;
