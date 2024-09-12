import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import PageClient from "./pageClient";

const Page = async() => {
    const { userId, orgId } = auth();
    if (!userId || !orgId) {
      return notFound()
    }

    const user = await db.user.findFirst({
      where: { clerkId: userId },
      select: { board: true },
    });

    if (!user || !user.board) {
      return notFound()
    }
    return ( 
        <PageClient board={user.board} org={orgId}/>
     );
}
 
export default Page;