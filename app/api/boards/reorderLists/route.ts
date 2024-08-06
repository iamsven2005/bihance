// File: C:\bihance\app\api\boards\reorderLists\route.ts

import { Auditlog } from '@/lib/create-audit-log';
import { db } from '@/lib/db';
import { ACTION, TYPE } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server'; 
export async function PATCH(req: NextRequest) {
  try {
    const { boardId, listOrder } = await req.json();

    if (!listOrder) {
      return NextResponse.json({ error: 'List order is required' }, { status: 400 });
    }

    const board = await db.board.update({
      where: { id: boardId },
      data: {
        list: {
          update: listOrder.map((listId: string, index: number) => ({
            where: { id: listId },
            data: { order: index },
          })),
        },
      },
    });
    await Auditlog({
      Id: board.id,
      title: board.title,
      type: TYPE.board,
      action: ACTION.UPDATE
    })
    revalidatePath("/board")

    return NextResponse.json({ message: 'List order updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Failed to update list order:', error);
    return NextResponse.json({ error: 'Failed to update list order' }, { status: 500 });
  }
}
