import { NextRequest, NextResponse } from 'next/server';
import { db } from "@/lib/db";
import { ACTION, TYPE } from '@prisma/client';
import { Auditlog } from '@/lib/create-audit-log';
import { revalidatePath } from 'next/cache';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { description } = await req.json();

  try {
    const card = await db.card.update({
      where: { id: params.id },
      data: { description },
    });
    await Auditlog({
      Id: card.id,
      title: card.title,
      type: TYPE.card,
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