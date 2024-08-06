//rename list
import { NextRequest, NextResponse } from 'next/server';
import { db } from "@/lib/db";
import { revalidatePath } from 'next/cache';
import { Auditlog } from '@/lib/create-audit-log';
import { ACTION, TYPE } from '@prisma/client';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { title } = await req.json();

  try {
    const list = await db.list.update({
      where: { id: params.id },
      data: { title },
    });
    await Auditlog({
      Id: list.id,
      title: list.title,
      type: TYPE.list,
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
    const list = await db.list.delete({
      where: { id: params.id },
    });
    await Auditlog({
      Id: list.id,
      title: list.title,
      type: TYPE.list,
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
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const list = await db.list.findFirst({
      where: { id: params.id },
      include: {
        card: true,
      },
    });

    if (!list) {
      return new NextResponse(
        JSON.stringify({ error: "List not found" }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const last = await db.list.findFirst({
      where: { boardId: list.boardId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = last ? last.order + 1 : 1;

    const copiedList = await db.list.create({
      data: {
        boardId: list.boardId,
        title: `${list.title} - Copy`,
        order: newOrder,
        card: {
          createMany: {
            data: list.card.map((card) => ({
              title: card.title,
              description: card.description,
              order: card.order,
            })),
          },
        },
      },
      include: {
        card: true,
      },
    });
    await Auditlog({
      Id: copiedList.id,
      title: copiedList.title,
      type: TYPE.list,
      action: ACTION.CREATE
    })
    revalidatePath("/board")

    return new NextResponse(
      JSON.stringify({ message: "Copied List", data: copiedList }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error("Failed to copy list:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to copy list" }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}