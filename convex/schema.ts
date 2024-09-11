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

    audit: defineTable({
      orgId: v.string(),
      action: v.union(v.literal("CREATE"), v.literal("UPDATE"), v.literal("DELETE")),
      entity: v.string(),
      type: v.union(v.literal("board"), v.literal("list"), v.literal("card")),
      userId: v.string(),
      title: v.string(),
      created: v.int64(),
    }).index("by_orgId", ["orgId"]),
  });
