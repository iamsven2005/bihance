import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { attendance } from "@prisma/client";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import Redirect from "@/components/redirect";

const AttendList = dynamic(() => import("./AttendList"), { ssr: false });

const Attend = async () => {
  const { userId } = auth();
  if (!userId) {
    return <Redirect/>
  }

  const attendances: attendance[] = await db.attendance.findMany({
    where: {
      userId: userId,
    },
  });

  return <AttendList attendances={attendances} />;
};

export default Attend;
