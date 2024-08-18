// File: C:\bihance\app\api\boards\reorderCards\route.ts

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server'; // Use the new imports for Request and Response

export async function PATCH(req: NextRequest) {
  try {
    const { boardId, sourceListId, destinationListId, sourceCardOrder, destinationCardOrder } = await req.json();

    if (!sourceCardOrder || !destinationCardOrder) {
      return NextResponse.json({ error: 'Card orders are required' }, { status: 400 });
    }

    if (sourceListId === destinationListId) {
      // Reorder cards within the same list
      await db.$transaction(
        sourceCardOrder.map((cardId: string, index: number) =>
          db.card.update({
            where: { id: cardId },
            data: { order: index },
          })
        )
      );
    } else {
      // Move card to a different list
      await db.$transaction([
        // Update source list
        ...sourceCardOrder.map((cardId: string, index: number) =>
          db.card.update({
            where: { id: cardId },
            data: { order: index },
          })
        ),
        // Update destination list
        ...destinationCardOrder.map((cardId: string, index: number) =>
          db.card.update({
            where: { id: cardId },
            data: { order: index, listId: destinationListId },
          })
        ),
      ]);
    }
    revalidatePath("/board")

    return NextResponse.json({ message: 'Card order updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Failed to update card order:', error);
    return NextResponse.json({ error: 'Failed to update card order' }, { status: 500 });
  }
}
