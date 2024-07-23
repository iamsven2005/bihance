import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { userId } = auth();
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  try {
    const { eventId, url, name } = await req.json();

    if (!eventId || !url || !name) {
      return NextResponse.json({ error: 'Event ID, URL, and name are required' }, { status: 400 });
    }

    const file = await prisma.files.create({
      data: {
        eventId,
        url,
        name,
      },
    });

    return NextResponse.json(file, { status: 200 });
  } catch (error) {
    console.error('Failed to upload file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
