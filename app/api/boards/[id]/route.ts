import { NextRequest, NextResponse } from 'next/server';
import { db } from "@/lib/db";
import { Auditlog } from '@/lib/create-audit-log';
import { ACTION, TYPE } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { title } = await req.json();  // Parse JSON from the request body

  try {
    const board = await db.board.update({
      where: { id: params.id },
      data: { title },
    });
    await Auditlog({
      Id: board.id,
      title: board.title,
      type: TYPE.board,
      action: ACTION.UPDATE
    })
    revalidatePath("/board")

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
