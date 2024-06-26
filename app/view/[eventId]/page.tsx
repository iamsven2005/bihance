import { db } from "@/lib/db";
import { payroll, user } from "@prisma/client";
import AddPayroll from "./Addpayroll";
import PayrollList from "./PayrollList";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Props {
  params: {
    eventId: string;
  };
}

const View = async ({ params }: Props) => {
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
    <div>
        <Link href="/event">
        <Button>
            Events
        </Button>
        </Link>
      <h1>Payroll for {event?.name}</h1>
      
      <AddPayroll eventId={params.eventId} />
      <PayrollList members={members} userMap={userMap} />
    </div>
  );
};

export default View;
