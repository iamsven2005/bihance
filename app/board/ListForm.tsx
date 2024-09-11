"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

interface ListFormProps {
  id: Id<"boards">;
}

const ListForm = ({ id }: ListFormProps) => {
  const [isEdit, setEdit] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const createList = useMutation(api.lists.createList);

  const enableEdit = () => {
    setEdit(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const disableEdit = () => {
    setEdit(false);
    setTitle("");
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
      await createList({ boardId: id, title });
      setTitle("");
      disableEdit();
      toast.success("List added successfully!");
    } catch (error) {
      console.error("Error adding list:", error);
      toast.error("Error adding list.");
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
