"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel"; // Use Convex-generated types
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import CardForm from "./CardForm";
import DescTitle from "./DescTitle";
import CardTitle from "./CardTitle";
import axios from "axios";
import { MoreHorizontal, Trash2, X } from "lucide-react";

interface BoardTitleProps {
  boardId: Id<"boards">;
  id: Id<"lists">;
  initialTitle: string;
  onDelete?: (listId: Id<"lists">) => void; // Callback to remove list from UI
}

const ListTitle: React.FC<BoardTitleProps> = ({ boardId, id, initialTitle, onDelete }) => {
  // Real-time subscription to list title and cards
  const listData = useQuery(api.lists.getListDetails, { boardId });
  const cardsData = useQuery(api.cards.getCardsForList, { listId: id });

  const updateListTitle = useMutation(api.lists.updateListTitle);
  const deleteListMutation = useMutation(api.lists.deleteList);
  const copyListMutation = useMutation(api.lists.copyList);
  const deleteCardMutation = useMutation(api.cards.deleteCard);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle || "");
  useEffect(() => {
    setTitle(initialTitle);
  }, [initialTitle]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const saveTitle = async () => {
    try {
      await updateListTitle({ listId: id, title });
      setIsEditing(false);
      toast.success("Renamed List");
    } catch (error) {
      console.error("Failed to update title:", error);
      toast.error("Failed to update title");
    }
  };

  const deleteList = async (listId: Id<"lists">) => {
    try {
      await deleteListMutation({ listId });
      toast.success("Card deleted successfully");
      await axios.get("/api/board");
    } catch (error) {
      console.error("Failed to delete card:", error);
      toast.error("Failed to delete card");
    }
  };
  

  const deleteCard = async (cardId: Id<"cards">) => {
    try {
      await deleteCardMutation({ cardId });
      toast.success("Card deleted successfully");
      await axios.get("/api/board");
    } catch (error) {
      console.error("Failed to delete card:", error);
      toast.error("Failed to delete card");
    }
  };

  const copyList = async () => {
    try {
      await copyListMutation({ listId: id });
      toast.success("List copied successfully");
      await axios.get("/api/board");
    } catch (error) {
      console.error("Failed to copy list:", error);
      toast.error("Failed to copy list");
    }
  };

  if (!listData || !cardsData) {
    return <p>Loading...</p>;
  }

  return (
    <li className="shrink-0 h-full w-[272px] select-none">
      {isEditing ? (
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          onBlur={saveTitle}
          onKeyDown={(e) => {
            if (e.key === "Enter") saveTitle();
          }}
          className="flex w-full p-3 rounded-md space-y-4 shadow-md bg-white dark:bg-black"
          autoFocus
        />
      ) : (
        <div className="flex flex-col">
          <h1
            className="flex w-full p-3 rounded-md space-y-4 shadow-md bg-white dark:bg-black"
            onClick={() => setIsEditing(true)}
          >
            {title}
          </h1>
          <Popover>
            <PopoverTrigger asChild>
              <Button className="h-auto w-auto p-2" variant={"ghost"}>
                <MoreHorizontal className="size-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="px-0 pt-3 pb-3" side="bottom" align="start">
              <div className="text-sm font-medium text-center pb-4">List Actions</div>
              <PopoverClose asChild>
                <Button className="h-auto w-auto p-2 absolute top-2 right-2" variant={"ghost"}>
                  <X className="size-4" />
                </Button>
              </PopoverClose>
              <Separator />
              <Button
                variant={"ghost"}
                className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
                onClick={copyList}
              >
                Copy List
              </Button>
              <Separator />
              <Button
                variant={"ghost"}
                className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
                onClick={() => deleteList(id)}              >
                Delete List
              </Button>
              <CardForm id={id} />
            </PopoverContent>
          </Popover>
          <Droppable droppableId={id.toString()} type="card">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`flex flex-col gap-y-3 p-2 ${
                  snapshot.isDraggingOver ? "bg-gray-200 dark:bg-gray-700" : ""
                }`}
              >
                {cardsData.length > 0 ? (
                  cardsData.map((cardItem, index) => (
                    <Draggable draggableId={cardItem._id.toString()} index={index} key={cardItem._id}>
                      {(provided) => (
                        <div
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                          className="flex w-full p-3 rounded-md space-y-4 shadow-md bg-white dark:bg-black flex-col"
                        >
                          <div className="flex justify-between items-center">
                            <CardTitle cardId={cardItem._id} />
                            <Button
                              variant={"ghost"}
                              className="p-1"
                              onClick={() => deleteCard(cardItem._id)} // Hook up card deletion
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                          {cardItem.description && (
                            <DescTitle cardId={cardItem._id} />
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    No cards available
                  </div>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </li>
  );
};

export default ListTitle;