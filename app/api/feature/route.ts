import { NextResponse } from 'next/server';
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, description } = await req.json();

    if (!title || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const feature = await db.feature.create({
      data: {
        title,
        description,
      },
    });

    return NextResponse.json(feature, { status: 200 });
  } catch (error) {
    console.error('Failed to create feature:', error);
    return NextResponse.json({ error: "Failed to create feature" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const features = await db.feature.findMany({
      include: {
        _count: {
          select: { votes: true },
        },
        votes: {
          where: { userId: userId },
          select: { id: true },
        },
      },
    });

    const formattedFeatures = features.map(feature => ({
      ...feature,
      userHasVoted: feature.votes.length > 0,
    }));

    return NextResponse.json(formattedFeatures, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch features:', error);
    return NextResponse.json({ error: "Failed to fetch features" }, { status: 500 });
  }
}
