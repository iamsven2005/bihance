"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { sharedfiles, user } from "@prisma/client";
import UploadBtn from "@/components/upload"; // Import the upload button component

interface Props {
  orgId: string;
  files: sharedfiles[] | null;
  user: user;
}

export default function Page({ orgId, files, user }: Props) {
  const [fileSearchTerm, setFileSearchTerm] = useState('');
  const [name, setName] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const router = useRouter();

  const handleUploadComplete = async (url: string) => {
    if (!name) {
      toast.error("Please provide a name for the file before uploading.");
      return; // Prevent the upload from proceeding if no name is provided
    }

    try {
      const { data } = await axios.post("/api/sharedfiles", {
        orgId,
        url,
        name,
      });

      setUploadedUrl(data.url);
      toast.success("File uploaded successfully");
      router.refresh();
    } catch (error) {
      console.error("Failed to upload file", error);
      toast.error("Failed to upload file");
    }
  };

  const filteredFiles = files?.filter((file) =>
    file.name.toLowerCase().includes(fileSearchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-2">
      <Card>
        <CardHeader>
          <CardTitle>Shared Files</CardTitle>
          <Input
            type="text"
            placeholder="Search files"
            value={fileSearchTerm}
            onChange={(e) => setFileSearchTerm(e.target.value)}
            className="mb-4"
          />
        </CardHeader>
        <div className="m-2 flex flex-wrap gap-2">
          {filteredFiles && filteredFiles.length > 0 ? (
            filteredFiles.map((file) => (
              <div key={file.id} className="mb-4">
                <Link href={file.url} target="_blank" className="text-blue-500 hover:underline">
                  {file.name}
                </Link>
              </div>
            ))
          ) : (
            <p>No files match your search.</p>
          )}
        </div>
        <CardContent>
          <div>
            <div className="mb-4">
              <Input
                type="text"
                id="fileName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
                placeholder="Enter file name"
                required
              />
            </div>
            <UploadBtn done={handleUploadComplete}/>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
