import { NextResponse } from 'next/server';
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // First, get all event IDs related to the user from the payroll table
    const payrollEntries = await db.payroll.findMany({
      where: {
        userId: userId,
      },
      select: {
        eventid: true,
      },
    });

    // Extract the event IDs
    const eventIds = payrollEntries.map(entry => entry.eventid);

    // Now, get the event details from the event table
    const events = await db.event.findMany({
      where: {
        eventid: {
          in: eventIds,
        },
      },
    });

    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch events:', error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}
