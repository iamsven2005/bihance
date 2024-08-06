"use client"; 

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
import { ElementRef, useRef, useState } from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

interface Props {
  id: string; 
}

const CardForm = ({ id }: Props) => {
  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);
  const textAreaRef = useRef<ElementRef<"textarea">>(null);
  const [isEdit, setEdit] = useState(false);
  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false); 

  const enableEdit = () => {
    setEdit(true);
    setTimeout(() => {
      inputRef.current?.focus();
    });
  };

  const disableEdit = () => {
    setEdit(false);
  };

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      disableEdit();
    }
  };

  // Add an event listener for keydown events
  useEventListener("keydown", handleKeydown);
  // Close the form when clicking outside
  useOnClickOutside(formRef, disableEdit);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    if (!title.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/boards/lists/cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ listId: id, title,description }),
      });

      if (!response.ok) {
        throw new Error("Failed to add list");
      }

      setTitle("");
      disableEdit();

    } catch (error) {
      console.error(error);
      alert("There was an error adding the list.");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <form
    ref={formRef}
    onSubmit={handleSubmit}
   className="m-2 flex flex-col gap-2">
    <Input
      ref={inputRef}
      id="title"
      value={title} 
      onChange={(e) => setTitle(e.target.value)}
      placeholder="Enter List Title"
    />
    <Textarea
      ref={textAreaRef}
      id="description"
      value={description} 
      onChange={(e) => setDescription(e.target.value)}
      placeholder="Enter List Description"
    />
    <input hidden value={id} name="boardId" />
    <div className="flex items-center gap-x-1">
      <Button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Card"}
      </Button>
    </div>
  </form>
  );
};

export default CardForm;
