import { db } from "@/lib/db";
import { payroll, user } from "@prisma/client";
import PayrollList from "./PayrollList";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import AddPayroll from "./Addpayroll";
import { notFound, redirect } from "next/navigation";

interface Props {
  params: {
    eventId: string;
  };
}

const View = ({ params }: Props) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { userId } = auth();
      if (!userId) {
        return reject(notFound());
      }

      const members = await db.payroll.findMany({
        where: {
          eventid: params.eventId,
        },
        include: {
          typepay: true,
        },
      });

      const event = await db.event.findUnique({
        where: {
          eventid: params.eventId,
        },
      });

      if (!event) {
        return resolve(redirect("/edit-event"));
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

      return resolve(
        <div className="p-5">
          <div className="flex justify-between m-5">
            <h1 className="font-bold text-xl">Payroll for {event?.name}</h1>
            <Button asChild>
              <Link href="/event">Events</Link>
            </Button>
            <Button asChild>
              <Link href="/template">Template</Link>
            </Button>
          </div>
          <div className="p-5 rounded-xl">
            <AddPayroll eventId={params.eventId} />
            <PayrollList members={members} userMap={userMap} />
          </div>
        </div>
      );
    } catch (error) {
      return reject(error);
    }
  });
};

export default View;
