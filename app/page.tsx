import { getUserSubscription } from "@/actions/queries";
import Payment from "@/components/payment";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import DotPattern from "@/components/magicui/dot-pattern";
import { cn } from "@/lib/utils";
import ShimmerButton from "@/components/magicui/shimmer-button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
const MainPage = async () => {
  const useSubcriptionData = getUserSubscription()
  const [userSubcription] = await Promise.all([useSubcriptionData
  ])
  const isPro = !!userSubcription?.isActive
  return (
    <div className="flex flex-col items-center justify-center mx-auto gap-5">
      <section className="z-10 text-center m-10 text-black dark:text-white gap-5 flex flex-col">
        <h1 className=" whitespace-pre-wrap text-5xl font-medium tracking-tighter">
        Automate your event now
        </h1>
        <h2>
          Bihance: Enhancing Your Business
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
            <CardDescription className="flex gap-5">
              <Link href={"/event"}>
              <Button>
              Dashboard
              </Button>
              </Link>
             
              <Link href={"/edit-event"}>
              <Button>
              Create Event
              </Button>
              </Link>

            </CardDescription>

          </CardHeader>

          
        </Card>
        <div className="flex items-center justify-center min-h-screen">
</div>

        <Card className="hidden">
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