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