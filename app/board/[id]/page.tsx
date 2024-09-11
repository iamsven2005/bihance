import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { toast } from "sonner";

interface Props {
  params: {
    id: string;
  };
}

const Page = async ({ params }: Props) => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    redirect("/");
  }

  try {
    await db.user.update({
      where: {
        clerkId: userId, 
      },
      data: {
        board: params.id, 
      },
    });
  } catch (error) {
    toast.error("unable to update board")
  }
  return redirect("/board")
};

export default Page;