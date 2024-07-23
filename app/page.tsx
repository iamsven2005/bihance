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
const MainPage = async() => {
  const useSubcriptionData = getUserSubscription()
  const [ userSubcription] = await Promise.all([useSubcriptionData
  ])
  const isPro = !!userSubcription?.isActive
  return ( 
  <div className="flex flex-col items-center justify-center mx-auto gap-5">
    <Image src="/logo.png"
    width={200}
    height={200}
    alt="Logo"/>
    <h1 className="font-bold text-5xl">Bihance</h1>
    <h1 className="text-xl">
      Your all-in-one
    </h1>
    <div className="h-20">
    <WordRotate
      className="text-4xl font-bold text-base-content h-20"
      words={["HR solution", "Shift system"]}
    />
    </div>

    <Card className="bg-base-100 w-96 text-base-content">
    <CardHeader>
    <CardTitle>
    About Bihance:
    </CardTitle>
    <CardDescription>
    &quot;Enhancing your business&quot;
    
    </CardDescription>
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>Cutting Edge</AccordionTrigger>
        <AccordionContent>
        Our cloud-based human resource management system leverages cutting-edge technology to revolutionize how businesses in these sectors operate. At its core, our solution features a mobile application that allows field employees to clock in and out using timestamp photos, ensuring accurate time tracking and location verification. This data seamlessly integrates with our comprehensive web dashboard, where managers can effortlessly oversee shift details, optimize scheduling, and streamline payroll processes.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Impact</AccordionTrigger>
        <AccordionContent>
        The impact of our technology extends far beyond mere convenience. By automating traditionally manual processes, we are helping businesses reduce administrative overhead, minimize payroll errors, and gain unprecedented insights into their workforce dynamics. This leads to significant cost savings, improved operational efficiency, and better decision-making capabilities.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Fairness and Transparency</AccordionTrigger>
        <AccordionContent>
        Moreover, our system promotes fairness and transparency in the workplace. Employees benefit from accurate time tracking and timely pay, while employers can ensure compliance with labor regulations more easily. This fosters a more positive work environment and can lead to improved job satisfaction and retention rates.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-4">
        <AccordionTrigger>
          Empowering

        </AccordionTrigger>
        <AccordionContent>
        As we continue to develop and refine our solution, we are not just creating a product – we are driving digital transformation in industries that have been underserved by technology. Our goal is to empower businesses of all sizes to optimize their operations, allowing them to focus on growth and innovation rather than administrative tasks.
        <br/>
        By supporting our initiative, you will be investing in the future of work, helping to modernize essential sectors of our economy, and contributing to the creation of more efficient, equitable, and productive workplaces across various industries.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
    </CardHeader>
    <CardContent className="flex flex-wrap gap-5 m-5 p-5 mx-auto ">
    <Link href="/event" className="btn btn-outline">
    Events
    </Link>
    <Link href="/upload" className="btn btn-outline">
    Upload
    </Link>
    <Link href="/attend" className="btn btn-outline">
    Attendance
    </Link>
    <Link href="/blog" className="btn btn-outline">
    Blog
    </Link>
    </CardContent>

    </Card>

    <Card className="bg-base-300 text-base-content w-96">
      <CardHeader>
      <CardTitle>
        Starter Plan $240 /yr
      </CardTitle>
      </CardHeader>
      <CardContent>
      <CardDescription>
      Powerful extra features for your growing business.
      </CardDescription>


      </CardContent>
      <CardFooter>
      <Payment
      hasActiveSubscription={isPro}/>
      </CardFooter>
    </Card>


  </div> );
}
 
export default MainPage;