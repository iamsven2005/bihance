"use server"
import { db } from "@/lib/db";

interface GetUserProps {
    id: string;
}

const GetUser = async ({ id }: GetUserProps) => {
    const user = await db.user.findFirst({
        where: {
            clerkId: id
        }
    })
    return ( 
        <p>{user?.first_name}&nbsp;{user?.last_name}</p>
    );
}
 
export default GetUser;