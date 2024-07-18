"use client";

import { useState } from "react";
import { generateUploadDropzone } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { toast } from "sonner";

type UploadFileProps = {
  eventId: string;
  onUploadComplete: (file: { url: string; name: string }) => void;
};

const UploadFile: React.FC<UploadFileProps> = ({ eventId, onUploadComplete }) => {
  const [name, setName] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const UploadDropzone = generateUploadDropzone<OurFileRouter>();

  const handleUploadComplete = async (res: any) => {
    const urls = res.map((file: { url: string }) => file.url);
    const url = urls[0];

    try {
      const response = await fetch("/api/upload-file", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventId, url, name }),
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const file = await response.json();
      setUploadedUrl(file.url);
      onUploadComplete(file);
      toast.success("File uploaded successfully");
    } catch (error) {
      console.error("Failed to upload file", error);
      toast.error("Failed to upload file");
    }
  };

  const handleUploadError = (error: Error) => {
    toast.error("Unable to upload file");
  };

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="fileName" className="block text-sm font-medium">
          File Name:
        </label>
        <input
          type="text"
          id="fileName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input input-bordered w-full"
          required
        />
      </div>
      <UploadDropzone
        endpoint="imageUploader"
        onClientUploadComplete={handleUploadComplete}
        onUploadError={handleUploadError}
      />
      {uploadedUrl && (
        <div>
          <p>Upload complete. File URL: {uploadedUrl}</p>
        </div>
      )}
    </div>
  );
};

export default UploadFile;
