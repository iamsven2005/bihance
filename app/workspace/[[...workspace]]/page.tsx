import { auth, clerkClient } from "@clerk/nextjs/server";
import File from "./file";
import { notFound } from "next/navigation";
import { Card, CardTitle } from "@/components/ui/card";
import { OrganizationList } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { ChatComponent } from "./ChatComponent";
import { EventsSection } from "./EventsSection";
import { BoardsSection } from "./BoardsSection";

const Page = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const { orgId, userId } = auth();

      if (!orgId || !userId) {
        return resolve(
          <Card className="mx-auto justify-center flex flex-col gap-5 items-center m-5 p-5">
            <CardTitle>Create an organization to start.</CardTitle>
            <OrganizationList hidePersonal />
          </Card>
        );
      }

      const response = await clerkClient.organizations.getOrganization({
        organizationId: orgId,
      });

      const user = await db.user.findFirst({
        where: {
          clerkId: userId,
        },
      });

      if (!user) {
        return reject(notFound());
      }

      const events = await db.event.findMany({
        where: {
          orgId: orgId,
        },
      });

      const files = await db.sharedfiles.findMany({
        where: {
          orgId,
        },
      });
      const username = `${user.first_name} ${user.last_name}`;
      return resolve(
        <div>
                <ChatComponent orgId={orgId} orgname={response.slug || "Group Chat"} username={username} />
                <BoardsSection orgId={orgId} />
<File
          orgId={orgId}
          files={files}
          user={user}
        />
              <EventsSection orgId={orgId} events={events} />
        </div>
        
      );
    } catch (error) {
      reject(error);
    }
  });
};

export default Page;
