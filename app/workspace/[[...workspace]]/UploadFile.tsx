"use client";

import { useState } from "react";
import { generateUploadDropzone } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

type UploadFileProps = {
  orgId: string;  // Updated to include orgId
  onUploadComplete: (file: { id: string; url: string; name: string }) => void;
};

const UploadFile: React.FC<UploadFileProps> = ({ orgId, onUploadComplete }) => {
  const [name, setName] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const UploadDropzone = generateUploadDropzone<OurFileRouter>();

  const handleUploadComplete = async (res: any) => {
    const urls = res.map((file: { url: string }) => file.url);
    const url = urls[0];

    try {
      const response = await fetch("/api/upload-share-files", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orgId, url, name }),  // Include orgId in the payload
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const file = await response.json();
      setUploadedUrl(file.url);
      onUploadComplete({ id: file.id, url: file.url, name: file.name });
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
        <Input
          type="text"
          id="fileName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full"
          placeholder="filename"
          required
        />
      </div>
      <UploadDropzone
        endpoint="fileUploader"
        onClientUploadComplete={handleUploadComplete}
        onUploadError={handleUploadError}
      />
    </div>
  );
};

export default UploadFile;
