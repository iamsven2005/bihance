'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormPicker } from '@/components/form-picker';
import { toast } from 'sonner';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Link from 'next/link';
import { ClipboardCheck } from 'lucide-react';

interface Props {
    orgId: string;
}

interface Board {
    id: string;
    title: string;
    orgId: string;
    imageId?: string;          // Image fields (optional)
    imageThumbUrl?: string;    // Image fields (optional)
    imageFullUrl?: string;     // Image fields (optional)
    username?: string;         // Image fields (optional)
    link?: string;             // Image fields (optional)
}

interface ImageDetails {
    id: string;
    thumbUrl: string;
    fullUrl: string;
    user: string;
    link: string;
}

const Page = ({ orgId }: Props) => {
    const [boards, setBoards] = useState<Board[]>([]);
    const [filteredBoards, setFilteredBoards] = useState<Board[]>([]);
    const [newBoardTitle, setNewBoardTitle] = useState('');
    const [editingBoard, setEditingBoard] = useState<Board | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedImage, setSelectedImage] = useState<ImageDetails | null>(null); // New state for selected image
    const router = useRouter();

    useEffect(() => {
        const fetchBoards = async () => {
            try {
                const response = await fetch(`/api/boards`);
                if (!response.ok) {
                    throw new Error('Failed to fetch boards');
                }
                const data = await response.json();
                setBoards(data);
                setFilteredBoards(data);
            } catch (error) {
                console.error('Error fetching boards:', error);
            }
        };

        fetchBoards();
    }, [orgId]);

    useEffect(() => {
        setFilteredBoards(
            boards.filter(board =>
                board.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [searchQuery, boards]);

    const handleAddBoard = async () => {
        if (!newBoardTitle || !selectedImage) return toast.error("Image not selected")
        try {
            const response = await fetch('/api/boards', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: newBoardTitle,
                    orgId,
                    imageId: selectedImage.id,
                    imageThumbUrl: selectedImage.thumbUrl,
                    imageFullUrl: selectedImage.fullUrl,
                    username: selectedImage.user,
                    link: selectedImage.link,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create board');
            }

            const board = await response.json();
            setBoards((prevBoards) => [...prevBoards, board]);
            setNewBoardTitle('');
            setSelectedImage(null); // Clear selected image after adding
            toast.success("Board Created")
            router.push(`/workspace/${orgId}/${board.id}`)
        } catch (error) {
            console.error('Error adding board:', error);
        }
    };

    const handleDeleteBoard = async (id: string) => {
        try {
            const response = await fetch(`/api/boards?id=${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete board');
            }

            setBoards((prevBoards) => prevBoards.filter((board) => board.id !== id));
        } catch (error) {
            console.error('Error deleting board:', error);
        }
    };

    const handleEditBoard = async () => {
        if (!editingBoard) return;

        try {
            const response = await fetch('/api/boards', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editingBoard),
            });

            if (!response.ok) {
                throw new Error('Failed to update board');
            }

            const updatedBoard = await response.json();

            setBoards((prevBoards) =>
                prevBoards.map((board) => (board.id === updatedBoard.id ? updatedBoard : board))
            );

            setEditingBoard(null);
        } catch (error) {
            console.error('Error updating board:', error);
        }
    };

    return (
        <div>
            <h1>Boards</h1>
            <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search boards"
                className="mb-4"
            />
            <FormPicker id="image" onSelectImage={setSelectedImage} />


            <div className="mt-4">
                <Input
                    value={newBoardTitle}
                    onChange={(e) => setNewBoardTitle(e.target.value)}
                    placeholder="New board title"
                />
                <Button onClick={handleAddBoard}>Add Board</Button>
            </div>


            <div className="w-full mx-auto m-5">
                <Carousel className="rounded-lg overflow-hidden">
                    <CarouselContent >
                        {filteredBoards.map((board) => (

                            <CarouselItem key={board.id}  className="basis-1/2 md:basis-1/2 lg:basis-1/3  ">
                                <div className="relative group">
                                    <img src={board.imageFullUrl} alt="Product Image"
                                        width={600}
                                        height={400}
                                        className="object-cover w-full aspect-[3/2]"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 bg-black/70 group-hover:bg-black/80 transition-colors p-4 flex items-center justify-between flex-col">
                                        <Link href={`/board/${board.id}`} className="text-white font-semibold text-lg m-5 flex"><ClipboardCheck/>{board.title}</Link>
                                        <div className="flex">
                                        <Button variant="outline" className="mr-2" onClick={() => setEditingBoard(board)}>Rename</Button>
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
            {editingBoard && (
                <Dialog open={Boolean(editingBoard)} onOpenChange={() => setEditingBoard(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Rename Board</DialogTitle>
                        </DialogHeader>
                        <Input
                            value={editingBoard.title}
                            onChange={(e) =>
                                setEditingBoard({ ...editingBoard, title: e.target.value })
                            }
                            placeholder="New title"
                        />
                        <DialogFooter>
                            <Button onClick={handleEditBoard}>Save changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default Page;
