import { auth } from "@clerk/nextjs/server";
import File from "./file";
import { notFound } from "next/navigation";

const Page = () => {
    const {orgId} =auth()
    if(!orgId){
        notFound()
    }
    return ( 
        <File orgId={orgId}/>
     );
}
 
export default Page;