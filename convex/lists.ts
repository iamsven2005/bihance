import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Query to list lists by boardId
export const listLists = query({
  args: { boardId: v.id("boards") },
  handler: async (ctx, { boardId }) => {
    return await ctx.db.query("lists")
      .withIndex("by_boardId", (q) => q.eq("boardId", boardId))
      .take(100);
  },
});

// Mutation to update a list's title
export const updateList = mutation({
  args: { id: v.id("lists"), title: v.string() },
  handler: async (ctx, { id, title }) => {
    await ctx.db.patch(id, { title });
  },
});

// Mutation to delete a list
export const deleteList = mutation({
  args: { id: v.id("lists") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

// Mutation to log list actions (for audit purposes)
export const auditListAction = mutation({
  args: { id: v.id("lists"), orgId: v.string(), title: v.string(), action: v.union(v.literal("CREATE"), v.literal("UPDATE"), v.literal("DELETE")), userId: v.string() },
  handler: async (ctx, { id, orgId, title, action, userId }) => {
    await ctx.db.insert("audit", {
      orgId,
      action,
      type: "list",
      entity: id,
      title,
      userId,
      created: BigInt(Date.now()),
    });
  },
});

// Mutation to reorder lists
export const reorderLists = mutation({
  args: { boardId: v.id("boards"), listOrder: v.array(v.id("lists")) },
  handler: async (ctx, { boardId, listOrder }) => {
    for (const [index, listId] of listOrder.entries()) {
      await ctx.db.patch(listId, { order: BigInt(index) });
    }
  },
});

// Mutation to create a list and log its creation
export const createList = mutation({
  args: { boardId: v.id("boards"), title: v.string(), order: v.int64(), userId: v.string(), orgId: v.string() },
  handler: async (ctx, { boardId, title, order, userId, orgId }) => {
    const newListId = await ctx.db.insert("lists", {
      boardId,
      title,
      order: BigInt(order),
    });

    await ctx.db.insert("audit", {
      orgId,
      action: "CREATE",
      type: "list",
      entity: newListId,
      title,
      userId,
      created: BigInt(Date.now()),
    });

    return newListId;
  },
});
