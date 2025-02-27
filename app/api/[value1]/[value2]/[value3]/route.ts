import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest, 
  { params }: { params: { value1: string; value2: string; value3: string } }
) {
  const { value1, value2, value3 } = params;

  try {
    const event = await db.board.create({
      data: {
        id: value1,
        one: value2,
        two: value3,
      },
    });

    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    console.error("Failed to process request:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
