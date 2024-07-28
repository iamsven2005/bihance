import { NextResponse } from 'next/server';
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request, { params }: { params: { featureId: string } }) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const existingVote = await db.vote.findFirst({
      where: {
        userId,
        featureId: params.featureId,
      }
    });

    if (existingVote) {
      await db.vote.delete({
        where: {
          id: existingVote.id,
        }
      });
      return NextResponse.json({ message: "Vote deleted" }, { status: 200 });
    } else {
      const newVote = await db.vote.create({
        data: {
          userId,
          featureId: params.featureId,
        }
      });
      return NextResponse.json(newVote, { status: 201 });
    }
  } catch (error) {
    console.error('Failed to process vote:', error);
    return NextResponse.json({ error: "Failed to process vote" }, { status: 500 });
  }
}