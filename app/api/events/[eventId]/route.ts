import { NextResponse, NextRequest } from 'next/server';
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { UTApi } from 'uploadthing/server';

export async function GET(req: NextRequest) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const eventId = url.pathname.split("/").pop();

  if (!eventId) {
    return NextResponse.json({ error: "Event ID is missing" }, { status: 400 });
  }

  try {
    const event = await db.event.findUnique({
      where: {
        eventid: eventId,
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch event:', error);
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 });
  }
}
export async function DELETE(req: Request, { params }: { params: { eventId: string } }) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Step 1: Fetch all the files related to the event
    const files = await db.attendance.findMany({
      where: {
        eventId: params.eventId,
      },
      select: {
        imageurl: true, // Assuming 'imageurl' is the column where file URLs are stored
      },
    });

    if (files && files.length > 0) {
      const utapi = new UTApi(); // Initialize the UploadThing API

      // Step 2: Extract file URLs and delete them from UploadThing
      for (const file of files) {
        const url = file.imageurl;
        const fileKey = url.substring(url.lastIndexOf("/") + 1); 
        await utapi.deleteFiles(fileKey);
      }

      console.log("All associated files deleted");
    }

    await db.event.delete({
      where: { eventid: params.eventId },
    });

    return NextResponse.json({ message: "Event and associated files deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete event and files:', error);
    return NextResponse.json({ error: "Failed to delete event and files" }, { status: 500 });
  }
}

