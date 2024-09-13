"use server";
import { db } from "@/lib/db";

interface GetUserProps {
    id?: string; // Make `id` optional for safety
}

const GetUser = async ({ id }: GetUserProps) => {
    // Handle undefined `id`
    if (!id) {
        return <p className="font-bold text-xl">User ID not provided</p>;
    }

    // Fetch user based on `id`
    const user = await db.user.findFirst({
        where: {
            clerkId: id,
        },
    });

    // Handle case where the user is not found
    if (!user) {
        return <p className="font-bold text-xl">User not found</p>;
    }

    return (
        <p className="font-bold text-xl">
            {user.first_name} {user.last_name}
        </p>
    );
};

export default GetUser;
