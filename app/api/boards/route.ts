import { NextResponse } from 'next/server';
import { auth } from "@clerk/nextjs/server";
import { db } from '@/lib/db';

export async function GET(request: Request) {
  const { orgId } = auth();

  if (!orgId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const boards = await db.board.findMany({
    where: {
      orgId: orgId,
    },
  });

  return NextResponse.json(boards);
}

export async function POST(request: Request) {
    const { orgId } = auth();
    const { title, imageId, imageThumbUrl, imageFullUrl, username, link } = await request.json();
  
    if (!orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    const board = await db.board.create({
      data: {
        title,
        orgId,
        imageId,
        imageThumbUrl,
        imageFullUrl,
        username,
        link,
      },
    });
  
    return NextResponse.json(board);
  }
  

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const boardId = searchParams.get('id');
  
  if (!boardId) {
    return NextResponse.json({ error: 'Board ID is required' }, { status: 400 });
  }

  await db.board.delete({
    where: {
      id: boardId,
    },
  });

  return NextResponse.json({ success: true });
}

export async function PATCH(request: Request) {
    const { id, title, imageId, imageThumbUrl, imageFullUrl, username, link } = await request.json();
  
    if (!id || !title) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }
  
    const updatedBoard = await db.board.update({
      where: { id },
      data: {
        title,
        imageId,
        imageThumbUrl,
        imageFullUrl,
        username,
        link,
      },
    });
  
    return NextResponse.json(updatedBoard);
  }
  
