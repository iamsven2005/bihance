"use client";

import { useState, useEffect } from "react";
import { generateUploadDropzone } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

import Link from "next/link";
import axios from "axios";
import { board, event, files, sharedfiles, user } from "@prisma/client";

interface Props {
  orgId: string;
  files: sharedfiles[] | null;
  user: user;
}

interface ImageDetails {
  id: string;
  thumbUrl: string;
  fullUrl: string;
  user: string;
  link: string;
}

export default function Page({ orgId, files, user }: Props) {
  const [boards, setBoards] = useState<board[]>([]);
  const [filteredBoards, setFilteredBoards] = useState<board[]>([]);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [editingBoard, setEditingBoard] = useState<board | null>(null);
  const [renamingBoardTitle, setRenamingBoardTitle] = useState(''); // Title for renaming the board
  const [showRenameDialog, setShowRenameDialog] = useState(false); // Controls rename dialog visibility
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<ImageDetails | null>(null);
  const [qrCodePreviewEventId, setQrCodePreviewEventId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [fileSearchTerm, setFileSearchTerm] = useState('');

  const router = useRouter()
  const username = `${user.first_name} ${user.last_name}`;
  const [name, setName] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const UploadDropzone = generateUploadDropzone<OurFileRouter>();

  const handleUploadComplete = async (res: any) => {
    const urls = res.map((file: { url: string }) => file.url);
    const url = urls[0];

    try {
      const { data } = await axios.post("/api/sharedfiles", {
        orgId,
        url,
        name,
      });

      setUploadedUrl(data.url);
      toast.success("File uploaded successfully");
      router.refresh()
    } catch (error) {
      console.error("Failed to upload file", error);
      toast.error("Failed to upload file");
    }
  };

  const handleUploadError = (error: Error) => {
    toast.error("Unable to upload file");
  };

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const { data } = await axios.get("/api/board");
        setBoards(data);
        setFilteredBoards(data);
      } catch (error) {
        console.error("Error fetching boards:", error);
        toast.error("Failed to fetch boards");
      }
    };

    fetchBoards();
  }, [orgId]);

  useEffect(() => {
    setFilteredBoards(
      boards.filter((board) =>
        board.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, boards]);




  const filteredFiles = files?.filter((file) =>
    file.name.toLowerCase().includes(fileSearchTerm.toLowerCase())
  );

  const openRenameDialog = (board: board) => {
    setEditingBoard(board);
    setRenamingBoardTitle(board.title);
    setShowRenameDialog(true);
  };

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
            <UploadDropzone
              endpoint="fileUploader"
              onClientUploadComplete={handleUploadComplete}
              onUploadError={handleUploadError}
            />
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
