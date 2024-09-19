import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { UTApi } from 'uploadthing/server';


export async function GET(req: NextRequest, { params }: { params: { eventId: string } }) {
  const { userId } = auth();
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
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
export async function DELETE(req: NextRequest, { params }: { params: { eventId: string } }) {
  const { userId } = auth();

  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { eventId } = params;

  try {
    // Step 1: Find the file URL before deleting
    const fileRecord = await db.files.findFirst({
      where: {
        id: eventId,
      },
      select: {
        url: true, // Assuming 'url' contains the file's URL
      },
    });

    if (!fileRecord) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const fileUrl = fileRecord.url;
    const fileKey = fileUrl.substring(fileUrl.lastIndexOf('/') + 1); 
    const utapi = new UTApi();
    await utapi.deleteFiles(fileKey);
    await db.files.delete({
      where: {
        id: eventId,
      },
    });

    return NextResponse.json({ message: "File and record deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete file and record:', error);
    return NextResponse.json({ error: 'Failed to delete file and record' }, { status: 500 });
  }
}