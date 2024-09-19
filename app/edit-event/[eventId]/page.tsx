"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Tiptap from "./Tiptap"; // Assuming this is your rich text editor component
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import { deleteEvent, updateEvent } from "./eventActions"; // Assuming this handles event actions
import { toast } from "sonner";
import { event } from "@prisma/client";
import { File } from "lucide-react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import DeleteFile from "./DeleteFile"; // Assuming this handles file deletion
import axios from "axios"; // Import axios
import UploadBtn from "@/components/upload"; // Import the reusable upload button component

type Props = {
  params: {
    eventId: string;
  };
};

const EventForm = ({ params }: Props) => {
  const router = useRouter();
  const { eventId } = params;
  const [event, setEvent] = useState<event | null>(null);
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<{ id: string; url: string; name: string }[]>([]);

  // Fetch event details and files using axios
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`/api/events/${eventId}`);
        const data = response.data;
        setEvent(data);
        setName(data.name);
        setLocation(data.location);
        setDescription(data.description);
        setImage(data.image);
      } catch (error) {
        console.error("Failed to fetch event:", error);
        toast.error("Failed to fetch event");
      } finally {
        setLoading(false);
      }
    };

    const fetchFiles = async () => {
      try {
        const response = await axios.get(`/api/events/${eventId}/files`);
        setFiles(response.data);
      } catch (error) {
        console.error("Failed to fetch files:", error);
      }
    };

    fetchEvent();
    fetchFiles();
  }, [eventId]);

  const handleFileUpload = (file: { id: string; url: string; name: string }) => {
    setFiles((prevFiles) => [...prevFiles, file]);
  };

  const handleFileDelete = (id: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
  };

  if (loading) {
    return (
      <div className="hero-content text-3xl">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    );
  }

  if (!event) {
    return router.push("/event");
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
      router.push("/event");
    } catch (error) {
      console.error("Failed to delete event:", error);
      toast.error("Failed to delete event");
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-wrap">
        <div className="flex flex-col justify-between w-full">
          <CardTitle className="m-5">Edit {event.name}</CardTitle>
          <div className="flex flex-wrap gap-5">
            <Button asChild>
              <Link href="/event">Back to events</Link>
            </Button>
            <DeleteConfirmationDialog onConfirm={handleDelete} />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium m-2">
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
            <label htmlFor="location" className="block text-sm font-medium m-2">
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
            <div className="m-5">
              <Tiptap content={description} onUpdate={setDescription} />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="image" className="block text-sm font-medium">
              Event Image:
            </label>
            <UploadBtn done={setImage} />
            {image && (
              <img
                src={image}
                alt="Event"
                className="m-5 mx-auto w-56 rounded-lg shadow-md"
              />
            )}
          </div>

          <Button type="submit" className="w-full">
            Save
          </Button>
        </form>
        <div className="mb-4">
          <Label htmlFor="files" className="m-2">
            Upload Files:
          </Label>
          <UploadFile eventId={eventId} onUploadComplete={handleFileUpload} />
        </div>
      </CardContent>

      <CardFooter>
        {files.length > 0 && (
          <ul className="mt-4">
            {files.map((file) => (
              <li key={file.id} className="flex items-center">
                <Button asChild>
                  <Link href={file.url} target="_blank" rel="noopener noreferrer">
                    <File /> {file.name}
                  </Link>
                </Button>
                <DeleteFile id={file.id} onDeleteComplete={handleFileDelete} />
              </li>
            ))}
          </ul>
        )}
      </CardFooter>
    </Card>
  );
};

// Upload File Component
type UploadFileProps = {
  eventId: string;
  onUploadComplete: (file: { id: string; url: string; name: string }) => void;
};

const UploadFile: React.FC<UploadFileProps> = ({ eventId, onUploadComplete }) => {
  const [name, setName] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleUploadComplete = async (url: string) => {
    try {
      const { data } = await axios.post("/api/files", {
        eventId,
        url,
        name,
      });

      setUploadedUrl(data.url);
      onUploadComplete({ id: data.id, url: data.url, name: data.name });
      toast.success("File uploaded successfully");
    } catch (error) {
      console.error("Failed to upload file", error);
      toast.error("Failed to upload file");
    }
  };

  return (
    <div>
      <div className="mb-4">
        <Input
          type="text"
          id="fileName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full"
          placeholder="filename"
          required
        />
      </div>

      {/* Use the UploadBtn component for file upload */}
      <UploadBtn done={handleUploadComplete} />
    </div>
  );
};

export default EventForm;
