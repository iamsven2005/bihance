"use client"; 

import { useState } from "react";

interface BoardTitleProps {
  initialTitle: string | undefined;
  boardId: string;
}

const BoardTitle: React.FC<BoardTitleProps> = ({ initialTitle, boardId }) => {
  const [title, setTitle] = useState(initialTitle || ""); 
  const [isEditing, setIsEditing] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const saveTitle = async () => {
    try {
      await fetch(`/api/boards/${boardId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
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
          onClick={() => setIsEditing(true)}
        >
          {title}
        </h1>
       
      )}
    </div>
  );
};

export default BoardTitle;
