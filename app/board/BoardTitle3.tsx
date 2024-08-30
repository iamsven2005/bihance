"use client";

import { useState } from "react";
import axios from "axios";

interface BoardTitleProps {
  initialTitle: string | undefined;
  boardId: string;
}

const DescTitle: React.FC<BoardTitleProps> = ({ initialTitle, boardId }) => {
  const [description, setDescription] = useState(initialTitle || ""); 
  const [isEditing, setIsEditing] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const saveTitle = async () => {
    try {
      await axios.patch(`/api/boards/description/${boardId}`, {
        description,
      });
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
          onChange={handleTitleChange}
          onBlur={saveTitle} 
          onKeyDown={(e) => {
            if (e.key === "Enter") saveTitle(); 
          }}
          className="bg-transparent border-none outline-none"
          autoFocus 
        />
      ) : (
        <p
          className="text-md cursor-pointer"
          onClick={() => setIsEditing(true)}
        >
          {description}
        </p>
      )}
    </div>
  );
};

export default DescTitle;
