"use client";

import { useState, useEffect } from "react";
import { generateUploadDropzone } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { toast } from "sonner";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FormPicker } from "@/components/form-picker";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Link from "next/link";
import { ClipboardCheck, Ellipsis, VideoIcon } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import axios from "axios";
import { saveAs } from "file-saver";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { board, event, files, sharedfiles, user } from "@prisma/client";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UploadDropzone } from "@/lib/uploadthing";

interface Props {
  orgId: string;
  events: event[];
  files: sharedfiles[] | null;
  user: user;
  orgname: string;
}

interface ImageDetails {
  id: string;
  thumbUrl: string;
  fullUrl: string;
  user: string;
  link: string;
}

export default function Page({ orgId, events, files, user, orgname }: Props) {
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

  const router = useRouter();

  const messages = useQuery(api.messages.list, { orgId });
  const sendMessage = useMutation(api.messages.send);
  const [newMessageText, setNewMessageText] = useState("");

  const username = `${user.first_name} ${user.last_name}`;
  const [name, setName] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const UploadDropzone = generateUploadDropzone<OurFileRouter>();

  const handleUploadComplete = async (res: any) => {
    const urls = res.map((file: { url: string }) => file.url);
    const url = urls[0];

    try {
      const { data } = await axios.post("/api/upload-share-files", {
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
        const { data } = await axios.get("/api/boards");
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

  const handleAddBoard = async () => {
    if (!newBoardTitle || !selectedImage) return toast.error('Image not selected');
    try {
      const { data: board } = await axios.post('/api/boards', {
        title: newBoardTitle,
        orgId,
        imageId: selectedImage.id,
        imageThumbUrl: selectedImage.thumbUrl,
        imageFullUrl: selectedImage.fullUrl,
        username: selectedImage.user,
        link: selectedImage.link,
      });

      setBoards((prevBoards) => [...prevBoards, board]);
      setNewBoardTitle('');
      setSelectedImage(null);
      toast.success('Board Created');
      router.push(`/workspace/${orgId}/${board.id}`);
    } catch (error) {
      console.error('Error adding board:', error);
      toast.error('Failed to create board');
    }
  };

  const handleDeleteBoard = async (id: string) => {
    try {
      await axios.delete(`/api/boards`, { params: { id } });

      setBoards((prevBoards) => prevBoards.filter((board) => board.id !== id));
      toast.success('Board deleted');
    } catch (error) {
      console.error('Error deleting board:', error);
      toast.error('Failed to delete board');
    }
  };

  const handleEditBoard = async () => {
    if (!editingBoard) return;

    try {
      const updatedBoard = { ...editingBoard, title: renamingBoardTitle };
      const { data: board } = await axios.patch('/api/boards', updatedBoard);

      setBoards((prevBoards) =>
        prevBoards.map((b) => (b.id === board.id ? board : b))
      );
      setEditingBoard(null);
      setShowRenameDialog(false);
      toast.success('Board updated');
    } catch (error) {
      console.error('Error updating board:', error);
      toast.error('Failed to update board');
    }
  };

  const handleFileUploadComplete = (file: { id: string; url: string; name: string }) => {
    toast.success(`File ${file.name} uploaded successfully`);
  };

  const handleCopyLink = (eventId: string) => {
    const uploadLink = `https://www.bihance.app/event/${eventId}`;
    navigator.clipboard
      .writeText(uploadLink)
      .then(() => {
        toast.success("Copied Link!");
      })
      .catch((err) => {
        toast.error("Failed to copy: ", err);
      });
  };

  const handleDownloadQRCode = (eventId: string) => {
    const canvas = document.getElementById(`qr-code-${eventId}`) as HTMLCanvasElement;
    canvas.toBlob((blob) => {
      if (blob) {
        saveAs(blob, `event-${eventId}-qrcode.png`);
      }
    });
  };

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      {/* Chat Component */}
      <Card>
        <CardContent>
          <div className="flex">
            <CardTitle>{orgname}</CardTitle>
            <Button
              onClick={() => {
                const callWindow = window.open(
                  `/room/${orgId}`,
                  'callWindow',
                  'width=1200,height=800,left=200,top=100'
                );
                if (callWindow) {
                  callWindow.focus();
                }
              }}
              className="flex-end"
            >
              Start Call <VideoIcon />
            </Button>
          </div>
          <CardDescription>Connected as {username}</CardDescription>
        </CardContent>
        {messages?.map((message) => (
          <div key={message._id} className={message.author === username ? "message-mine" : ""}>
            <div>{message.author}: {message.body}</div>
          </div>
        ))}
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await sendMessage({ body: newMessageText, author: username, orgId });
            setNewMessageText("");
          }}
          className="flex gap-2"
        >
          <Input
            value={newMessageText}
            onChange={(e) => setNewMessageText(e.target.value)}
            placeholder="Write a message…"
          />
          <Button type="submit" disabled={!newMessageText}>Send</Button>
        </form>
      </Card>

      {/* Boards Section */}
      <Card>
        <CardHeader className="flex">
          <CardTitle>Boards</CardTitle>
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search boards"
            className="mb-4"
          />
        </CardHeader>
        <FormPicker id="image" onSelectImage={setSelectedImage} />
        <div className="flex m-2 gap-2">
          <Input
            value={newBoardTitle}
            onChange={(e) => setNewBoardTitle(e.target.value)}
            placeholder="New board title"
          />
          <Button onClick={handleAddBoard}>Add Board</Button>
        </div>
        <div className="w-full mx-auto m-5">
          <Carousel className="rounded-lg overflow-hidden">
            <CarouselContent>
              {filteredBoards.map((board) => (
                <CarouselItem key={board.id} className="basis-1/2 md:basis-1/2 lg:basis-1/3">
                  <div className="relative group">
                    <img src={board.imageFullUrl} alt="Board Image" width={600} height={400} className="object-cover w-full aspect-[3/2]" />
                    <div className="absolute inset-x-0 bottom-0 bg-black/70 group-hover:bg-black/80 transition-colors p-4 flex items-center justify-between flex-col">
                      <Link href={`/board/${board.id}`} className="text-white font-semibold text-lg m-5 flex">
                        <ClipboardCheck />
                        {board.title}
                      </Link>
                      <div className="flex">
                        <Button variant="outline" className="mr-2" onClick={() => openRenameDialog(board)}>Rename</Button>
                        <Button variant="outline" onClick={() => handleDeleteBoard(board.id)}>Delete</Button>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </Card>

      {/* Rename Dialog */}
      {editingBoard && (
        <Dialog open={showRenameDialog} onOpenChange={() => setShowRenameDialog(false)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rename Board</DialogTitle>
            </DialogHeader>
            <Input
              value={renamingBoardTitle}
              onChange={(e) => setRenamingBoardTitle(e.target.value)}
              placeholder="New board title"
              className="mb-4"
            />
            <DialogFooter>
              <Button onClick={handleEditBoard}>Save</Button>
              <Button variant="ghost" onClick={() => setShowRenameDialog(false)}>Cancel</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Shared Files Section */}
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

        {/* File Upload Section */}
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

      {/* Events Section */}
      <Card>
        <CardHeader>
          <CardTitle>All events:</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            placeholder="Search for an event..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex flex-wrap m-5">
            {filteredEvents.map((item) => (
              <Card key={item.eventid} className="w-56">
                <CardHeader>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Ellipsis />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <Link href={`/edit-event/${item.eventid}`} className="w-full">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem>
                        <Link href={`/view/${item.eventid}`} className="w-full">Employees</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href={`/payment/${item.eventid}`} className="w-full">Shifts</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Button variant={"ghost"} onClick={() => handleCopyLink(item.eventid)}>Copy Invite</Button>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Button variant={"ghost"} onClick={() => setQrCodePreviewEventId(item.eventid)}>QR Code</Button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent>
                  <img src={item.image} alt={item.name} />
                  <CardTitle>{item.name}</CardTitle>
                  <CardDescription>{item.location}</CardDescription>
                </CardContent>
                <CardFooter>
                  <div dangerouslySetInnerHTML={{ __html: item.description }}></div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* QR Code Preview Dialog */}
      {qrCodePreviewEventId && (
        <Dialog open={qrCodePreviewEventId !== null} onOpenChange={() => setQrCodePreviewEventId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>QR Code Preview</DialogTitle>
            </DialogHeader>
            <QRCodeCanvas
              id={`qr-code-preview`}
              value={`https://www.bihance.app/event/${qrCodePreviewEventId}`}
              size={256}
            />
            <DialogFooter>
              <Button onClick={() => handleDownloadQRCode(qrCodePreviewEventId)}>Download QR Code</Button>
              <Button variant="ghost" onClick={() => setQrCodePreviewEventId(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
