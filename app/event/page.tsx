import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server"; // Correct import for server-side authentication
import EventList from "./EventList"; // Client component
import { redirect } from "next/navigation";

const EventPage = async () => {
  const user = await currentUser();

  if (!user) {
    redirect("/");
    return null;
  }

  const events = await db.event.findMany({
    where: {
      managerId: user.id,
    },
  });

  return <EventList events={events} />;
};

export default EventPage;
