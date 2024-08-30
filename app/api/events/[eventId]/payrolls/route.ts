import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: Request, { params }: { params: { eventId: string } }) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { eventId } = params;

  try {
    const payrolls = await db.payroll.findMany({
      where: {
        eventid: eventId,
      },
      include: {
        typepay: true,
      },
    });

    if (!payrolls) {
      return NextResponse.json({ error: "No payrolls found for this event" }, { status: 404 });
    }

    return NextResponse.json({ payrolls }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch payrolls:", error);
    return NextResponse.json({ error: "Failed to fetch payrolls" }, { status: 500 });
  }
}
