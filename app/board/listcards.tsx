import { MoreHorizontal, X, Trash2 } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import CardForm from "./Form2";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { toast } from "sonner";
import { Card } from "@prisma/client";
import CardTitle from "./BoardTitle2";
import DescTitle from "./BoardTitle3";
import { Draggable, Droppable } from "@hello-pangea/dnd";

interface BoardTitleProps {
  initialTitle: string | null | undefined;
  boardId: string;
  id: string;
  onDelete?: (listId: string) => void;
  card: Card[];
}

const ListTitle: React.FC<BoardTitleProps> = ({ initialTitle, boardId, id, onDelete, card }) => {
  const [title, setTitle] = useState(initialTitle || "");
  const [isEditing, setIsEditing] = useState(false);
  const [cards, setCards] = useState(card);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const saveTitle = async () => {
    try {
      await axios.patch(`/api/boards/lists/${boardId}`, { title });
      setIsEditing(false);
      toast.success("List renamed successfully.");
    } catch (error) {
      console.error("Failed to update title:", error);
      toast.error("Failed to update title.");
    }
  };

  const deleteList = async () => {
    try {
      await axios.delete(`/api/boards/lists/${boardId}`);
      toast.success("List deleted successfully.");
      if (onDelete) onDelete(id);
    } catch (error) {
      console.error("Failed to delete list:", error);
      toast.error("Failed to delete list.");
    }
  };

  const deleteCard = async (cardId: string) => {
    try {
      await axios.delete(`/api/boards/cards/${cardId}`);
      toast.success("Card deleted successfully.");
      setCards(cards.filter((card) => card.id !== cardId));
    } catch (error) {
      console.error("Failed to delete card:", error);
      toast.error("Failed to delete card.");
    }
  };

  const copyList = async () => {
    try {
      await axios.post(`/api/boards/lists/${boardId}/copy`);
      toast.success("List copied successfully.");
      // Assuming onDelete triggers a refresh or similar after copy
      if (onDelete) onDelete(id);
    } catch (error) {
      console.error("Failed to copy list:", error);
      toast.error("Failed to copy list.");
    }
  };

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
                type="button"
                onClick={copyList}
              >
                Copy List
              </Button>
              <Separator />
              <Button
                variant={"ghost"}
                className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
                type="button"
                onClick={deleteList}
              >
                Delete List
              </Button>
              <CardForm id={boardId} />
            </PopoverContent>
          </Popover>
          <Droppable droppableId={boardId} type="card">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`flex flex-col gap-y-3 p-2 ${
                  snapshot.isDraggingOver ? "bg-gray-200 dark:bg-gray-700" : ""
                }`}
              >
                {cards.length > 0 ? (
                  cards.map((cardItem, index) => (
                    <Draggable draggableId={cardItem.id} index={index} key={cardItem.id}>
                      {(provided) => (
                        <div
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                          className="flex w-full p-3 rounded-md space-y-4 shadow-md bg-white dark:bg-black flex-col"
                        >
                          <div className="flex justify-between items-center">
                            <CardTitle initialTitle={cardItem.title} boardId={cardItem.id} />
                            <Button
                              variant={"ghost"}
                              className="p-1"
                              onClick={() => deleteCard(cardItem.id)}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                          {cardItem.description && (
                            <DescTitle initialTitle={cardItem.description} boardId={cardItem.id} />
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
