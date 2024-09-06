import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server"; // Correct import for server-side authentication
import EventList from "./EventList"; // Client component
import { notFound, redirect } from "next/navigation";

const Page = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const { userId } = auth();
      if (!userId) {
        return resolve(redirect("/"));
      }

      const creds = await db.user.findFirst({
        where: {
          clerkId: userId,
        },
      });

      if (!creds) {
        return resolve(redirect("/"));
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
      resolve(<EventList events={events} user={creds} polls={polls} />);
    } catch (error) {
      reject(error);
    }
  });
};

export default Page;
