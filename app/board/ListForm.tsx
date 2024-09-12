"use client"; 

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { ElementRef, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api"; // Adjust the path to your Convex API
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import axios from "axios";

interface ListFormProps {
  id: Id<"boards">; // Use Convex's Id type for boardId
}

const ListForm = ({ id }: ListFormProps) => {
  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);
  const [isEdit, setEdit] = useState(false);
  const [title, setTitle] = useState(""); // State for the list title
  const [loading, setLoading] = useState(false); // State for form submission

  // Convex mutation for creating a new list
  const createList = useMutation(api.lists.createList);

  const enableEdit = () => {
    setEdit(true);
    setTimeout(() => {
      inputRef.current?.focus();
    });
  };

  const disableEdit = () => {
    setEdit(false);
    setTitle(""); // Clear the input when disabling edit mode
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
      await createList({ boardId: id, title });
      await axios.get("/api/board");
      setTitle("");
      disableEdit();
      toast.success("List added successfully!");
    } catch (error) {
      console.error("Error adding list:", error);
      toast.error("There was an error adding the list.");
    } finally {
      setLoading(false);
    }
  };

  if (isEdit) {
    return (
      <li className="shrink-0 h-full w-[272px] select-none">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="w-full p-3 rounded-md space-y-4 shadow-md dark:bg-black bg-white"
        >
          <Input
            ref={inputRef}
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-sm px-2 py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition"
            placeholder="Enter List Title"
          />
          <div className="flex items-center gap-x-1">
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add List"}
            </Button>
            <Button type="button" onClick={disableEdit} variant="outline">
              <X />
            </Button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="shrink-0 h-full w-[272px] select-none">
      <button
        className="flex w-full p-3 rounded-md space-y-4 shadow-md bg-white dark:bg-black"
        onClick={enableEdit}
      >
        <Plus />
        Add List
      </button>
    </li>
  );
};

export default ListForm;
