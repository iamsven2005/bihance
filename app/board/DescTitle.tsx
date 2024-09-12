"use client"; 

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api"; // Adjust the path to your Convex API
import { Id } from "@/convex/_generated/dataModel";

interface DescTitleProps {
  cardId: Id<"cards">; // Use Convex's Id type for cards
}

const DescTitle: React.FC<DescTitleProps> = ({ cardId }) => {
  const cardData = useQuery(api.cards.getCardDescription, { cardId }); // Real-time subscription to the card description
  const updateDescription = useMutation(api.cards.updateCardDescription); // Mutation to update the description
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState("");

  // Handle change in input
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  // Handle saving the description
  const saveDescription = async () => {
    try {
      // Use the Convex mutation to update the card description
      await updateDescription({ cardId, description });
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      console.error("Failed to update description:", error);
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
        <p
          className="text-md cursor-pointer"
          onClick={() => {
            setIsEditing(true);
            setDescription(cardData.description || ""); // Set current description in the input field
          }}
        >
          {cardData.description || "No description"} {/* Display the real-time description */}
        </p>
      )}
    </div>
  );
};

export default DescTitle;
