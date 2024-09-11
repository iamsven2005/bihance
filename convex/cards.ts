import { v } from "convex/values";
import { mutation } from "./_generated/server";

// Mutation to update a card's title and description
export const updateCard = mutation({
  args: { id: v.id("cards"), title: v.string(), description: v.optional(v.string()) },
  handler: async (ctx, { id, title, description }) => {
    await ctx.db.patch(id, { title, description });
  },
});

// Mutation to delete a card
export const deleteCard = mutation({
  args: { id: v.id("cards") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

// Mutation to log card actions
export const auditCardAction = mutation({
  args: { id: v.id("cards"), orgId: v.string(), title: v.string(), action: v.union(v.literal("CREATE"), v.literal("UPDATE"), v.literal("DELETE")), userId: v.string() },
  handler: async (ctx, { id, orgId, title, action, userId }) => {
    await ctx.db.insert("audit", {
      orgId,
      action,
      type: "card",
      entity: id,
      title,
      userId,
      created: BigInt(Date.now()),
    });
  },
});

// Mutation to reorder cards within or between lists
export const reorderCards = mutation({
  args: {
    sourceListId: v.id("lists"),
    destinationListId: v.id("lists"),
    sourceCardOrder: v.array(v.id("cards")),
    destinationCardOrder: v.array(v.id("cards")),
  },
  handler: async (ctx, { sourceListId, destinationListId, sourceCardOrder, destinationCardOrder }) => {
    if (sourceListId === destinationListId) {
      for (const [index, cardId] of sourceCardOrder.entries()) {
        await ctx.db.patch(cardId, { order: BigInt(index) });
      }
    } else {
      for (const [index, cardId] of sourceCardOrder.entries()) {
        await ctx.db.patch(cardId, { order: BigInt(index) });
      }
      for (const [index, cardId] of destinationCardOrder.entries()) {
        await ctx.db.patch(cardId, { order: BigInt(index), listId: destinationListId });
      }
    }
  },
});

// Mutation to create a card in a list
export const createCard = mutation({
  args: { listId: v.id("lists"), title: v.string(), description: v.optional(v.string()) },
  handler: async (ctx, { listId, title, description }) => {
    const lastCard = await ctx.db.query("cards")
      .withIndex("by_listId", (q) => q.eq("listId", listId))
      .order("desc")
      .take(1);

    const order = lastCard.length > 0 ? lastCard[0].order + BigInt(1) : BigInt(1);

    await ctx.db.insert("cards", { title, description, listId, order });
  },
});
