import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useState } from "react";

interface BoardTitleProps {
    initialTitle: string;
    boardId: Id<"boards">; 
  }
  
  const BoardTitle: React.FC<BoardTitleProps> = ({ initialTitle, boardId }) => {
    const [title, setTitle] = useState(initialTitle || "");
    const [isEditing, setIsEditing] = useState(false);
    const updateBoardTitle = useMutation(api.boards.updateBoardTitle);
  
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(e.target.value);
    };
  
    const saveTitle = async () => {
      try {
        await updateBoardTitle({ boardId, title });
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
            className="text-xl cursor-pointer text-white"
            onClick={() => setIsEditing(true)}
          >
            {title}
          </h1>
        )}
      </div>
    );
  };
export default BoardTitle