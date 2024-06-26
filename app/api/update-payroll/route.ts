import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { userId: updateUserId, weekday, weekend } = await req.json();

  try {
    await db.payroll.updateMany({
      where: {
        userId: updateUserId,
      },
      data: {
        weekday,
        weekend,
      },
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to update payroll" }), { status: 500 });
  }
}
