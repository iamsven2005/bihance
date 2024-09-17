"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { format } from "util";
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd";
import { useMutation } from "convex/react";
import BoardTitle from "./BoardTitle";
import ListForm from "./ListForm";
import ListTitle from "./ListTitle";
import { useRouter } from "next/navigation";

interface PageClientProps {
  board: Id<"boards">;
  lists: Array<{
    id: Id<"lists">;
    title: string;
    card: Array<{
      _id: Id<"cards">;
      title: string;
      order: bigint;
      description?: string;
      listId: Id<"lists">;
    }>;
  }>;
  initialTitle: string;
}

interface Props {
  board: string;
  org: string;
}

const PageClient = ({ board, org }: Props) => {
  const [boardId, setBoardId] = useState<string>(""); 
  const [orgId, setOrgId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [lists, setLists] = useState<Array<{
    id: Id<"lists">;
    title: string;
    order: bigint;
    card: Array<{
      _id: Id<"cards">;
      title: string;
      order: bigint;
      description?: string;
      listId: Id<"lists">;
    }>;
  }> | []>([]);

  const router = useRouter();  // Initialize the router first

  // Call the hooks unconditionally
  useEffect(() => {
    setBoardId(board);
    setOrgId(org);
  }, [board, org]);

  const convexBoardId = boardId as Id<"boards">;
  const convexOrgId = orgId;

  const boarddet = useQuery(api.boards.getBoardDetails, { boardId: convexBoardId });
  const listsQuery = useQuery(api.lists.getBoardLists, { boardId: convexBoardId });

  // Mutation hooks
  const reorderLists = useMutation(api.lists.reorderLists);
  const reorderCards = useMutation(api.cards.reorderCards);

  // Handle setting lists after fetching
  useEffect(() => {
    if (listsQuery) {
      setLists(listsQuery);
    }
  }, [listsQuery]);

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, type } = result;

    if (!destination) return; 

    if (type === "list") {
      const reorderedLists = [...lists];
      const [movedList] = reorderedLists.splice(source.index, 1);
      reorderedLists.splice(destination.index, 0, movedList);
      setLists(reorderedLists);

      try {
        await reorderLists({
          boardId: convexBoardId,
          listOrder: reorderedLists.map((list) => list.id),
        });
        toast.success("List order updated successfully");
      } catch (error) {
        console.error("Failed to update list order:", error);
        toast.error("Failed to update list order");
      }
    } else if (type === "card") {
      const sourceListIndex = lists.findIndex((list) => list.id === source.droppableId);
      const destinationListIndex = lists.findIndex((list) => list.id === destination.droppableId);

      if (sourceListIndex === -1 || destinationListIndex === -1) return;

      const sourceList = lists[sourceListIndex];
      const destinationList = lists[destinationListIndex];

      const [movedCard] = sourceList.card.splice(source.index, 1);
      destinationList.card.splice(destination.index, 0, movedCard);

      const updatedLists = [...lists];
      updatedLists[sourceListIndex] = sourceList;
      updatedLists[destinationListIndex] = destinationList;
      setLists(updatedLists);

      try {
        await reorderCards({
          boardId: convexBoardId,
          sourceListId: source.droppableId as Id<"lists">,
          destinationListId: destination.droppableId as Id<"lists">,
          sourceCardOrder: sourceList.card.map((card) => card._id),
          destinationCardOrder: destinationList.card.map((card) => card._id),
        });
        toast.success("Card order updated successfully");
      } catch (error) {
        console.error("Failed to update card order:", error);
        toast.error("Failed to update card order");
      }
    }
  };

  const filteredLists = lists.filter((list) =>
    list.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!lists) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative h-full bg-no-repeat bg-cover bg-center min-h-screen"
    style={{ 
      backgroundImage: `url(${boarddet?.imageFullUrl})`,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backgroundBlendMode: 'overlay', 
    }}>
      <div className="w-full h-20 z-[40] bg-black/50 fixed top-14 flex items-center px-6 gap-x-4">
        <BoardTitle boardId={convexBoardId} />
        
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search lists..."
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <main className="relative pt-28 h-full">
        <div className="p-10 h-full overflow-x-auto">
          <ol className="flex gap-x-3 h-full p-5 m-5">
            <ListForm id={convexBoardId} />

            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="board" direction="horizontal" type="list">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="flex gap-x-3 h-full">
                    {filteredLists.map((list, index) => (
                      <Draggable key={list.id} draggableId={list.id} index={index}>
                        {(provided) => (
                          <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                            <ListTitle
                              initialTitle={list.title || ""}
                              boardId={convexBoardId}
                              id={list.id}
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
    </div>
  );
};

export default PageClient;
