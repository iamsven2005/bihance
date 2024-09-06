"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import UploadImage from "./upload";
import { toast } from "sonner";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import axios from "axios";

const CreateEventForm: React.FC = () => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    try {
      const response = await axios.post("/api/events", {
        name,
        location,
        description,
        image,
      });

      const data = response.data;
      if (response.status === 200) {
        const eventId = data.eventid;
        router.push(`/edit-event/${eventId}`);
        toast.success("Event created successfully");
      } else {
        console.error("Failed to create event", data.error);
        toast.error("Failed to create event");
      }
    } catch (error) {
      console.error("Failed to create event", error);
      toast.error("Failed to create event");
    } finally {
      setLoading(false);
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
          disabled={loading}
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
          disabled={loading}
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
          <img src={image} alt="Event Image" className="m-5 mx-auto w-56 rounded-lg shadow-md" />
        )}
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Creating Event..." : "Create Event"}
      </Button>
    </form>
  );
};

export default CreateEventForm;
