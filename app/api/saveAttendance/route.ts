import { NextResponse } from 'next/server';
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { imageurl, datetime, location, eventId } = await req.json();

    if (!imageurl || !eventId || !datetime) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const attendance = await db.attendance.create({
      data: {
        userId,
        imageurl,
        time: datetime,
        location,
        eventId: eventId,
      },
    });

    return NextResponse.json(attendance, { status: 200 });
  } catch (error) {
    console.error('Failed to save attendance:', error);
    return NextResponse.json({ error: "Failed to save attendance" }, { status: 500 });
  }
}
