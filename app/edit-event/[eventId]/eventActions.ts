"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateEventName(eventId: string, name: string) {
  await db.event.update({
    where: { eventid: eventId },
    data: { name },
  });
  revalidatePath(`/edit-event/${eventId}`);
}

export async function updateEventDescription(eventId: string, description: string) {
  await db.event.update({
    where: { eventid: eventId },
    data: { description },
  });
  revalidatePath(`/edit-event/${eventId}`);
}

export async function updateEventLocation(eventId: string, location: string) {
  await db.event.update({
    where: { eventid: eventId },
    data: { location },
  });
  revalidatePath(`/edit-event/${eventId}`);
}

export async function updateEventImage(eventId: string, url: string) {
  await db.event.update({
    where: { eventid: eventId },
    data: { image: url },
  });
  revalidatePath(`/edit-event/${eventId}`);
}

export async function deleteEvent(eventId: string) {
  await db.event.delete({
    where: { eventid: eventId },
  });
  redirect("/event");
}
