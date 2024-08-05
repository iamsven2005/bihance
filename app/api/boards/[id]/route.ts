import { NextRequest, NextResponse } from 'next/server';
import { db } from "@/lib/db";

export async function PATCH(req: NextRequest) {
  const { searchParams } = new URL(req.url);  // Access the search parameters from the URL
  const id = searchParams.get('id');  // Get the board ID
  const { title } = await req.json();  // Parse JSON from the request body

  try {
    await db.board.update({
      where: { id: String(id) },
      data: { title },
    });

    return new NextResponse(JSON.stringify({ message: "Title updated successfully" }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Failed to update title:", error);
    return new NextResponse(JSON.stringify({ error: "Failed to update title" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
