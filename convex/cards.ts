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
      await db.patch(cardId, { order: BigInt(index), listId: sourceListId });
    }

    // Update the card order in the destination list
    for (let index = 0; index < destinationCardOrder.length; index++) {
      const cardId = destinationCardOrder[index];
      await db.patch(cardId, { order: BigInt(index), listId: destinationListId });
    }

    return { success: true };
  },
});

export const updateCardDescription = mutation({
  args: { cardId: v.id("cards"), description: v.string() },
  handler: async ({ db }, { cardId, description }) => {
    const card = await db.patch(cardId, { description });
    return card;
  },
});
export const updateCardTitle = mutation({
  args: { cardId: v.id("cards"), title: v.string() },
  handler: async ({ db }, { cardId, title }) => {
    const card = await db.patch(cardId, { title });
    return card;
  },
});
export const getCardsByList = query({
  args: { listId: v.id("lists") },
  handler: async (ctx, { listId }) => {
    const cards = await ctx.db.query("cards")
      .withIndex("by_listId", (q) => q.eq("listId", listId))
      .order("asc");
    return cards;
  },
});

export const getCardTitle = query({
  args: { cardId: v.id("cards") },
  handler: async (ctx, { cardId }) => {
    const card = await ctx.db.get(cardId);
    if (!card) throw new Error("Card not found");
    return { title: card.title };
  },
});

export const getCardDescription = query({
  args: { cardId: v.id("cards") },
  handler: async (ctx, { cardId }) => {
    const card = await ctx.db.get(cardId);
    if (!card) throw new Error("Card not found");
    return { description: card.description };
  },
});

export const getCardsForList = query({
  args: { listId: v.id("lists") },
  handler: async (ctx, { listId }) => {
    const cards = await ctx.db.query("cards")
      .withIndex("by_listId", (q) => q.eq("listId", listId))
      .collect();
    return cards;
  },
});
export const getCardDetails = query({
  args: { listId: v.id("lists") },
  handler: async (ctx, { listId }) => {
    const list = await ctx.db.query("cards")
    .withIndex("by_listId", (q) => q.eq("listId", listId))
    .collect();
  return list;
  },
});

