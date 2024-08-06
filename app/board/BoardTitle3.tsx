"use client"; 

import { useState } from "react";

interface BoardTitleProps {
  initialTitle: string | undefined;
  boardId: string;
}

const DescTitle = ({ initialTitle, boardId }:BoardTitleProps) => {
  const [description, setdescription] = useState(initialTitle || ""); 
  const [isEditing, setIsEditing] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setdescription(e.target.value);
  };

  const saveTitle = async () => {
    try {
      await fetch(`/api/boards/description/${boardId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description }),
      });
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
          value={description}
          onChange={handleTitleChange}
          onBlur={saveTitle} 
          onKeyDown={(e) => {
            if (e.key === "Enter") saveTitle(); 
          }}
          className="text-white bg-transparent border-none outline-none"
          autoFocus 
        />
      ) : (
        
        <p
          className="text-xl cursor-pointer"
          onClick={() => setIsEditing(true)}
        >
          {description}
        </p>
       
      )}
    </div>
  );
};

export default DescTitle;
