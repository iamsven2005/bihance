import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface CardFormProps {
    id: Id<"lists">;  
  }
  
  const CardForm = ({ id: listId }: CardFormProps) => {
    const formRef = useRef<HTMLFormElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
  
    const createCard = useMutation(api.cards.createCard);
  
    const disableEdit = () => {
      setTitle("");
      setDescription("");
    };
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!title.trim()) return;
  
      setLoading(true);
      try {
  
        const lastOrder = BigInt(1);  
        await createCard({
          listId,  
          title,
          description,
          order: lastOrder + BigInt(1), 
        });
  
        setTitle("");
        setDescription("");
        disableEdit();
        toast.success("Card added successfully.");
      } catch (error) {
        console.error("Error adding card:", error);
        toast.error("There was an error adding the card.");
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <form ref={formRef} onSubmit={handleSubmit} className="m-2 flex flex-col gap-2">
        <Input
          ref={inputRef}
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter Card Title"
          disabled={loading}
        />
        <Textarea
          ref={textAreaRef}
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter Card Description"
          disabled={loading}
        />
        <input hidden value={listId} name="listId" />
        <div className="flex items-center gap-x-1">
          <Button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Card"}
          </Button>
          <Button type="button" variant="outline" onClick={disableEdit} disabled={loading}>
            Cancel
          </Button>
        </div>
      </form>
    );
  };
  export default CardForm