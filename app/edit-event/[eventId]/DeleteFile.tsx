"use server"
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";

interface Props{
    id: string
}
const DeleteFile = async({id}: Props
) => {
    const handleFileDelete = async (fileId: string) => {
        const files = await db.files.delete({
          where: {
            id: fileId,
          },
        });
      };
    
    return ( 
        <Button onClick={() => handleFileDelete(id)} className="ml-2" variant="destructive">
        Delete
        </Button>
     );
}
 
export default DeleteFile;