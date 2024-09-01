//@ts-nocheck
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import DeleteImage from "./delete";
import Home from "./upload";
import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface Props {
  params: {
    id: string;
  };
  initialImages: any[]; // Pass initial images as props
}

const Page = ({ params, initialImages }: Props) => {
  const [images, setImages] = useState(initialImages);

  const handleOnDragEnd = (result: { destination: { index: number; }; source: { index: number; }; }) => {
    if (!result.destination) return;

    const reorderedImages = Array.from(images);
    const [movedImage] = reorderedImages.splice(result.source.index, 1);
    reorderedImages.splice(result.destination.index, 0, movedImage);

    setImages(reorderedImages);

    // Call the async function separately
    saveImageOrder(reorderedImages);
  };

  const saveImageOrder = async (reorderedImages: any[]) => {
    try {
      await fetch('/api/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          images: reorderedImages.map((image: { id: any; }, index: number) => ({
            id: image.id,
            order: index + 1,
          })),
        }),
      });
    } catch (error) {
      console.error("Failed to save image order:", error);
    }
  };

  return (
    <Card>
      <CardHeader className="flex gap-2">
        <CardTitle>Images</CardTitle>
        <div className="flex gap-2">
          <Button asChild>
            <Link href={`/`}>View Events</Link>
          </Button>
          <Button asChild>
            <Link href={`/events/${params.id}`}>Voting Page</Link>
          </Button>
        </div>

        <Home eventId={params.id} />
      </CardHeader>
      <CardContent className="flex flex-wrap mx-auto items-center justify-center">
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="images" direction="horizontal">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex flex-wrap"
              >
                {images.map((image, index) => (
                  <Draggable key={image.id} draggableId={image.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="flex p-5 m-5 flex-col items-center"
                      >
                        <img src={image.url} className="w-48" alt={`Image ${image.id}`} />
                        <CardDescription>Total Votes: {image.votes}</CardDescription>
                        <DeleteImage id={image.id} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </CardContent>
    </Card>
  );
};

export default Page;
