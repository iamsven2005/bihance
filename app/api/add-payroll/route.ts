import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { email, weekday, weekend, eventId } = await req.json();

  try {
    const user = await db.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    await db.payroll.create({
      data: {
        userId: user.clerkId,
        weekday,
        weekend,
        eventid: eventId,
      },
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to add payroll" }), { status: 500 });
  }
}
