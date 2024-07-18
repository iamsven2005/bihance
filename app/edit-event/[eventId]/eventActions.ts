"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateEvent(eventId: string, updates: { name: string; location: string; description: string; image: string; }) {
  try {
    await db.event.update({
      where: { eventid: eventId },
      data: updates,
    });
    revalidatePath(`/edit-event/${eventId}`);
  } catch (error) {
    console.error("Failed to update event:", error);
    throw new Error("Failed to update event");
  }
}

export async function deleteEvent(eventId: string) {
  try {
    await db.event.delete({
      where: { eventid: eventId },
    });
    redirect("/event");
  } catch (error) {
    console.error("Failed to delete event:", error);
    throw new Error("Failed to delete event");
  }
}
