import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
    const { orgId } = auth();
  
    if (!orgId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    try {
      const events = await db.event.findMany({
        where: {
          orgId: orgId
        }
      });

  
      return NextResponse.json(events, { status: 200 });
    } catch (error) {
      console.error('Failed to fetch events:', error);
      return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
    }
  }