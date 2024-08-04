import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// API route for adding a typepay entry
export async function POST(req: NextRequest) {
  try {
    // Ensure the request method is POST
    if (req.method !== "POST") {
      return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
    }

    const { payrollId, day, shift, pay } = await req.json();

    // Validate the request payload
    if (!payrollId || !day || !shift || pay === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create a new typepay entry in the database
    await db.typepay.create({
      data: {
        payrollId,
        day,
        shift,
        pay,
      },
    });

    // Return success response
    return NextResponse.json(
      { message: "Typepay entry added successfully" },
      { status: 200 }
    );
  } catch (error) {
    // Log the error and return a generic error response
    console.error("Failed to add typepay entry:", error);
    return NextResponse.json(
      { error: "Failed to add typepay entry" },
      { status: 500 }
    );
  }
}
