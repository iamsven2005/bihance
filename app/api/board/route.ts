import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {  
  try {
    await revalidatePath("/board")
    return NextResponse.json({ revalidated: true });
  } catch (err: any) {
    return NextResponse.json({ revalidated: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {  
  try {
    const { boardId } = await req.json();
    const board = await db.board.create({
      data:{
        id: boardId
      }
    })
    return NextResponse.json({ revalidated: true });
  } catch (err: any) {
    return NextResponse.json({ revalidated: false, error: err.message }, { status: 500 });
  }
}


export async function DELETE(req: NextRequest) {  
  try {
    const { boardId } = await req.json();
    console.log(boardId)
    const board = await db.board.delete({
      where:{
        id: boardId
      }
    })
    return NextResponse.json({ revalidated: true });
  } catch (err: any) {
    return NextResponse.json({ revalidated: false, error: err.message }, { status: 500 });
  }
}