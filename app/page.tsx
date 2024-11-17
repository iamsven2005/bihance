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
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Calendar } from "@/components/ui/calendar";
import { BellIcon, CalendarIcon, FileTextIcon, Share2Icon } from "lucide-react";
import Marquee from "@/components/ui/marquee";
import { AnimatedListDemo } from "@/components/magicui/ListDemo";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { AnimatedBeamMultipleOutputDemo } from "@/components/magicui/BeamDemo";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Contact from "./Contact";

const MainPage = async () => {
  const useSubcriptionData = getUserSubscription()
  const [userSubcription] = await Promise.all([useSubcriptionData
  ])
  const isPro = !!userSubcription?.isActive
  return (
    <div className="flex flex-col items-center justify-center mx-auto gap-5">
      <section className="z-10 text-center m-10 text-black dark:text-white gap-5 flex flex-col">
        <h1 className=" whitespace-pre-wrap font-bold text-6xl font-medium tracking-tighter">
        Bihance 
       </h1>
        <h2 className="text-2xl">
          End-to-end Event Management
        </h2>
        <SignedOut>
        <Link href="https://accounts.bihance.app/sign-in?redirect_url=https://www.bihance.app/" className="flex mx-auto">
          <ShimmerButton className="shadow-2xl">
            <span className="text-white">
              Get Started
            </span>
          </ShimmerButton>

        </Link>
        </SignedOut>
        <SignedIn>
        <Link href="/upload" className="flex mx-auto">
          <ShimmerButton className="shadow-2xl">
            <span className="text-white">
              Upload now
            </span>
          </ShimmerButton>

        </Link>
        </SignedIn>
        
      </section>
      <BentoGrid>
      {features.map((feature, idx) => (
        <BentoCard key={idx} {...feature} />
      ))}
    </BentoGrid>
      <section className="z-10 flex flex-col gap-5">
      <Contact/>
        <div className="flex items-center justify-center">
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

const files = [
  {
    name: "bitcoin.pdf",
    body: "Bitcoin is a cryptocurrency invented in 2008 by an unknown person or group of people using the name Satoshi Nakamoto.",
  },
  {
    name: "finances.xlsx",
    body: "A spreadsheet or worksheet is a file made of rows and columns that help sort data, arrange data easily, and calculate numerical data.",
  },
  {
    name: "logo.svg",
    body: "Scalable Vector Graphics is an Extensible Markup Language-based vector image format for two-dimensional graphics with support for interactivity and animation.",
  },
  {
    name: "keys.gpg",
    body: "GPG keys are used to encrypt and decrypt email, files, directories, and whole disk partitions and to authenticate messages.",
  },
  {
    name: "seed.txt",
    body: "A seed phrase, seed recovery phrase or backup seed phrase is a list of words which store all the information needed to recover Bitcoin funds on-chain.",
  },
];
 
const features = [
  {
    Icon: FileTextIcon,
    name: "Share your files",
    description: "Share files in your workspace or for events",
    href: "#",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-1",
    background: (
      <Marquee
        pauseOnHover
        className="absolute top-10 [--duration:20s] [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] "
      >
        {files.map((f, idx) => (
          <figure
            key={idx}
            className={cn(
              "relative w-32 cursor-pointer overflow-hidden rounded-xl border p-4",
              "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
              "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
              "transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none",
            )}
          >
            <div className="flex flex-row items-center gap-2">
              <div className="flex flex-col">
                <figcaption className="text-sm font-medium dark:text-white ">
                  {f.name}
                </figcaption>
              </div>
            </div>
            <blockquote className="mt-2 text-xs">{f.body}</blockquote>
          </figure>
        ))}
      </Marquee>
    ),
  },
  {
    Icon: BellIcon,
    name: "Notifications",
    description: "Get notified when something happens.",
    href: "#",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-2",
    background: (
      <AnimatedListDemo className="absolute right-2 top-4 h-[300px] w-full border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105" />
    ),
  },
  {
    Icon: Share2Icon,
    name: "All-in-one",
    description: "Supports 20+ features and counting",
    href: "#",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-2",
    background: (
      <AnimatedBeamMultipleOutputDemo />
    ),
  },
  {
    Icon: CalendarIcon,
    name: "Shift Tracking",
    description: "Use the calendar to filter shifts, track and manage work.",
    className: "col-span-3 lg:col-span-1",
    href: "#",
    cta: "Learn more",
    background: (
      <Calendar
        mode="single"
        selected={new Date(2022, 4, 11, 0, 0, 0)}
        className="absolute right-0 top-10 origin-top rounded-md border transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] group-hover:scale-105"
      />
    ),
  },
];
export default MainPage;