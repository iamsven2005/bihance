import { auth, clerkClient } from "@clerk/nextjs/server";
import File from "./file";
import { notFound } from "next/navigation";
import { Card, CardTitle } from "@/components/ui/card";
import { OrganizationList, useOrganization, useUser } from "@clerk/nextjs";
import { db } from "@/lib/db";

const Page = async() => {
    const {orgId, userId} =auth()
    const events = await db.event.findMany({
        where: {
          orgId: orgId
        }
      });
    if(!orgId || !userId){
        <Card className="mx-auto justify-center flex flex-col gap-5 items-center m-5 p-5">
        <CardTitle>
            Create an organization to start.
        </CardTitle>
    <OrganizationList
    hidePersonal/>

    </Card>
    }
    else{
      const response = await clerkClient.organizations.getOrganization({ organizationId: orgId })

      const user = await db.user.findFirst({
        where:{
          clerkId: userId
        }
      })
      if(!user){
        return notFound()
      }
      const files = await db.sharedfiles.findMany({
            where:{
                orgId
            }
          });
        return ( 
            <File orgId={orgId} events={events} files={files}
            user={user}
            orgname={response.slug || "Group Chat"} />
         );
    }

}
 
export default Page;