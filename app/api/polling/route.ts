import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
    const { imageId } = await request.json();
  
    const updatedImage = await db.polling.delete({
      where: { id: imageId },
    });
    revalidatePath('/');

    return NextResponse.json(updatedImage);
  }
  export async function POST(request: Request) {
    try {
      const { url, name, eventId } = await request.json();
  
      if (!url || !eventId || !name) {
        return NextResponse.json({ error: "Missing image URL, name, or event ID" }, { status: 400 });
      }
  
      const lastImage = await db.image.findFirst({
        where: { eventId },
        orderBy: { order: 'desc' },
      });
  
      const nextOrder = lastImage ? lastImage.order + 1 : 1;
  
      const newImage = await db.image.create({
        data: {
          url,
          name,
          eventId,
          order: nextOrder,
        },
      });
  
      return NextResponse.json(newImage);
    } catch (error) {
      console.error("Failed to save image:", error);
      return NextResponse.json({ error: "Failed to save image" }, { status: 500 });
    }
  }
  export async function PATCH(request: Request) {
    const {userId} = auth()
    if(!userId){
      return notFound()
    }
    const { title } = await request.json();
  
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
  
    const newEvent = await db.polling.create({
      data: { title, userId },
    });
    revalidatePath('/');
    return NextResponse.json(newEvent);
  }