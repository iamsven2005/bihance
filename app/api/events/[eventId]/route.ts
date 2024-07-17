import { NextResponse, NextRequest } from 'next/server';
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const eventId = url.pathname.split("/").pop();

  if (!eventId) {
    return NextResponse.json({ error: "Event ID is missing" }, { status: 400 });
  }

  try {
    const event = await db.event.findUnique({
      where: {
        eventid: eventId,
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch event:', error);
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 });
  }
}
