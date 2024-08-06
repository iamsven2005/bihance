import React from "react";  // Import React to use JSX
import { Audit } from "@prisma/client";
import { Avatar, AvatarImage } from "../../components/ui/avatar";
import { gen_log_msg } from "../../lib/gen-log";
import { format } from "date-fns";  // Use date-fns for formatting dates
import { db } from "@/lib/db";
interface Props{
  id: string
}
const ActivityAudit = async ({id}: Props) => {
  const items: Audit[] = await db.audit.findMany({
    where:{
      orgId: id
    }
  });

  return (
    <div className="flex items-start gap-x-3 w-full">
      <div className="w-full">
        <p className="font-semibold text-neutral-700 mb-2">Activity</p>
        <div className="mt-2 space-y-4">
          {items.map((item) => (
            // Add a key prop to each item for React's reconciliation
            <div className="flex items-center gap-x-2" key={item.id}>
              <Avatar>
                <AvatarImage src={item.userImage || "/default-avatar.png"} alt="User Avatar" />
              </Avatar>
              <div className="flex flex-col space-y-0.5">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold lowercase text-neutral-700">
                    {item.username}
                  </span>{" "}
                  {gen_log_msg(item)}
                  <p className="text-xs text-neutral-500">
                    {format(new Date(item.created), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityAudit;
