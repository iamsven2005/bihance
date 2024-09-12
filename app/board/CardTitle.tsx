"use client"; 

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api"; // Adjust the path to your Convex API
import { Id } from "@/convex/_generated/dataModel";

interface CardTitleProps {
  cardId: Id<"cards">; // Use Convex's Id type for cards
}

const CardTitle: React.FC<CardTitleProps> = ({ cardId }) => {
  const cardData = useQuery(api.cards.getCardTitle, { cardId }); // Real-time subscription to the card title
  const updateTitle = useMutation(api.cards.updateCardTitle); // Mutation for updating the title
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");

  // Handle input change
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  // Handle saving the title
  const saveTitle = async () => {
    try {
      // Use the Convex mutation to update the card title
      await updateTitle({ cardId, title });
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      console.error("Failed to update title:", error);
    }
  };

  // Handle loading state
  if (!cardData) {
    return <p>Loading...</p>;
  }

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
        <h1
          className="text-xl cursor-pointer"
          onClick={() => {
            setIsEditing(true);
            setTitle(cardData.title); // Set current title in the input field
          }}
        >
          {cardData.title} {/* Display the real-time title */}
        </h1>
      )}
    </div>
  );
};

export default CardTitle;
