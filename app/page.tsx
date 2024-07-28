import { getUserSubscription } from "@/actions/queries";
import Payment from "@/components/payment";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import WordRotate from "@/components/ui/rotate";
import Image from "next/image";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import DotPattern from "@/components/magicui/dot-pattern";
import { cn } from "@/lib/utils";
import ShimmerButton from "@/components/magicui/shimmer-button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
const MainPage = async () => {
  const useSubcriptionData = getUserSubscription()
  const [userSubcription] = await Promise.all([useSubcriptionData
  ])
  const isPro = !!userSubcription?.isActive
  return (
    <div className="flex flex-col items-center justify-center mx-auto gap-5">
      <section className="z-10 text-center m-10 text-black dark:text-white gap-5 flex flex-col">
        <h1 className=" whitespace-pre-wrap text-5xl font-medium tracking-tighter">
          Ehancing your business
        </h1>
        <h2>
          Bihance: Business Enhanced
        </h2>

        <Link href="/upload" className="flex mx-auto">
          <ShimmerButton className="shadow-2xl">
            <span className="text-white">
              Upload now
            </span>
          </ShimmerButton>

        </Link>
      </section>
      <section className="z-10 flex flex-col gap-5">
        <Card>
          <CardHeader>
            <CardTitle>
              Customer Centric

            </CardTitle>
            <CardDescription>
              We design with efficiency and ease of use in mind, allowing you to have ease in mind for your day to day operations.
            </CardDescription>

          </CardHeader>
          <CardContent className="gap-5 flex">
            <Button asChild>
              <Link href="/blog">
                Blog
              </Link>
            </Button>
            <Button asChild>
              <Link href="/event">
                Dashboard
              </Link>
            </Button>
            <Button asChild>
              <Link href="/vote">
                Vote Features
              </Link>
            </Button>

          </CardContent>
          <CardFooter className="flex flex-col">
            <CardDescription>Socials:
            </CardDescription>
            <div className="flex gap-5">
            <Link href="https://www.instagram.com/bihance.app?igsh=a2I4Z2d6ODlkbHQ4">
              <Avatar>
                <AvatarFallback>IG</AvatarFallback>
              </Avatar>
            </Link>
            <Link href="https://www.linkedin.com/company/bihance-app/">
              <Avatar>
                <AvatarFallback>In</AvatarFallback>
              </Avatar>
            </Link>
            </div>
            
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>$240 /mth</CardTitle>
            <CardDescription>
              Pay for pro to get better support
            </CardDescription>
          </CardHeader>
          <CardContent>

            <Payment
              hasActiveSubscription={isPro} />
          </CardContent>
        </Card>
      </section>
      <DotPattern
        width={20}
        height={20}
        cx={1}
        cy={1}
        cr={1}
        className={cn(
          "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]",
        )}
      />
    </div>);
}

export default MainPage;