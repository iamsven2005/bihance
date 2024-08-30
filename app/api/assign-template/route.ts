import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { payrollId, templateId } = await req.json();

  try {
    const template = await db.typepayTemplate.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    await db.typepay.create({
      data: {
        payrollId,
        templateId: template.id,
        day: template.day,
        shift: template.shift,
        pay: template.pay,
      },
    });

    return NextResponse.json({ message: "Template assigned successfully" }, { status: 200 });
  } catch (error) {
    console.error("Failed to assign template:", error);
    return NextResponse.json({ error: "Failed to assign template" }, { status: 500 });
  }
}
