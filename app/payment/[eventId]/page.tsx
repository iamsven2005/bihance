import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { attendance, payroll } from "@prisma/client";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";

interface Props {
  params: {
    eventId: string;
  };
}

// Dynamically import the AttendList component with no SSR
const AttendList = dynamic(() => import("./AttendList"), { ssr: false });

const AttendPage = async ({ params }: Props) => {
  const { userId } = auth();
  if (!userId) {
    redirect("/");
    return null;
  }

  const attendances: attendance[] = await db.attendance.findMany({
    where: {
      eventId: params.eventId,
    },
  });

  const payrolls: payroll[] = await db.payroll.findMany({
    where: {
      userId: userId,
    },
  });

  return <AttendList attendances={attendances} payrolls={payrolls} userId={userId} />;
};

export default AttendPage;
