import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
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
