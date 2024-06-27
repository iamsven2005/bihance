import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { event } from "@prisma/client";
import Link from "next/link";
import { redirect } from "next/navigation";
import { toast } from "sonner";

const Event = async() => {
  const { userId } = auth();

    if (!userId) {
      return redirect("/")
    }

        const events = await db.event.findMany({
          where: {
            managerId: userId,
          },
        });
  return (
    <div className="flex flex-col p-5">
      <div className="flex flex-row items-center justify-between">
      <h1 className="font-bold text-2xl">
        All events:
        </h1>
        <Link href="/edit-event" className="btn">
        Create event
        </Link>
      </div>

        <div className="flex flex-wrap">
        {events.map((item: event) => (
        <div key={item.eventid} className="flex flex-col rounded-xl bg-base-200 shadow-lg gap-5 p-5 w-72 m-5 mx-auto">
            <img src={item.image} className="m-5 rounded-xl"/>
            <h1 className="font-bold text-2xl">
            {item.name}
            </h1>
            <p>
            About the event:
            <br/>
            {item.description}
            </p>
            <p>
            Location:
            <br/>
            {item.location}
            </p>
            <div className="flex flex-row gap-2">
            <Link href={`/edit-event/${item.eventid}`}>
            <Button>
            Edit
            </Button>
            </Link>
            <Link href={`/view/${item.eventid}`}>
            <Button>
            Employees
            </Button>
            </Link>
            <Link href={`/payment/${item.eventid}`}>
            <Button>
            Payroll
            </Button>
            </Link>
            </div>

        </div>
        

      ))}
        </div>
    </div>
  );
};

export default Event;
