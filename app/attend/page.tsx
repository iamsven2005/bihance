import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { attendance } from "@prisma/client";
import dynamic from "next/dynamic";
import AttendList from "./AttendList";
import { notFound } from "next/navigation";


const Attend = async () => {
  const { userId } = auth();
  if (!userId) {
    return notFound()
  }

  const attendances: attendance[] = await db.attendance.findMany({
    where: {
      userId: userId,
    },
  });

  return <AttendList attendances={attendances} />;
};

export default Attend;
