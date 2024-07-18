"use client";

import { useState } from "react";
import { generateUploadDropzone } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";


type UploadImageProps = {
  onUploadComplete: (url: string) => void;
};

const UploadImage: React.FC<UploadImageProps> = ({ onUploadComplete }) => {
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const UploadDropzone = generateUploadDropzone<OurFileRouter>();

  const handleUploadComplete = (res: any) => {
    const urls = res.map((file: { url: string }) => file.url);
    setUploadedUrl(urls[0]); 
    onUploadComplete(urls[0]);
    toast.success("Image uploaded")
  };

  const handleUploadError = (error: Error) => {
    toast.error("Unable to upload image")
  };

  return (
    <div>
      <UploadDropzone
        endpoint="imageUploader"
        onClientUploadComplete={handleUploadComplete}
        onUploadError={handleUploadError}
      />
    </div>
  );
};

export default UploadImage;
