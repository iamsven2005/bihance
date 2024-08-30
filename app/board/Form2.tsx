"use client"; 

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { ElementRef, useRef, useState } from "react";
import { toast } from "sonner";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import axios from "axios";

interface Props {
  id: string; 
}

const CardForm = ({ id }: Props) => {
  const router = useRouter();
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
    setTitle("");
    setDescription("");
  };

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      disableEdit();
    }
  };

  useEventListener("keydown", handleKeydown);
  useOnClickOutside(formRef, disableEdit);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    if (!title.trim()) return;

    setLoading(true);
    try {
      await axios.post("/api/boards/lists/cards", {
        listId: id,
        title,
        description,
      });

      setTitle("");
      setDescription("");
      disableEdit();
      toast.success("Card added successfully. Refresh to update.");
    } catch (error) {
      console.error("Error adding card:", error);
      toast.error("There was an error adding the card.");
    } finally {
      setLoading(false); 
      router.refresh();
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="m-2 flex flex-col gap-2"
    >
      <Input
        ref={inputRef}
        id="title"
        value={title} 
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter Card Title"
        disabled={loading} // Disable input during loading
      />
      <Textarea
        ref={textAreaRef}
        id="description"
        value={description} 
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter Card Description"
        disabled={loading} // Disable textarea during loading
      />
      <input hidden value={id} name="listId" />
      <div className="flex items-center gap-x-1">
        <Button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Card"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={disableEdit}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default CardForm;
