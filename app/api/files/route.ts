import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

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

    const file = await db.files.create({
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
