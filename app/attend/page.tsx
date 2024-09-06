import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { attendance } from "@prisma/client";
import AttendList from "./AttendList";
import { notFound } from "next/navigation";

const Attend = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const { userId } = auth();
      if (!userId) {
        return resolve(notFound());
      }

      const attendances: attendance[] = await db.attendance.findMany({
        where: {
          userId: userId,
        },
      });

      return resolve(<AttendList attendances={attendances} />);
    } catch (error) {
      reject(error); 
    }
  });
};

export default Attend;
