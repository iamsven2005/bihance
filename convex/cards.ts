import { v } from "convex/values";
import { mutation, query } from "./_generated/server";


export const createCard = mutation({
  args: {
    listId: v.id('lists'),
    title: v.string(),
    description: v.optional(v.string()),
    order: v.bigint(),
  },
  handler: async ({ db }, { listId, title, description, order }) => {
    // Create a new card with the provided data
    const newCard = await db.insert('cards', {
      listId,
      title,
      description,
      order,
    });
    return newCard;
  },
});

export const updateCard = mutation({
  args: { cardId: v.id("cards"), title: v.optional(v.string()), description: v.optional(v.string()) },
  handler: async ({ db }, { cardId, title, description }) => {
    return await db.patch(cardId, { title, description });
  },
});

// Delete card
export const deleteCard = mutation({
  args: { cardId: v.id("cards") },
  handler: async ({ db }, { cardId }) => {
    return await db.delete(cardId);
  },
});

export const reorderCards = mutation({
  args: {
    boardId: v.id("boards"),
    sourceListId: v.id("lists"),
    destinationListId: v.id("lists"),
    sourceCardOrder: v.array(v.id("cards")),
    destinationCardOrder: v.array(v.id("cards")),
  },
  handler: async ({ db }, { boardId, sourceListId, destinationListId, sourceCardOrder, destinationCardOrder }) => {
    const board = await db.get(boardId);
    if (!board) throw new Error("Board not found");

    // Update the card order in the source list
    for (let index = 0; index < sourceCardOrder.length; index++) {
      const cardId = sourceCardOrder[index];
      await db.patch(cardId, { order: BigInt(index) });
    }

    // Update the card order in the destination list
    for (let index = 0; index < destinationCardOrder.length; index++) {
      const cardId = destinationCardOrder[index];
      await db.patch(cardId, { order: BigInt(index) });
    }

    return { success: true };
  },
});
export const updateCardDescription = mutation({
  args: { cardId: v.id("cards"), description: v.string() },
  handler: async ({ db }, { cardId, description }) => {
    const card = await db.patch(cardId, { description });

    // You can add an audit log here if needed
    return card;
  },
});
export const updateCardTitle = mutation({
  args: { cardId: v.id("cards"), title: v.string() },
  handler: async ({ db }, { cardId, title }) => {
    const card = await db.patch(cardId, { title });

    // You can add an audit log here if needed
    return card;
  },
});