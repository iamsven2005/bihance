import { NextRequest, NextResponse } from 'next/server';
import { db } from "@/lib/db";
import { Auditlog } from '@/lib/create-audit-log';
import { ACTION, TYPE } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs/server';

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
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { userId, orgId } = auth();

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (!orgId) {
      return NextResponse.json({ message: 'Organization is required' }, { status: 400 });
    }

    const user = await db.user.findFirst({
      where: {
        clerkId: userId,
      },
      select: {
        board: true,
      },
    });

    if (!user || !user.board) {
      return NextResponse.json({ message: 'User or board not found' }, { status: 404 });
    }

    const boarddet = await db.board.findFirst({
      where: {
        id: user.board,
      },
      include: {
        list: true,
      },
    });

    if (!boarddet || !boarddet.id) {
      return NextResponse.json({ message: 'Board not found' }, { status: 404 });
    }

    const lists = await db.list.findMany({
      where: {
        boardId: boarddet.id,
        board: {
          orgId,
        },
      },
      include: {
        card: {
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    });

    const auditItems = await db.audit.findMany({
      where: {
        orgId,
      },
    });

    return NextResponse.json({
      boarddet,
      lists,
      auditItems,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}