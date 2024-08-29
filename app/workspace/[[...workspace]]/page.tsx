import { auth } from "@clerk/nextjs/server";
import File from "./file";
import { notFound } from "next/navigation";
import { Card, CardTitle } from "@/components/ui/card";
import { OrganizationList } from "@clerk/nextjs";
import { db } from "@/lib/db";

const Page = async() => {
    const {orgId} =auth()
    const events = await db.event.findMany({
        where: {
          orgId: orgId
        }
      });
    if(!orgId){
        <Card className="mx-auto justify-center flex flex-col gap-5 items-center m-5 p-5">
        <CardTitle>
            Create an organization to start.
        </CardTitle>
    <OrganizationList
    hidePersonal/>

    </Card>
    }
    else{
        const files = await db.sharedfiles.findMany({
            where:{
                orgId
            }
          });

        return ( 
            <File orgId={orgId} events={events} files={files} />
         );
    }

}
 
export default Page;