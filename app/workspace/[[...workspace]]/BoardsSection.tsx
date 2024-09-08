"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormPicker } from "@/components/form-picker";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ClipboardCheck } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";
import { board } from "@prisma/client";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

interface ImageDetails {
  id: string;
  thumbUrl: string;
  fullUrl: string;
  user: string;
  link: string;
}

interface BoardsSectionProps {
  orgId: string;
}

export const BoardsSection = ({ orgId }: BoardsSectionProps) => {
  const [boards, setBoards] = useState<board[]>([]);
  const [filteredBoards, setFilteredBoards] = useState<board[]>([]);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [editingBoard, setEditingBoard] = useState<board | null>(null);
  const [renamingBoardTitle, setRenamingBoardTitle] = useState('');
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<ImageDetails | null>(null);
  const router = useRouter();

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

  const openRenameDialog = (board: board) => {
    setEditingBoard(board);
    setRenamingBoardTitle(board.title);
    setShowRenameDialog(true);
  };

  return (
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
    </Card>
  );
};
