import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { attendance, payroll, typepay } from "@prisma/client"; // Ensure typepay is imported
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";

interface Props {
  params: {
    eventId: string;
  };
}

// Dynamically import the AttendList component with no SSR
const AttendList = dynamic(() => import("./AttendList"), { ssr: false });

const AttendPage = ({ params }: Props) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { userId } = auth();
      if (!userId) {
        return resolve(redirect("/")); // Early resolve to handle redirect
      }

      const attendances: attendance[] = await db.attendance.findMany({
        where: {
          eventId: params.eventId,
        },
      });

      const payrolls: (payroll & { typepay: typepay[] })[] = await db.payroll.findMany({
        where: {
          eventid: params.eventId,
        },
        include: {
          typepay: true,
        },
      });

      return resolve(
        <AttendList attendances={attendances} payrolls={payrolls} userId={userId} />
      );
    } catch (error) {
      return reject(error); // Handle errors by rejecting the promise
    }
  });
};

export default AttendPage;
