import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    args: { orgId: v.string() },  // Add orgId as an argument
    handler: async (ctx, { orgId }) => {
      // Filter messages by orgId
      const messages = await ctx.db.query("messages")
        .withIndex("by_orgId", (q) => q.eq("orgId", orgId))
        .order("desc")
        .take(100);
      return messages.reverse();
    },
  });
  

export const send = mutation({
  args: { body: v.string(), author: v.string(), orgId: v.string() },
  handler: async (ctx, { body, author, orgId }) => {
    // Send a new message.
    await ctx.db.insert("messages", { body, author, orgId });
  },
});