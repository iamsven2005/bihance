import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    try {
      const templates = await db.typepayTemplate.findMany();
      return NextResponse.json({ templates }, { status: 200 });
    } catch (error) {
      console.error("Failed to fetch templates:", error);
      return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 });
    }
  }
  
export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, day, shift, pay } = await req.json();

  try {
    const template = await db.typepayTemplate.create({
      data: {
        name,
        day,
        shift,
        pay,
      },
    });

    return NextResponse.json({ template }, { status: 201 });
  } catch (error) {
    console.error("Failed to create template:", error);
    return NextResponse.json({ error: "Failed to create template" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { templateId: string } }) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { day, shift, pay } = await req.json();

  try {
    const template = await db.typepayTemplate.update({
      where: { id: params.templateId },
      data: { day, shift, pay },
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

export async function DELETE(req: Request, { params }: { params: { templateId: string } }) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Delete the template and nullify the templateId in typepay entries
    await db.typepayTemplate.delete({
      where: { id: params.templateId },
    });

    return NextResponse.json({ message: "Template deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete template:", error);
    return NextResponse.json({ error: "Failed to delete template" }, { status: 500 });
  }
}
