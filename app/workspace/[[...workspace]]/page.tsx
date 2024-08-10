import { auth } from "@clerk/nextjs/server";
import File from "./file";
import { notFound } from "next/navigation";
import { Card, CardTitle } from "@/components/ui/card";
import { OrganizationList } from "@clerk/nextjs";

const Page = () => {
    const {orgId} =auth()
    if(!orgId){
        <Card className="mx-auto justify-center flex flex-col gap-5 items-center m-5 p-5">
        <CardTitle>
            Create an organization to start.
        </CardTitle>
    <OrganizationList
    hidePersonal/>

    </Card>
    }
    else
    return ( 
        <File orgId={orgId}/>
     );
}
 
export default Page;