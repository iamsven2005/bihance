import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { event } from "@prisma/client";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import UploadImage from "./upload";
import Link from "next/link";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog"; // Adjust the import path as necessary
import { toast } from "sonner";

type Props = {
  params: {
    eventId: string;
  };
};

const EventForm = async ({ params }: Props) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }

  if (!params.eventId) {
    return <div>Event ID is missing</div>;
  }

  const event: event | null = await db.event.findUnique({
    where: {
      eventid: params.eventId,
    },
  });

  if (!event) {
    return <div>Event not found</div>;
  }

  async function handlename(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;

    await db.event.update({
      where: { eventid: params.eventId },
      data: { name },
    });

    // Revalidate the page after submission
    revalidatePath(`/edit-event/${params.eventId}`);
  }

  async function handledescription(formData: FormData) {
    "use server";
    const description = formData.get("description") as string;

    await db.event.update({
      where: { eventid: params.eventId },
      data: { description },
    });

    // Revalidate the page after submission
    revalidatePath(`/edit-event/${params.eventId}`);
  }

  async function handlelocation(formData: FormData) {
    "use server";
    const location = formData.get("location") as string;

    await db.event.update({
      where: { eventid: params.eventId },
      data: { location },
    });

    // Revalidate the page after submission
    revalidatePath(`/edit-event/${params.eventId}`);
  }

  async function handleimage(url: string) {
    "use server";
    await db.event.update({
      where: { eventid: params.eventId },
      data: { image: url },
    });

    // Revalidate the page after submission
    revalidatePath(`/edit-event/${params.eventId}`);
  }

  async function handleDelete() {
    "use server";
    await db.event.delete({
      where: { eventid: params.eventId },
    });

    // Redirect to the events page after deletion
    redirect("/event");
  }

  return (
    <div className="container flex gap-5 flex-col">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Edit Event</h1>
        <Link href="/event">
          <Button>Back to events</Button>
        </Link>
        <DeleteConfirmationDialog onConfirm={handleDelete} />
      </div>

      <div className="flex flex-wrap gap-5 bg-base-200 mx-auto p-5">
        <form action={handlename}>
          <div>
            <label htmlFor="name">Event Name:</label>
            <Input type="text" id="name" name="name" defaultValue={event.name} required />
          </div>
          <Button type="submit">Save</Button>
        </form>
        <form action={handlelocation}>
          <div>
            <label htmlFor="location">Event Location:</label>
            <Input
              type="text"
              id="location"
              name="location"
              defaultValue={event.location}
              required
            />
          </div>
          <Button type="submit">Save</Button>
        </form>
        <form action={handledescription}>
          <div>
            <label htmlFor="description">Event Description:</label>
            <Input
              type="text"
              id="description"
              name="description"
              defaultValue={event.description}
              required
            />
          </div>
          <Button type="submit">Save</Button>
        </form>
        <div>
        <label htmlFor="image">Event Image:</label>
        <UploadImage onUploadComplete={handleimage} />
        <img src={event.image} className="items-center justify-center mx-auto flex" />
      </div>
      </div>


    </div>
  );
};

export default EventForm;
