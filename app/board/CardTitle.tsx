import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api"; // Adjust the path to your Convex API
import { Id } from "@/convex/_generated/dataModel";

interface CardTitleProps {
  initialTitle: string | undefined;
  cardId: Id<"cards">; 
}

const CardTitle: React.FC<CardTitleProps> = ({ initialTitle, cardId }) => {
  const [title, setTitle] = useState(initialTitle || "");
  const [isEditing, setIsEditing] = useState(false);

  // Convex mutation for updating the title
  const updateTitle = useMutation(api.cards.updateCardTitle);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const saveTitle = async () => {
    try {
      await updateTitle({ cardId, title }); // Use Convex mutation to update the card title
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update title:", error);
    }
  };

  return (
    <div>
      {isEditing ? (
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          onBlur={saveTitle}
          onKeyDown={(e) => {
            if (e.key === "Enter") saveTitle();
          }}
          className="text-white bg-transparent border-none outline-none"
          autoFocus
        />
      ) : (
        <h1 className="text-xl cursor-pointer" onClick={() => setIsEditing(true)}>
          {title}
        </h1>
      )}
    </div>
  );
};

export default CardTitle;
