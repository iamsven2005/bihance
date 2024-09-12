"use client";

import { useState } from "react";
import { api } from "@/convex/_generated/api"; // Adjust the path to your Convex API
import { Id } from "@/convex/_generated/dataModel";
import { useQuery, useMutation } from "convex/react";

interface BoardTitleProps {
  boardId: Id<"boards">;
}

const BoardTitle: React.FC<BoardTitleProps> = ({ boardId }) => {
  const boardData = useQuery(api.boards.getBoardTitle, { boardId }); // Real-time subscription to the board title
  const updateBoardTitle = useMutation(api.boards.updateBoardTitle); // Mutation for updating the title
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");

  // Handle change in input
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  // Handle saving the title
  const saveTitle = async () => {
    try {
      // Use the Convex mutation to update the board title
      await updateBoardTitle({ boardId, title });
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      console.error("Failed to update title:", error);
    }
  };

  if (!boardData) {
    return <p>Loading...</p>; // Handle loading state
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
          className="text-xl cursor-pointer text-white"
          onClick={() => {
            setIsEditing(true);
            setTitle(boardData.title); // Set current title in the input field
          }}
        >
          {boardData.title} {/* Display the real-time title */}
        </h1>
      )}
    </div>
  );
};

export default BoardTitle;
