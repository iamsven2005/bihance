import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    messages: defineTable({
      author: v.string(),
      body: v.string(),
      orgId: v.string()
    }).index("by_orgId", ["orgId"]),  // Add index on orgId
  });
  