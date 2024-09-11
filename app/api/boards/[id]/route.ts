import { NextRequest, NextResponse } from 'next/server';
import { db } from "@/lib/db";
import { auth } from '@clerk/nextjs/server';


export async function GET(request: Request) {
  try {
    const { userId, orgId } = auth();
    if (!userId || !orgId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findFirst({
      where: { clerkId: userId },
      select: { board: true },
    });

    if (!user || !user.board) {
      return NextResponse.json({ message: "User or board not found" }, { status: 404 });
    }

    return NextResponse.json({
      boardId: user.board,
      orgId,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}