"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { gen_log_msg } from "@/lib/gen-log";
import axios from "axios";
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { format } from "util";
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd";
import { useMutation } from "convex/react";
import BoardTitle from "./BoardTitle";
import ListForm from "./ListForm";
import ListTitle from "./ListTitle";

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

  useEffect(() => {
    setBoardId(board);
    setOrgId(org);
  }, [board, org]);

  const convexBoardId = boardId as Id<"boards">;
  const convexOrgId = orgId;

  const boarddet = useQuery(api.boards.getBoardDetails, { boardId: convexBoardId });
  const listsQuery = useQuery(api.lists.getBoardLists, { boardId: convexBoardId });

  useEffect(() => {
    if (listsQuery) {
      setLists(listsQuery);
    }
  }, [listsQuery]);
    const auditItems = useQuery(api.audit.getAuditLogs, { orgId: convexOrgId });


  const reorderLists = useMutation(api.lists.reorderLists);
  const reorderCards = useMutation(api.cards.reorderCards);
  const onDragEnd = async (result: DropResult) => {
    const { source, destination, type } = result;
  
    if (!destination) return; // If there's no destination, exit
  
    if (type === "list") {
      // Handle reordering of lists
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
      // Handle reordering of cards
      const sourceListIndex = lists.findIndex((list) => list.id === source.droppableId);
      const destinationListIndex = lists.findIndex((list) => list.id === destination.droppableId);
  
      if (sourceListIndex === -1 || destinationListIndex === -1) return; // Exit if source or destination list not found
  
      const sourceList = lists[sourceListIndex];
      const destinationList = lists[destinationListIndex];
  
      const [movedCard] = sourceList.card.splice(source.index, 1); // Remove card from the source list
      destinationList.card.splice(destination.index, 0, movedCard); // Add card to the destination list
  
      const updatedLists = [...lists];
      updatedLists[sourceListIndex] = sourceList;
      updatedLists[destinationListIndex] = destinationList;
      setLists(updatedLists); // Update the local state
  
      try {
        // Save the new card orders for both source and destination lists
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
  
  
  
  
  

  if (!boarddet || !lists || !auditItems) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative h-full bg-no-repeat bg-cover bg-center min-h-screen">
      <div className="w-full h-20 z-[40] bg-black/50 fixed top-14 flex items-center px-6 gap-x-4">
      <BoardTitle boardId={convexBoardId} />
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Activity</Button>
          </SheetTrigger>
          <SheetContent side={"right"}>
            <SheetHeader>
              <SheetTitle>Dashboard Log</SheetTitle>
              <SheetDescription>
                <ScrollArea className="h-72 w-full rounded-md border">
                  {auditItems.map((item: any) => (
                    <div className="flex items-center gap-x-2" key={item.id}>
                      <Avatar>
                        <AvatarImage src={item.userImage || "/default-avatar.png"} alt="User Avatar" />
                      </Avatar>
                      <div className="flex flex-col space-y-0.5">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-semibold lowercase text-neutral-700">{item.username}</span>{" "}
                          {gen_log_msg(item)}
                          <p className="text-xs text-neutral-500">
                            {format(new Date(item.created), "MMM d, yyyy 'at' h:mm a")}
                          </p>
                        </p>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>

      <div className="absolute inset-0 bg-black/10" />

      <main className="relative pt-28 h-full">
        <div className="p-10 h-full overflow-x-auto">
          

          <ol className="flex gap-x-3 h-full">
            <ListForm id={convexBoardId} />

            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="board" direction="horizontal" type="list">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="flex gap-x-3 h-full">
                    {lists.map((list, index) => (
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