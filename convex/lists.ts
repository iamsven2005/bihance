import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

  export const createList = mutation({
    args: { boardId: v.id('boards'), title: v.string() },
    handler: async ({ db }, { boardId, title }) => {
      // Find the last list by order
      const lastList = await db
        .query('lists')
        .withIndex('by_boardId', (q) => q.eq('boardId', boardId))
        .order('desc')
        .first();
  
      // Determine the new order
      const newOrder = lastList ? lastList.order + BigInt(1) : BigInt(1);  
      // Create the new list
      const newList = await db.insert('lists', {
        title,
        boardId,
        order: newOrder,
      });
  
      return newList;
    },
  });

  export const updateListTitle = mutation({
    args: { listId: v.id('lists'), title: v.string() },
    handler: async ({ db }, { listId, title }) => {
      const updatedList = await db.patch(listId, { title });
        return updatedList;
    },
  });

  
  export const deleteList = mutation({
    args: { listId: v.id("lists") },
    handler: async ({ db }, { listId }) => {
      return await db.delete(listId);
    },
  });
  
  export const copyList = mutation({
    args: { listId: v.id("lists") },
    handler: async ({ db }, { listId }) => {
      // Get the list by its Id
      const list = await db.get(listId);
      if (!list) throw new Error("List not found");
  
      // Get all cards associated with the list
      const cards = await db.query("cards").withIndex("by_listId", (q) => q.eq("listId", listId)).collect();
  
      // Get the order of the new list by incrementing the existing order
      const newOrder = list.order + BigInt(1);  // Fix for bigint addition
  
      // Insert a new list (copy)
      const copiedListId = await db.insert("lists", {
        title: `${list.title} - Copy`,
        boardId: list.boardId,
        order: newOrder,
      });
  
      // Insert all the cards associated with the copied list
      for (const card of cards) {
        await db.insert("cards", {
          title: card.title,
          description: card.description,
          listId: copiedListId,  // Use copiedListId directly
          order: card.order,
        });
      }
  
      return { listId: copiedListId };
    },
  });
  export const reorderLists = mutation({
    args: { boardId: v.id("boards"), listOrder: v.array(v.id("lists")) },
    handler: async ({ db }, { boardId, listOrder }) => {
      const board = await db.get(boardId);
      if (!board) throw new Error("Board not found");
  
      // Update the order of each list
      for (let index = 0; index < listOrder.length; index++) {
        const listId = listOrder[index];
        await db.patch(listId, { order: BigInt(index) }); // Using BigInt for consistency
      }
  
      return { success: true };
    },
  });

  
  export const getBoardLists = query({
    args: { boardId: v.id("boards") },
    handler: async ({ db }, { boardId }) => {
      const lists = await db.query("lists")
        .withIndex("by_boardId", q => q.eq("boardId", boardId))
        .order("asc")
        .collect();
  
      // Fetch cards for each list and map the full card details
      return await Promise.all(
        lists.map(async (list) => {
          const cards = await db.query("cards")
            .withIndex("by_listId", q => q.eq("listId", list._id))
            .order("asc")
            .collect();
  
          return {
            id: list._id, // Map _id to id
            title: list.title,
            order: list.order,
            card: cards.map(card => ({
              _id: card._id, // Use _id for the card
              title: card.title,
              order: card.order, // Include order
              description: card.description, // Include description (optional)
              listId: card.listId, // Include listId
            })),
          };
        })
      );
    },
  });
  

  export const getListDetails = query({
    args: { boardId: v.id("boards") },
    handler: async (ctx, { boardId }) => {
      const list = await ctx.db.query("lists")
      .withIndex("by_boardId", (q) => q.eq("boardId", boardId))
      .collect();
    return list;
    },
  });
  