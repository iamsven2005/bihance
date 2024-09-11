import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const auditListAction = mutation({
    args: { 
      id: v.id("lists"), 
      orgId: v.string(), 
      title: v.string(), 
      action: v.union(v.literal("CREATE"), v.literal("UPDATE"), v.literal("DELETE")), 
      userId: v.string(), 
      username: v.string(), 
      userImage: v.string()  // Added missing fields
    },
    handler: async (ctx, { id, orgId, title, action, userId, username, userImage }) => {
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
  

  export const getAuditLogs = query({
    args: { orgId: v.string() },  // orgId is treated as a string
    handler: async ({ db }, { orgId }) => {
      return await db.query("audit")
        .withIndex("by_orgId", q => q.eq("orgId", orgId))
        .order("desc")  // Use order instead of orderBy
        .collect();
    },
  });