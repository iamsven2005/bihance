import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { attendance, payroll } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";
interface Props{
params:{
  eventId: string
}
}
const Attend = async ({
  params
}:Props) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }

  const attendances: attendance[] = await db.attendance.findMany({
    where: {
      eventId:params.eventId
    },
  });

  const payrolls: payroll[] = await db.payroll.findMany({
    where: {
      userId: userId,
    },
  });

  interface GroupedAttendances {
    [key: string]: attendance[];
  }

  const groupedAttendances: GroupedAttendances = attendances.reduce(
    (acc: GroupedAttendances, item: attendance) => {
      const date = new Date(item.time).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(item);
      return acc;
    },
    {}
  );

  const calculateTimeDifference = (checkIn: Date, checkOut: Date): string => {
    const differenceInMilliseconds = checkOut.getTime() - checkIn.getTime();
    const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);
    return differenceInHours.toFixed(2);
  };

  const getPayrollValue = (date: Date, payrolls: payroll[]): number => {
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const payroll = payrolls.find(p => p.userId === userId);
    return isWeekend ? payroll?.weekend ?? 0 : payroll?.weekday ?? 0;
  };

  return (
    <div className="container">
      <div className="flex flex-wrap container p-5 bg-base-200 gap-5">
        {Object.keys(groupedAttendances).map((date) => {
          const items = groupedAttendances[date];
          items.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

          // Create pairs of check-in and check-out
          const pairs = [];
          for (let i = 0; i < items.length; i += 2) {
            const checkIn = new Date(items[i].time);
            const checkOut = items[i + 1] ? new Date(items[i + 1].time) : null;
            pairs.push({ checkIn, checkOut });
          }

          return pairs.map((pair, index) => {
            const payrollValue = getPayrollValue(pair.checkIn, payrolls);
            return (
              <div key={`${date}-${index}`} className="flex flex-col shadow-lg p-5 bg-base-300">
                <p>Date: {pair.checkIn.toLocaleDateString()}</p>
                <p>Event ID: {items[0].eventId}</p>
                <p>Check-in Time: {pair.checkIn.toLocaleTimeString()}</p>
                {pair.checkOut && (
                  <>
                    <p>Check-out Time: {pair.checkOut.toLocaleTimeString()}</p>
                    <p>Time Difference: {calculateTimeDifference(pair.checkIn, pair.checkOut)} hours</p>
                    <p>Payroll: {payrollValue} (per hour)</p>
                  </>
                )}
              </div>
            );
          });
        })}
      </div>
    </div>
  );
};

export default Attend;
