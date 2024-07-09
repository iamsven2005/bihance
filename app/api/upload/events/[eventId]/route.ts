import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function PATCH(req: Request, { params }: { params: { courseId: string } }) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { title, location, image, description } = await req.json();

    const data: any = {};
    if (title) data.name = title;
    if (location) data.location = location;
    if (image) data.image = image;
    if (description) data.description = description;

    if (Object.keys(data).length === 0) {
      console.error("No fields provided for update");
      return new NextResponse("No fields provided for update", { status: 400 });
    }

    const updatedCourse = await prisma.event.update({
      where: {
        eventid: params.courseId,
      },
      data,
    });

    return new NextResponse(JSON.stringify(updatedCourse), { status: 200 });
  } catch (error) {
    console.error("API/events/[courseId]", error);
    return new NextResponse("Internal API error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { courseId: string } }) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    const deletedEvent = await prisma.event.delete({
      where: {
        eventid: params.courseId,
      },
    });

    return NextResponse.json(deletedEvent);
  } catch (error) {
    console.log("API/events/[courseId]/delete", error);
    return new NextResponse("Cannot delete event", { status: 500 });
  }
}
