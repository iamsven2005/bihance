"use client";

import { event } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import UploadImage from "./upload";
import Link from "next/link";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import { toast } from "sonner";
import { EditorContent, useEditor } from "@tiptap/react";
import { useState, useEffect } from "react";
import StarterKit from "@tiptap/starter-kit";
import { updateEventName, updateEventDescription, updateEventLocation, updateEventImage, deleteEvent } from "./eventActions";
import Tiptap from "./Tiptap";

type Props = {
  params: {
    eventId: string;
  };
};

const EventForm: React.FC<Props> = ({ params }) => {
  const [event, setEvent] = useState<event | null>(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true); // New state to manage loading

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    onUpdate: ({ editor }) => {
      setDescription(editor.getHTML());
    },
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${params.eventId}`, {
          method: 'GET',
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setEvent(data);
        setDescription(data.description);
        editor?.commands.setContent(data.description);
      } catch (error) {
        console.error('Failed to fetch event:', error);
        toast.error('Failed to fetch event');
      } finally {
        setLoading(false); // Set loading to false after the fetch attempt
      }
    };
  
    fetchEvent();
  }, [params.eventId]);
  

  if (loading) {
    return <div className="hero-content text-3xl"><span className="loading loading-ring loading-lg"></span>

</div>; // Display loading state
  }

  if (!event) {
    return <div>Event not found</div>; // Display error if event not found
  }

  const handleSaveName = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    await updateEventName(params.eventId, name);
    toast.success("Event name updated");
  };

  const handleSaveDescription = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateEventDescription(params.eventId, description);
    toast.success("Event description updated");
  };

  const handleSaveLocation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const location = formData.get("location") as string;
    await updateEventLocation(params.eventId, location);
    toast.success("Event location updated");
  };

  const handleSaveImage = async (url: string) => {
    await updateEventImage(params.eventId, url);
    toast.success("Event image updated");
  };

  const handleDelete = async () => {
    await deleteEvent(params.eventId);
    toast.success("Event deleted");
  };

  return (
    <div className="container flex gap-5 flex-col">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Edit Event</h1>
        <Link href="/event">
          <Button>Back to events</Button>
        </Link>
        <DeleteConfirmationDialog onConfirm={handleDelete} />
      </div>

      <div className="flex flex-col gap-5 bg-base-200 mx-auto p-5">
        <form onSubmit={handleSaveName}>
          <div>
            <label htmlFor="name">Event Name:</label>
            <Input type="text" id="name" name="name" defaultValue={event.name} required />
          </div>
          <Button type="submit">Save</Button>
        </form>
        <form onSubmit={handleSaveLocation}>
          <div>
            <label htmlFor="location">Event Location:</label>
            <Input type="text" id="location" name="location" defaultValue={event.location} required />
          </div>
          <Button type="submit">Save</Button>
        </form>
        <div>
          <label htmlFor="description">Event Description:</label>
          <div className="m-5">
          <Tiptap content={event.description} />

          </div>
          <Button onClick={handleSaveDescription}>Save</Button>
        </div>
        <div>
          <label htmlFor="image">Event Image:</label>
          <UploadImage onUploadComplete={handleSaveImage} />
          <img src={event.image} className="items-center justify-center mx-auto flex" />
        </div>
      </div>
    </div>
  );
};

export default EventForm;
