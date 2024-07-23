import { db } from "@/lib/db";
import { payroll, user } from "@prisma/client";
import AddPayroll from "./Addpayroll";
import PayrollList from "./PayrollList";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { toast } from "sonner";
import Redirect from "@/components/redirect";

interface Props {
  params: {
    eventId: string;
  };
}

const View = async ({ params }: Props) => {
  const {userId} = auth()
  if(!userId){
    return <Redirect/>
  }
  const members = await db.payroll.findMany({
    where: {
      eventid: params.eventId,
    },
  });

  const event = await db.event.findUnique({
    where: {
      eventid: params.eventId,
    },
  });
  if(!event){
    return <Redirect/>
  }
  const userIds = members.map((member) => member.userId);

  const users = await db.user.findMany({
    where: {
      clerkId: {
        in: userIds,
      },
    },
  });

  const userMap: Record<string, user> = {};
  users.forEach((user) => {
    userMap[user.clerkId] = user;
  });

  return (
    <div className="p-5">
      <div className="flex justify-between m-5 ">
      <h1 className="font-bold text-xl">Payroll for {event?.name}</h1>
        <Link href="/event" className="btn">
            Events
        </Link>
      </div>
      <div className="m-5 bg-base-200 p-5 rounded-xl">
      <AddPayroll eventId={params.eventId} />
      <PayrollList members={members} userMap={userMap} />
      </div>

      

    </div>
  );
};

export default View;
