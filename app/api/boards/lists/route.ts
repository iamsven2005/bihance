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
    // Authenticate the user using Clerk
    const { userId } = auth();

    // Ensure the user is authenticated
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Parse the JSON body of the request
    const { boardId, title } = await req.json();

    // Check if the required data is provided
    if (!boardId || !title) {
      return NextResponse.json({ message: 'Board ID and Title are required' }, { status: 400 });
    }

    // Find the last list to determine the new order
    const last = await db.list.findFirst({
      where: { boardId: boardId },
      orderBy: { order: "desc" },
      select: { order: true }
    });

    // Calculate the new order
    const newOrder = last ? last.order + 1 : 1;

    // Create a new list
    const newList = await db.list.create({
      data: {
        title,
        boardId,
        order: newOrder,
      },
    });
    await Auditlog({
      Id: newList.id,
      title: newList.title,
      type: TYPE.list,
      action: ACTION.CREATE
    })

    return NextResponse.json(newList, { status: 200 });
  } catch (error) {
    console.error('Error creating list:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    revalidatePath("/board")
  }
}
