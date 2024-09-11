"use client";
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarImage } from '../../components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { OrganizationList } from '@clerk/nextjs';
import { format } from 'date-fns';
import { gen_log_msg } from '../../lib/gen-log';
import axios from 'axios';
import { Audit, board, Card, List } from '@prisma/client';
import { toast } from 'sonner';
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Plus, X, MoreHorizontal, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

interface ApiResponse {
  boarddet: board;
  lists: List[];
  auditItems: Audit[];
}

const Page = () => {
  const router = useRouter();
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<ApiResponse>(`/api/boards/new`);
        setData(response.data);
        setLoading(false);
      } catch (err) {
        toast.error('Error loading data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No data found</div>;
  }

  const { boarddet, lists, auditItems } = data;

  return (
    <div
      className="relative h-full bg-no-repeat bg-cover bg-center min-h-screen"
      style={{
        backgroundImage: `url(${boarddet?.imageFullUrl})`,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backgroundBlendMode: 'overlay',
      }}
    >
      {/* Fixed header with activity button */}
      <div className="w-full h-20 z-[40] bg-black/50 fixed top-14 flex items-center px-6 gap-x-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Activity</Button>
          </SheetTrigger>
          <SheetContent side={'right'}>
            <SheetHeader>
              <SheetTitle>Dashboard Log</SheetTitle>
              <SheetDescription>
                <div className="flex items-start gap-x-3 w-full">
                  <div className="w-full">
                    <p className="font-semibold text-neutral-700 mb-2">Activity</p>
                    <ScrollArea className="h-72 w-full rounded-md border">
                      {auditItems.map((item) => (
                        <div className="flex items-center gap-x-2" key={item.id}>
                          <Avatar>
                            <AvatarImage src={item.userImage || '/default-avatar.png'} alt="User Avatar" />
                          </Avatar>
                          <div className="flex flex-col space-y-0.5">
                            <p className="text-sm text-muted-foreground">
                              <span className="font-semibold lowercase text-neutral-700">{item.username}</span>{' '}
                              {gen_log_msg(item)}
                              <p className="text-xs text-neutral-500">
                                {format(new Date(item.created), "MMM d, yyyy 'at' h:mm a")}
                              </p>
                            </p>
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                </div>              
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>

      <div className="absolute inset-0 bg-black/10" />

      <PageClient board={boarddet.id} lists={lists} initialTitle={boarddet.title} />
    </div>
  );
};

interface PageClientProps {
  board: string;
  lists: any;
  initialTitle: string;
}

const PageClient = ({ board, lists: initialLists, initialTitle }: PageClientProps) => {
  const [lists, setLists] = useState(initialLists);

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, type } = result;

    if (!destination) return;

    if (type === "list") {
      const reorderedLists = [...lists];
      const [movedList] = reorderedLists.splice(source.index, 1);
      reorderedLists.splice(destination.index, 0, movedList);
      setLists(reorderedLists);

      try {
        await axios.patch(`/api/boards/reorderLists`, {
          boardId: board,
          listOrder: reorderedLists.map((list) => list.id),
        });
        toast.success("List order updated successfully");
      } catch (error) {
        console.error("Failed to update list order:", error);
        toast.error("Failed to update list order");
      }
    } else if (type === "card") {
      const sourceListIndex = lists.findIndex((list: { id: string }) => list.id === source.droppableId);
      const destinationListIndex = lists.findIndex((list: { id: string }) => list.id === destination.droppableId);

      const sourceList = lists[sourceListIndex];
      const destinationList = lists[destinationListIndex];

      const [movedCard] = sourceList.card.splice(source.index, 1);
      destinationList.card.splice(destination.index, 0, movedCard);

      const updatedLists = [...lists];
      updatedLists[sourceListIndex] = sourceList;
      updatedLists[destinationListIndex] = destinationList;
      setLists(updatedLists);

      try {
        await axios.patch(`/api/boards/reorderCards`, {
          boardId: board,
          sourceListId: source.droppableId,
          destinationListId: destination.droppableId,
          sourceCardOrder: sourceList.card.map((card: { id: any }) => card.id),
          destinationCardOrder: destinationList.card.map((card: { id: any }) => card.id),
        });
        toast.success("Card order updated successfully");
      } catch (error) {
        console.error("Failed to update card order:", error);
        toast.error("Failed to update card order");
      }
    }
  };

  return (
    <main className="relative pt-28 h-full">
      <div className="p-10 h-full overflow-x-auto">
        {/* Include BoardTitle at the top */}
        <BoardTitle initialTitle={initialTitle} boardId={board} />

        <ol className="flex gap-x-3 h-full">
          <ListForm id={board} />

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="board" direction="horizontal" type="list">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex gap-x-3 h-full"
                >
                  {lists.map((list: any, index: number) => (
                    <Draggable key={list.id} draggableId={list.id} index={index}>
                      {(provided) => (
                        <div
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                          className="flex-shrink-0"
                        >
                          <ListTitle
                            initialTitle={list.title || ""}
                            boardId={list.id}
                            id={board}
                            card={list.card}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <li className="flex-shrink-0 w-1" />
        </ol>
      </div>
    </main>
  );
};

interface ListFormProps {
  id: string;
}

// BoardTitle component for rendering and editing the board title
const BoardTitle: React.FC<{ initialTitle: string; boardId: string }> = ({
  initialTitle,
  boardId,
}) => {
  const [title, setTitle] = useState(initialTitle || "");
  const [isEditing, setIsEditing] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const saveTitle = async () => {
    try {
      await axios.patch(`/api/boards/${boardId}`, { title });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update title:", error);
    }
  };

  return (
    <div>
      {isEditing ? (
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          onBlur={saveTitle}
          onKeyDown={(e) => {
            if (e.key === "Enter") saveTitle();
          }}
          className="text-white bg-transparent border-none outline-none"
          autoFocus
        />
      ) : (
        <h1 className="text-xl cursor-pointer text-white" onClick={() => setIsEditing(true)}>
          {title}
        </h1>
      )}
    </div>
  );
};

// ListForm component for adding a new list
const ListForm = ({ id }: ListFormProps) => {
  const [isEdit, setEdit] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
      await axios.post("/api/boards/lists", {
        boardId: id,
        title,
      });
      setTitle("");
      disableEdit();
      toast.success("Added list, refresh to update");
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

// CardForm component for adding a new card to a list
interface CardFormProps {
  id: string;
}

const CardForm = ({ id }: CardFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const disableEdit = () => {
    setTitle("");
    setDescription("");
  };

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
      toast.success("Card added successfully.");
    } catch (error) {
      console.error("Error adding card:", error);
      toast.error("There was an error adding the card.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="m-2 flex flex-col gap-2">
      <Input
        ref={inputRef}
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter Card Title"
        disabled={loading}
      />
      <Textarea
        ref={textAreaRef}
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter Card Description"
        disabled={loading}
      />
      <input hidden value={id} name="listId" />
      <div className="flex items-center gap-x-1">
        <Button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Card"}
        </Button>
        <Button type="button" variant="outline" onClick={disableEdit} disabled={loading}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

// CardTitle component for rendering and editing card titles
interface CardTitleProps {
  initialTitle: string | undefined;
  boardId: string;
}

const CardTitle: React.FC<CardTitleProps> = ({ initialTitle, boardId }) => {
  const [title, setTitle] = useState(initialTitle || "");
  const [isEditing, setIsEditing] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const saveTitle = async () => {
    try {
      await axios.patch(`/api/boards/cards/${boardId}`, { title });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update title:", error);
    }
  };

  return (
    <div>
      {isEditing ? (
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          onBlur={saveTitle}
          onKeyDown={(e) => {
            if (e.key === "Enter") saveTitle();
          }}
          className="text-white bg-transparent border-none outline-none"
          autoFocus
        />
      ) : (
        <h1 className="text-xl cursor-pointer" onClick={() => setIsEditing(true)}>
          {title}
        </h1>
      )}
    </div>
  );
};

// DescTitle component for rendering and editing card descriptions
interface DescTitleProps {
  initialTitle: string | undefined;
  boardId: string;
}

const DescTitle: React.FC<DescTitleProps> = ({ initialTitle, boardId }) => {
  const [description, setDescription] = useState(initialTitle || "");
  const [isEditing, setIsEditing] = useState(false);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const saveDescription = async () => {
    try {
      await axios.patch(`/api/boards/description/${boardId}`, { description });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update description:", error);
    }
  };

  return (
    <div>
      {isEditing ? (
        <input
          type="text"
          value={description}
          onChange={handleDescriptionChange}
          onBlur={saveDescription}
          onKeyDown={(e) => {
            if (e.key === "Enter") saveDescription();
          }}
          className="bg-transparent border-none outline-none"
          autoFocus
        />
      ) : (
        <p className="text-md cursor-pointer" onClick={() => setIsEditing(true)}>
          {description}
        </p>
      )}
    </div>
  );
};

// ListTitle component for rendering and editing list titles
interface ListTitleProps {
  initialTitle: string | null | undefined;
  boardId: string;
  id: string;
  onDelete?: (listId: string) => void;
  card: any[];
}

const ListTitle: React.FC<ListTitleProps> = ({ initialTitle, boardId, id, onDelete, card }) => {
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
      await axios.post(`/api/boards/lists/${boardId}`);
      toast.success("List copied successfully.");
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
                  <div className="text-center text-gray-500 dark:text-gray-400">No cards available</div>
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



export default Page;
