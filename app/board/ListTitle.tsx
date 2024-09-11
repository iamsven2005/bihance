import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useState } from "react";
import CardForm from "./CardForm";
interface Card {
    _id: Id<"cards">;
    title: string;
    order: bigint;
    description?: string;
    listId: Id<"lists">;
  }
interface ListTitleProps {
  initialTitle: string | null | undefined;
  boardId: Id<"boards">;  
  id: Id<"lists">;  
  onDelete?: (listId: Id<"lists">) => void;
  card: Card[]; // Use the Convex-generated Card type
}

const ListTitle: React.FC<ListTitleProps> = ({ initialTitle, boardId, id, onDelete, card }) => {
  const [title, setTitle] = useState(initialTitle || "");
  const [isEditing, setIsEditing] = useState(false);
  const [cards, setCards] = useState(card);

  const updateListTitle = useMutation(api.lists.updateListTitle);
  const deleteListMutation = useMutation(api.lists.deleteList);
  const copyListMutation = useMutation(api.lists.copyList);
  const deleteCardMutation = useMutation(api.cards.deleteCard);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const saveTitle = async () => {
    try {
      await updateListTitle({ listId: id, title });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update title:", error);
    }
  };

  const deleteList = async () => {
    try {
      await deleteListMutation({ listId: id });
      if (onDelete) onDelete(id);
    } catch (error) {
      console.error("Failed to delete list:", error);
    }
  };

  const deleteCard = async (cardId: Id<"cards">) => {
    try {
      await deleteCardMutation({ cardId });
      setCards(cards.filter((card) => card._id !== cardId));
    } catch (error) {
      console.error("Failed to delete card:", error);
    }
  };

  const copyList = async () => {
    try {
      await copyListMutation({ listId: id });
      if (onDelete) onDelete(id);
    } catch (error) {
      console.error("Failed to copy list:", error);
    }
  };

  return (
    <li className="shrink-0 h-full w-[272px] select-none">
      {isEditing ? (
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          onBlur={saveTitle}
          onKeyDown={(e) => {
            if (e.key === "Enter") saveTitle();
          }}
          className="flex w-full p-3 rounded-md space-y-4 shadow-md bg-white dark:bg-black"
          autoFocus
        />
      ) : (
        <div className="flex flex-col">
          <h1
            className="flex w-full p-3 rounded-md space-y-4 shadow-md bg-white dark:bg-black"
            onClick={() => setIsEditing(true)}
          >
            {title}
          </h1>
          <Button onClick={copyList}>Copy List</Button>
          <Button onClick={deleteList}>Delete List</Button>

          <CardForm id={id} />

          <div>
            {cards.map((cardItem) => (
              <div key={cardItem._id}>
                <h2>{cardItem.title}</h2>
                <h3>{cardItem.description}</h3>
                <button onClick={() => deleteCard(cardItem._id)}>Delete Card</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </li>
  );
};

export default ListTitle;
