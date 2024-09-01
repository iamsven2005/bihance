"use client";
import { Card, CardContent } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Image } from '@prisma/client';
import { toast } from 'sonner';



interface ImageGalleryProps {
  images: Image[];
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [imageData, setImageData] = useState<Image[]>([]);
  const [selectedCount, setSelectedCount] = useState(0);

  useEffect(() => {
    const sortedImages = [...images].sort((a, b) => a.order - b.order);
    setImageData(sortedImages);
  }, [images]);

  const handleVote = async (imageId: string, isChecked: boolean) => {
    try {
      const method = isChecked ? 'POST' : 'PATCH';
      const response = await fetch('/api/vote', {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageId }),
      });

      if (!response.ok) {
        throw new Error('Failed to update vote');
      }

      const updatedImage = await response.json();

      setImageData(prevImages =>
        prevImages.map(image =>
          image.id === updatedImage.id ? { ...image, votes: updatedImage.votes } : image
        )
      );

      setSelectedCount(prevCount => (isChecked ? prevCount + 1 : prevCount - 1));

      toast.success( isChecked ? "Vote cast successfully!" : "Vote retracted");
    } catch (error) {
      toast.error( "Failed to update vote. Please try again." );
    }
  };

  const handleSubmit = () => {
    window.location.reload(); // Refreshes the page to allow voting again
  };

  return (
    <div>
      <Card className='p-5 m-5 flex flex-wrap rounded-md'>
        {imageData.map(image => (
          <CardContent key={image.id} className="cursor-pointer flex flex-col items-center">
            <img src={image.url} alt={`Image ${image.id}`} className='w-56 rounded-md' />
            <Checkbox
              id={`vote-${image.id}`}
              onCheckedChange={(isChecked) => handleVote(image.id, Boolean(isChecked))}
            />
            <p className='font-boldtext-lg'>
              {image.name}
            </p>
          </CardContent>
        ))}
      </Card>
      <Button 
        onClick={handleSubmit} 
        className="mt-5" 
        disabled={selectedCount !== 3} 
      >
        {selectedCount !== 3 ? "Select 3 Images" : "Submit"}
      </Button>
    </div>
  );
};

export default ImageGallery;
