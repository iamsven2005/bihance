import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest, 
  { params }: { params: { value1: string; } }
) {
  const { value1 } = params;

  try {
    const event = await db.board.create({
      data: {
        id: value1,
      },
    });

    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    console.error("Failed to process request:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
