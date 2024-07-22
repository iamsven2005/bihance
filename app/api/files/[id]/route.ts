import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';


export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const files = await db.files.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(files, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch files:', error);
    return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 });
  }
}
