"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import UploadImage from "./upload";
import { toast } from "sonner";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const CreateEventForm: React.FC = () => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    onUpdate: ({ editor }) => {
      setDescription(editor.getHTML());
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/create-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, location, description, image }),
      });
      const data = await response.json();
      if (response.ok) {
        const eventId = data.eventid;
        router.push(`/edit-event/${eventId}`);
        toast.success("Event added");
      } else {
        console.error("Failed to create event", data.error);
        toast.error("Failed to create event");
      }
    } catch (error) {
      console.error("Failed to create event", error);
      toast.error("Failed to create event");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="name">Event Name:</label>
        <Input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="location">Event Location:</label>
        <Input
          type="text"
          id="location"
          name="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="description">Event Description:</label>
        <EditorContent editor={editor} />
      </div>
      <div>
        <label htmlFor="image">Event Image:</label>
        <UploadImage onUploadComplete={(url: string) => setImage(url)} />
        {image && (
          <img src={image} alt="Event Image" className="mt-4 w-full h-auto" />
        )}
      </div>
      <Button type="submit">Create Event</Button>
    </form>
  );
};

export default CreateEventForm;
