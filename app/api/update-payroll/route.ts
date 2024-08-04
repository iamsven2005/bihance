import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { updateUserId, typepayId, day, shift, pay } = await req.json();

  try {
    // Update typepay entries based on typepayId
    const updatedTypepay = await db.typepay.updateMany({
      where: {
        payroll: {
          userId: updateUserId, // Ensure it matches the user's payroll
        },
        typeid: typepayId, // Update specific typepay entry
      },
      data: {
        day,    // Example of updating the day field
        shift,  // Example of updating the shift field
        pay,    // Example of updating the pay amount
      },
    });

    // Check if any records were updated
    if (updatedTypepay.count === 0) {
      return new Response(JSON.stringify({ error: "No records found to update" }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true, updatedTypepay }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to update typepay" }), { status: 500 });
  }
}
