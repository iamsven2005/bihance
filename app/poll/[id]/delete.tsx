"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props {
  id: string;
}

const DeleteImage = ({ id }: Props) => {
  const router = useRouter();

  const handleDelete = async (imageId: string) => {
    const response = await fetch("/api/vote", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageId }), 
    });

    if (response.ok) {
      toast.success("Deleted")
    } else {
      console.error("Failed to delete the image");
    }
    router.refresh(); 

  };

  return (
    <Button onClick={() => handleDelete(id)}>
      Delete
    </Button>
  );
};

export default DeleteImage;
