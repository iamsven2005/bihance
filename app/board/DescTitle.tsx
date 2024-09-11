import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api"; // Adjust path to your Convex API
import { Id } from "@/convex/_generated/dataModel";

interface DescTitleProps {
  initialTitle: string | undefined;
  boardId: string;
  cardId: Id<"cards">
}

const DescTitle: React.FC<DescTitleProps> = ({ initialTitle, boardId, cardId }) => {
  const [description, setDescription] = useState(initialTitle || "");
  const [isEditing, setIsEditing] = useState(false);

  // Convex mutation for updating the description
  const updateDescription = useMutation(api.cards.updateCardDescription);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const saveDescription = async () => {
    try {
      await updateDescription({ cardId, description }); // Use Convex mutation
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update description:", error);
    }
  };

  return (
    <div>
      {isEditing ? (
        <input
          type="text"
          value={description}
          onChange={handleDescriptionChange}
          onBlur={saveDescription}
          onKeyDown={(e) => {
            if (e.key === "Enter") saveDescription();
          }}
          className="bg-transparent border-none outline-none"
          autoFocus
        />
      ) : (
        <p className="text-md cursor-pointer" onClick={() => setIsEditing(true)}>
          {description}
        </p>
      )}
    </div>
  );
};

export default DescTitle;
