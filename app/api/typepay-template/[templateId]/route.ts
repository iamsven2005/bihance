import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { templateId: string } }) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { day, shift, pay, name } = await req.json();

  try {
    const template = await db.typepayTemplate.update({
      where: { id: params.templateId },
      data: { day, shift, pay, name },
    });

    // Update all typepay entries associated with this template
    await db.typepay.updateMany({
      where: { templateId: params.templateId },
      data: { day, shift, pay },
    });

    return NextResponse.json({ template }, { status: 200 });
  } catch (error) {
    console.error("Failed to update template:", error);
    return NextResponse.json({ error: "Failed to update template" }, { status: 500 });
  }
}
export async function GET(req: Request, { params }: { params: { templateId: string } }) {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    try {
      const template = await db.typepayTemplate.findUnique({
        where: { id: params.templateId },
      });
  
      if (!template) {
        return NextResponse.json({ error: "Template not found" }, { status: 404 });
      }
  
      return NextResponse.json({ template }, { status: 200 });
    } catch (error) {
      console.error("Failed to retrieve template:", error);
      return NextResponse.json({ error: "Failed to retrieve template" }, { status: 500 });
    }
  }
  
  export async function DELETE(req: Request, { params }: { params: { templateId: string } }) {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    try {
      await db.typepayTemplate.delete({
        where: { id: params.templateId },
      });
  
      return NextResponse.json({ message: "Template deleted successfully" }, { status: 200 });
    } catch (error) {
      console.error("Failed to delete template:", error);
      return NextResponse.json({ error: "Failed to delete template" }, { status: 500 });
    }
  }
  