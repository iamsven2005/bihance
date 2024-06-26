"use client";

import { useState } from "react";
import { generateUploadDropzone } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";

type UploadImageProps = {
  onUploadComplete: (url: string) => void;
};

const UploadImage: React.FC<UploadImageProps> = ({ onUploadComplete }) => {
  const UploadDropzone = generateUploadDropzone<OurFileRouter>();

  const handleUploadComplete = (res: any) => {
    const urls = res.map((file: { url: string }) => file.url);
    const uploadedUrl = urls[0]; // assuming single file upload
    onUploadComplete(uploadedUrl);
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
    </div>
  );
};

export default UploadImage;
