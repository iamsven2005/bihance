"use client";

import { useState } from "react";
import { UploadDropzone } from "@/lib/uploadthing";

export default function Home() {
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const handleUploadComplete = (res: any) => {
    const urls = res.map((file: { url: string }) => file.url);
    setImageUrls((prevUrls) => [...prevUrls, ...urls]);
    console.log("Files: ", res);
    alert("Upload Completed");
  };

  const handleUploadError = (error: Error) => {
    alert(`ERROR! ${error.message}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <UploadDropzone
        endpoint="imageUploader"
        onClientUploadComplete={handleUploadComplete}
        onUploadError={handleUploadError}
      />
      <div className="mt-8 grid grid-cols-3 gap-4">
        {imageUrls.map((url, index) => (
          <div key={index} className="w-full h-48 relative">
            <img
              src={url}
              alt={`Uploaded image ${index + 1}`}
              className="object-cover w-full h-full"
            />
          </div>
        ))}
      </div>
    </main>
  );
}
