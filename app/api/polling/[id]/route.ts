import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function PATCH(request: Request, { params }: any) {
  const { id } = params;
  const { title } = await request.json();

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const updatedEvent = await db.polling.update({
    where: { id },
    data: { title },
  });
  revalidatePath('/');

  return NextResponse.json(updatedEvent);
}
