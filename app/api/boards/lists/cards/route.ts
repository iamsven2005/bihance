// app/api/boards/lists/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Auditlog } from '@/lib/create-audit-log';
import { ACTION, TYPE } from '@prisma/client';
import { revalidatePath } from 'next/cache';

// Define a named export for the POST method
export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const { listId, title, description } = await req.json();

    // Check if the required data is provided
    if (!listId || !title) {
      return NextResponse.json({ message: 'Board ID and Title are required' }, { status: 400 });
    }

    // Find the last list to determine the new order
    const last = await db.card.findFirst({
      where: { listId: listId },
      orderBy: { order: "desc" },
      select: { order: true }
    });

    // Calculate the new order
    const newOrder = last ? last.order + 1 : 1;

    // Create a new list
    const newList = await db.card.create({
      data: {
        title,
        listId,
        order: newOrder,
        description,
      },
    });
    await Auditlog({
      Id: newList.id,
      title: newList.title,
      type: TYPE.card,
      action: ACTION.CREATE
    })
    return NextResponse.json(newList, { status: 200 });
  } catch (error) {
    console.error('Error creating list:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally{
    revalidatePath("/board")
  }
}
