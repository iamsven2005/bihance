import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(req: NextRequest, { params }: { params: { eventId: string } }) {
  const { eventId } = params;

  try {
    const files = await db.files.findMany({
      where: {
        eventId,
      },
    });

    return NextResponse.json(files, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch files:', error);
    return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 });
  }
}
