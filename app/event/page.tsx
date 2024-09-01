import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server"; // Correct import for server-side authentication
import EventList from "./EventList"; // Client component
import { notFound, redirect } from "next/navigation";

const Page = async () => {
  const { userId } = auth();
  if (!userId) {
    redirect("/");
  }
  const creds = await db.user.findFirst({
    where: {
      clerkId: userId,
    },
  });
  if (!creds) {
    redirect("/")
  }

  const events = await db.event.findMany({
    where: {
      managerId: userId,
    },
    include: {
      attendances: true,
      files: true,
    },
  });
  const polls = await db.polling.findMany();

  return <EventList events={events} user={creds} polls={polls}/>;
};

export default Page;
