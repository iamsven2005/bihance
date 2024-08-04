// C:\bihance\app\api\add-typepay\route.ts

import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { payrollId, day, shift, pay } = await req.json();

    if (!payrollId || !day || !shift || pay === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create a new typepay entry
    await db.typepay.create({
      data: {
        payrollId,
        day,
        shift,
        pay,
      },
    });

    return NextResponse.json(
      { message: "Typepay entry added successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to add typepay entry:", error);
    return NextResponse.json(
      { error: "Failed to add typepay entry" },
      { status: 500 }
    );
  }
}

// Allow only POST requests
export const config = {
  methods: ["POST"],
};
