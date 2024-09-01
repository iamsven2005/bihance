"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface EventProps {
  id: string;
  currentTitle: string;
}

const EventManager = ({ id, currentTitle }: EventProps) => {
  const [title, setTitle] = useState(currentTitle);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const handleEditEvent = async () => {
    if (!title) return toast.error("Title is required");

    const response = await fetch(`/api/polling/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });

    if (response.ok) {
      toast.success("Edited successfully");
      setIsEditing(false);
    } else {
      toast.error("Failed to edit event");
    }
  };

  const handleDeleteEvent = async () => {
    try {
      const response = await fetch('/api/polling', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageId: id }),
      });

      if (response.ok) {
        toast.success("Deleted Event" );
        router.refresh(); // Refresh the page after deletion
      } else {
        throw new Error('Failed to delete the event');
      }
    } catch (error: any) {
      toast.error("Failed to delete event");
    }
  };

  const handleBlur = () => {
    handleEditEvent();
  };

  return (
    <div className="flex flex-col gap-2">
      {isEditing ? (
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleBlur} // Save and exit edit mode on blur
          autoFocus // Automatically focus the input when entering edit mode
        />
      ) : (
        <CardTitle onClick={() => setIsEditing(true)} className="cursor-pointer">
          {title}
        </CardTitle>
      )}
      <div className="flex gap-2 flex-wrap">
        <Link href={`/events/${id}`} passHref>
          <Button>Vote</Button>
        </Link>
        <Link href={`/poll/${id}`} passHref>
          <Button>View Details</Button>
        </Link>
        <Button onClick={handleEditEvent} disabled={!isEditing}>Save</Button>
        <Button onClick={handleDeleteEvent} variant="destructive">Delete</Button>
      </div>
    </div>
  );
};

export default EventManager;
