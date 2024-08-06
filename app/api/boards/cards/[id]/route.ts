//rename list
import { NextRequest, NextResponse } from 'next/server';
import { db } from "@/lib/db";
import { Auditlog } from '@/lib/create-audit-log';
import { ACTION, TYPE } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { title, description } = await req.json();

  try {
    const card = await db.card.update({
      where: { id: params.id },
      data: { title, description },
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

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const card = await db.card.delete({
      where: { id: params.id },
    });
    await Auditlog({
      Id: card.id,
      title: card.title,
      type: TYPE.card,
      action: ACTION.DELETE
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
