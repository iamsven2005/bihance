import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { name, location, description, image } = await req.json();

  try {
    const newEvent = await db.event.create({
      data: {
        name,
        location,
        description,
        image,
        managerId: userId,
      },
    });
    return new Response(JSON.stringify({ eventid: newEvent.eventid }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to create event" }), { status: 500 });
  }
}
