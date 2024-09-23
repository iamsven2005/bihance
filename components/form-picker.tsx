'use client';

import { unsplash } from "@/lib/unsplash";
import { cn } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { defaultImages } from "@/actions/images";
import { toast } from "sonner";
import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";

interface Props {
  id: string;
  onSelectImage: (image: ImageDetails | null) => void; // New prop for handling image selection
}

interface ImageDetails {
  id: string;
  thumbUrl: string;
  fullUrl: string;
  user: string;
  link: string;
}

export const FormPicker = ({ id, onSelectImage }: Props) => {
  const [images, setImages] = useState<Array<Record<string, any>>>([defaultImages]);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const { pending } = useFormStatus();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const result = await unsplash.photos.getRandom({
          collectionIds: ["317099"],
          count: 12,
        });
        if (result && result.response) {
          const newImages = result.response as Array<Record<string, any>>;
          setImages(newImages);
        } else {
          toast.error("Unable to get images");
        }
      } catch (error) {
        console.error("Error fetching images:", error);
        setImages([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchImages();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <Carousel className="m-5 p-5 rounded-xl">
        <h1>Select Board Background</h1>
        <CarouselContent>

        
        {images.map((image: any) => (
          <CarouselItem
            key={image.id}
            className={cn(
              "basis-1/2 md:basis-1/3 lg:basis-1/4 cursor-pointer relative aspect-video group hover:opacity-75 transition bg-muted w-full h-full",
              pending && "opacity-50 hover:opacity-50 cursor-auto"
            )}
            onClick={() => {
              if (pending) return;
              setSelected(image.id);
              onSelectImage({
                id: image.id,
                thumbUrl: image.urls.thumb,
                fullUrl: image.urls.full,
                user: image.user.name,
                link: image.links.html,
              }); // Pass selected image data back to parent component
            }}
          >
            <input
              type="radio"
              id={id}
              name={id}
              className="hidden"
              checked={selected === image.id}
              disabled={pending}
              value={`${image.id} | ${image.urls.thumb} | ${image.urls.full} | ${image.links.html} | ${image.user.name}`}
            />
            <Image
              fill
              alt="unsplash"
              className="object-cover rounded-sm"
              src={image.urls.thumb}
            />
            {selected === image.id && (
              <div className="absolute inset-y-0 bg-black/30 flex items-center justify-center w-full">
                <Check />
              </div>
            )}
            <Link
              href={image.links.html}
              target="_blank"
              className="opacity-0 group-hover:opacity-100 absolute bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/50"
            >
              {image.user.name}
            </Link>
          </CarouselItem>
        ))}
</CarouselContent>
</Carousel>
  );
};
