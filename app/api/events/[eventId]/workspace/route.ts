import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function PATCH(req: NextRequest, { params }: { params: { eventId: string } }) {
  const { userId } = auth();
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { eventId } = params;
  const { workspaceId } = await req.json();

  try {
    await db.event.update({
      where: { eventid: eventId },
      data: { orgId: workspaceId },
    });

    revalidatePath(`/dashboard`);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to assign workspace:", error);
    return NextResponse.json({ error: "Failed to assign workspace" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { eventId: string } }) {
  const { userId } = auth();
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { eventId } = params;

  try {
    await db.event.update({
      where: { eventid: eventId },
      data: { orgId: null },
    });

    revalidatePath(`/dashboard`);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to remove workspace:", error);
    return NextResponse.json({ error: "Failed to remove workspace" }, { status: 500 });
  }
}
