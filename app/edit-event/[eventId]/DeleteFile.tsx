import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type DeleteFileProps = {
  id: string;
  onDeleteComplete: (id: string) => void;
};

const DeleteFile = ({ id, onDeleteComplete }: DeleteFileProps) => {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/events/${id}/files/`);
      toast.success("File deleted");
      onDeleteComplete(id);
    } catch (error) {
      console.error("Failed to delete file:", error);
      toast.error("Failed to delete file");
    }
  };

  return (
    <Button variant="destructive" onClick={handleDelete} className="ml-4">
      Delete
    </Button>
  );
};

export default DeleteFile;
