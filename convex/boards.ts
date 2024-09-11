import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listBoards = query({
  args: { orgId: v.string() },
  handler: async (ctx, { orgId }) => {
    const boards = await ctx.db.query("boards")
      .withIndex("by_orgId", (q) => q.eq("orgId", orgId))
      .take(100);
    return boards;
  },
});
  
  export const updateBoardTitle = mutation({
    args: { boardId: v.id("boards"), title: v.string() },
    handler: async (ctx, { boardId, title }) => {
      await ctx.db.patch(boardId, { title });
    },
  });

  export const createBoard = mutation({
    args: {
      title: v.string(),
      orgId: v.string(),
      imageId: v.string(),
      imageThumbUrl: v.string(),
      imageFullUrl: v.string(),
      username: v.string(),
      link: v.string(),
    },
    handler: async (ctx, { title, orgId, imageId, imageThumbUrl, imageFullUrl, username, link }) => {
      const newBoard = await ctx.db.insert("boards", {
        title,
        orgId,
        imageId,
        imageThumbUrl,
        imageFullUrl,
        username,
        link,
        created: BigInt(Date.now()),
        updated: BigInt(Date.now()),
      });
      return newBoard;
    },
  });
  export const deleteBoard = mutation({
    args: { boardId: v.id("boards") },
    handler: async (ctx, { boardId }) => {
      await ctx.db.delete(boardId);
    },
  });
  
  // Convex query to get a board by its ID
export const getBoardById = query({
  args: { boardId: v.id("boards") },
  handler: async (ctx, { boardId }) => {
    const board = await ctx.db.get(boardId);
    return board;
  },
});

export const getBoardDetails = query({
  args: { boardId: v.id('boards') },
  handler: async ({ db }, { boardId }) => {
    const board = await db.get(boardId);
    if (!board) throw new Error("Board not found");

    return board;
  },
});