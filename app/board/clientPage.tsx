"use client"

import ListForm from "./Form";
import ListTitle from "./listcards";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useState } from "react";
import { toast } from "sonner";

interface PageClientProps {
  board: string;
  lists: any;
}

const PageClient = ({ board, lists: initialLists }: PageClientProps) => {
  const [lists, setLists] = useState(initialLists);

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, type } = result;

    if (!destination) return;

    if (type === "list") {
      // Reorder lists
      const reorderedLists = [...lists];
      const [movedList] = reorderedLists.splice(source.index, 1);
      reorderedLists.splice(destination.index, 0, movedList);
      setLists(reorderedLists);

      // Update server with the new list order
      try {
        await fetch(`/api/boards/reorderLists`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            boardId: board,
            listOrder: reorderedLists.map((list) => list.id),
          }),
        });
        toast.success("List order updated successfully");
      } catch (error) {
        console.error("Failed to update list order:", error);
        toast.error("Failed to update list order");
      }
    } else if (type === "card") {
      // Reorder cards
      const sourceListIndex = lists.findIndex((list: { id: string; }) => list.id === source.droppableId);
      const destinationListIndex = lists.findIndex((list: { id: string; }) => list.id === destination.droppableId);

      const sourceList = lists[sourceListIndex];
      const destinationList = lists[destinationListIndex];

      // Extract the moved card
      const [movedCard] = sourceList.card.splice(source.index, 1);

      // Insert card into new position
      destinationList.card.splice(destination.index, 0, movedCard);

      const updatedLists = [...lists];
      updatedLists[sourceListIndex] = sourceList;
      updatedLists[destinationListIndex] = destinationList;
      setLists(updatedLists);

      // Log payload for debugging
      console.log({
        boardId: board,
        sourceListId: source.droppableId,
        destinationListId: destination.droppableId,
        sourceCardOrder: sourceList.card.map((card: { id: any; }) => card.id),
        destinationCardOrder: destinationList.card.map((card: { id: any; }) => card.id),
      });

      // Update server with the new card order
      try {
        await fetch(`/api/boards/reorderCards`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            boardId: board,
            sourceListId: source.droppableId,
            destinationListId: destination.droppableId,
            sourceCardOrder: sourceList.card.map((card: { id: any; }) => card.id),
            destinationCardOrder: destinationList.card.map((card: { id: any; }) => card.id),
          }),
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

export default PageClient;
