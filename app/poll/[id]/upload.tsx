"use client";

import { UploadButton } from "@/lib/uploadthing";
import { toast } from "sonner";

export default function Home({ eventId }: any) {

  const handleUploadComplete = async (res: any[]) => {
    try {
      console.log(res)
      const uploadedImage = res[0];
      const imageName = uploadedImage.name
  
      const response = await fetch('/api/polling', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: uploadedImage.url,
          name: imageName,
          eventId: eventId,
        }),
      });
  
      if (response.ok) {
        toast.success("Image uploaded and saved successfully!");
        window.location.reload(); // Refresh the page to reflect the new image
      } else {
        toast.error( "Failed to save image to the database" );
      }
    } catch (error) {
      toast.error( "Upload failed" );
    }
  };
  

  return (
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={handleUploadComplete}
        onUploadError={(error: Error) => {
          toast.error(`ERROR! ${error.message}`);
        }}
      />
  );
}
