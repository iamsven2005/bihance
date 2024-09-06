import { auth, clerkClient } from "@clerk/nextjs/server";
import File from "./file";
import { notFound } from "next/navigation";
import { Card, CardTitle } from "@/components/ui/card";
import { OrganizationList } from "@clerk/nextjs";
import { db } from "@/lib/db";

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

      return resolve(
        <File
          orgId={orgId}
          events={events}
          files={files}
          user={user}
          orgname={response.slug || "Group Chat"}
        />
      );
    } catch (error) {
      reject(error);
    }
  });
};

export default Page;
