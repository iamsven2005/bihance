"use client";

import { useState } from "react";
import { generateUploadDropzone } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { Button } from "@/components/ui/button";

type UploadImageProps = {
  onUploadComplete: (url: string) => void;
};

const UploadImage: React.FC<UploadImageProps> = ({ onUploadComplete }) => {
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const UploadDropzone = generateUploadDropzone<OurFileRouter>();

  const handleUploadComplete = (res: any) => {
    const urls = res.map((file: { url: string }) => file.url);
    setUploadedUrl(urls[0]); // assuming single file upload
    onUploadComplete(urls[0]);
  };

  const handleUploadError = (error: Error) => {
    alert(`ERROR! ${error.message}`);
  };

  return (
    <div>
      <UploadDropzone
        endpoint="imageUploader"
        onClientUploadComplete={handleUploadComplete}
        onUploadError={handleUploadError}
      />
      {uploadedUrl && (
        <div>
          <p>Upload complete. Image URL: {uploadedUrl}</p>
        </div>
      )}
    </div>
  );
};

export default UploadImage;
