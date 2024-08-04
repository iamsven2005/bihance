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
