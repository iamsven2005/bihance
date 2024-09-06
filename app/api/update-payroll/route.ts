import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { typeid, day, shift, pay } = await req.json();

  try {
    // Update specific typepay entry
    const updatedTypepay = await db.typepay.update({
      where: { typeid },
      data: {
        day,    // Example of updating the day field
        shift,  // Example of updating the shift field
        pay,    // Example of updating the pay amount
      },
    });

    return new Response(JSON.stringify({ success: true, updatedTypepay }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to update typepay" }), { status: 500 });
  }
}