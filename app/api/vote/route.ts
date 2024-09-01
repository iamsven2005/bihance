import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  const { imageId, selections } = await request.json();
  const updatedImage = await db.image.update({
    where: { id: imageId },
    data: {
      votes: {
        increment: 1,
      },
    },
  });

  return NextResponse.json(updatedImage);
}

export async function PATCH(request: Request) {
  const { imageId } = await request.json();

  const updatedImage = await db.image.update({
    where: { id: imageId },
    data: {
      votes: {
        decrement: 1,
      },
    },
  });

  return NextResponse.json(updatedImage);
}

export async function DELETE(request: Request) {
  const { imageId } = await request.json(); // Ensure imageId is extracted from the JSON body

  if (!imageId) {
    return NextResponse.json({ error: "Image ID is required" }, { status: 400 });
  }

  try {
    const deletedImage = await db.image.delete({
      where: { id: imageId },
    });

    return NextResponse.json(deletedImage);
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete the image" }, { status: 500 });
  }
}