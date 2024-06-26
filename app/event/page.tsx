import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { event } from "@prisma/client";
import Link from "next/link";
import { redirect } from "next/navigation";

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
    <div className="flex flex-col container">
        <h1>
        All of your events:
        </h1>
        <Link href="/edit-event">
        Create
        </Link>
        <div className="flex m-5 p-5 flex-wrap">
        {events.map((item: event) => (
        <div key={item.eventid} className="flex flex-col rounded-xl bg-base-200 shadow-lg gap-5 p-5 w-40 m-5">
            <img src={item.image} className="m-5 rounded-xl"/>
            <h1 className="text-bold text-2xl">
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
            <Link href={`/edit-event/${item.eventid}`}>
            <Button>
            Click to edit
            </Button>
            </Link>
            <Link href={`/view/${item.eventid}`}>
            <Button>
            View employeees
            </Button>
            </Link>
        </div>
        

      ))}
        </div>
    </div>
  );
};

export default Event;
