"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const AddEvent = () => {
  const [title, setTitle] = useState("");

  const handleAddEvent = async () => {

    if (!title) return toast.error("Title is required");
    const response = await fetch("/api/polling", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });

    if (response.ok) {
      setTitle("");
      window.location.reload();
    } else {
      toast.error("Failed to add event");
    }
  };

  return (
    <div className="flex w-full gap-2">
      <Input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Event Title"
      />
      <Button onClick={handleAddEvent}>Add Event</Button>
    </div>
  );
};

export default AddEvent;
