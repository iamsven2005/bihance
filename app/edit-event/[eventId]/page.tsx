"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Tiptap from "./Tiptap";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import { deleteEvent, updateEvent } from "./eventActions";
import { toast } from "sonner";
import { useEditor } from "@tiptap/react";
import { event } from "@prisma/client";
import StarterKit from "@tiptap/starter-kit";
import UploadImage from "./upload";
import UploadFile from "./UploadFile";

type Props = {
  params: {
    eventId: string;
  };
};

const EventForm: React.FC<Props> = ({ params }) => {
  const { eventId } = params;
  const [event, setEvent] = useState<event | null>(null);
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<{ url: string; name: string }[]>([]);

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
        const response = await fetch(`/api/events/${eventId}`, {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setEvent(data);
        setName(data.name);
        setLocation(data.location);
        setDescription(data.description);
        setImage(data.image);
        if (editor) {
          editor.commands.setContent(data.description);
        }
      } catch (error) {
        console.error("Failed to fetch event:", error);
        toast.error("Failed to fetch event");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, editor]);

  const handleFileUpload = (file: { url: string; name: string }) => {
    setFiles((prevFiles) => [...prevFiles, file]);
  };

  if (loading) {
    return (
      <div className="hero-content text-3xl">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    );
  }

  if (!event) {
    return <div>Event not found</div>;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await updateEvent(eventId, { name, location, description, image });
      toast.success("Event updated");
    } catch (error) {
      console.error("Failed to update event:", error);
      toast.error("Failed to update event");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteEvent(eventId);
      toast.success("Event deleted");
    } catch (error) {
      console.error("Failed to delete event:", error);
      toast.error("Failed to delete event");
    }
  };

  return (
    <Card className="bg-base-200 text-base-content">
      <CardHeader className="flex flex-wrap">
        <div className="flex flex-row justify-between w-full">
          <CardTitle className="bg">Edit {event.name}</CardTitle>
          <Link href="/event" className="btn btn-link">
            Back to events
          </Link>
          <DeleteConfirmationDialog onConfirm={handleDelete} />
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium">
              Event Name:
            </label>
            <Input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="location" className="block text-sm font-medium">
              Event Location:
            </label>
            <Input
              type="text"
              id="location"
              name="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium">
              Event Description:
            </label>
            <Tiptap content={description} onUpdate={setDescription} />
          </div>
          <div className="mb-4">
            <label htmlFor="image" className="block text-sm font-medium">
              Event Image:
            </label>
            <UploadImage onUploadComplete={setImage} />
            {image && (
              <img
                src={image}
                alt="Event"
                className="mt-4 w-full h-auto rounded-lg shadow-md"
              />
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="files" className="block text-sm font-medium">
              Upload Files:
            </label>
            <UploadFile eventId={eventId} onUploadComplete={handleFileUpload} />
            {files.length > 0 && (
              <ul className="mt-4">
                {files.map((file, index) => (
                  <li key={index}>
                    <a href={file.url} target="_blank" rel="noopener noreferrer">
                      {file.name}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Button type="submit" className="w-full">
            Save
          </Button>
        </form>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};

export default EventForm;
