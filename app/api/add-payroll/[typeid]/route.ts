import { NextResponse } from 'next/server';
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function DELETE(req: Request, { params }: { params: { typeid: string } }) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await db.typepay.delete({
      where: { 
        typeid: params.typeid
       },
    });

    return NextResponse.json({ message: "Event deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete event:', error);
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}
export async function PATCH(req: Request, { params }: { params: { typeid: string } }) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { day, shift, pay } = await req.json();

    // Validate inputs
    if (!day || !shift || typeof pay !== 'number') {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Check if the typepay entry exists
    const typepayEntry = await db.typepay.findUnique({
      where: {
        typeid: params.typeid,
      },
    });

    if (!typepayEntry) {
      return NextResponse.json({ error: "Typepay entry not found" }, { status: 404 });
    }

    // Update the typepay entry
    await db.typepay.update({
      where: {
        typeid: params.typeid,
      },
      data: {
        day,
        shift,
        pay,
      },
    });

    return NextResponse.json({ message: "Typepay entry updated successfully" }, { status: 200 });
  } catch (error) {
    console.error('Failed to update typepay entry:', error);
    return NextResponse.json({ error: "Failed to update typepay entry" }, { status: 500 });
  }
}