import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    messages: defineTable({
      author: v.string(),
      body: v.string(),
      orgId: v.string()
    }).index("by_orgId", ["orgId"]),
    boards: defineTable({
      title: v.string(),
      orgId: v.string(),
      imageId: v.string(),
      imageThumbUrl: v.string(),
      imageFullUrl: v.string(),
      username: v.string(),
      link: v.string(),
      created: v.int64(),
      updated: v.int64(),
    }).index("by_orgId", ["orgId"]),
  
    lists: defineTable({
      title: v.string(),
      order: v.int64(),
      boardId: v.id("boards"),
    }).index("by_boardId", ["boardId"]),
  
    cards: defineTable({
      title: v.string(),
      order: v.int64(),
      description: v.optional(v.string()),
      listId: v.id("lists"),
    }).index("by_listId", ["listId"]),
  });
