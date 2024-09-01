import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { images } = await request.json();

    for (const image of images) {
      await db.image.update({
        where: { id: image.id },
        data: { order: image.order },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to reorder images:", error);
    return NextResponse.json({ error: "Failed to reorder images" }, { status: 500 });
  }
}
