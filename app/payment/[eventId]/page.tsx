import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { attendance, payroll } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";
import LocationMap from "./LocationMap"; // Import the LocationMap component
import ExportButton from "./ExportButton"; // Import the ExportButton component
import { AttendanceRow } from "./exportToCsv"; // Import AttendanceRow type
import { formatTime } from "./formatTime"; // Import the time formatting function

interface Props {
  params: {
    eventId: string;
  };
}

const Attend = async ({ params }: Props) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
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

  const calculateTimeDifference = (checkIn: Date, checkOut: Date): number => {
    const differenceInMilliseconds = checkOut.getTime() - checkIn.getTime();
    const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);
    return Math.round(differenceInHours); // Round to the nearest hour
  };

  const getPayrollValue = (date: Date, payrolls: payroll[]): number => {
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const payroll = payrolls.find((p) => p.userId === userId);
    return isWeekend ? payroll?.weekend ?? 0 : payroll?.weekday ?? 0;
  };

  const rows: AttendanceRow[] = [];

  Object.keys(groupedAttendances).forEach((date) => {
    const items = groupedAttendances[date];
    items.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

    for (let i = 0; i < items.length; i += 2) {
      const checkIn = new Date(items[i].time);
      const checkOut = items[i + 1] ? new Date(items[i + 1].time) : null;
      const payrollValue = getPayrollValue(checkIn, payrolls);
      const timeDifference = checkOut
        ? calculateTimeDifference(checkIn, checkOut)
        : 0;
      const duePayment = timeDifference * payrollValue;

      rows.push({
        Date: checkIn.toLocaleDateString(),
        "Check-in Time": formatTime(checkIn), // Use the formatTime function
        "Check-out Time": checkOut ? formatTime(checkOut) : "",
        "Time Difference (hours)": timeDifference,
        "Payroll (per hour)": payrollValue,
        "Due Payment": duePayment,
        Location: items[i].location
      });
    }
  });

  return (
    <div className="container">
      <div className="flex flex-col p-5 bg-base-200 gap-5 rounded-xl">
        <div className="flex flex-row justify-between">
        <h1 className="font-bold text-xl">Attendance</h1>
        <br />
        <ExportButton data={rows} filename="attendance.csv" />
        </div>


        <div className="flex flex-wrap gap-5">
          {Object.keys(groupedAttendances).map((date) => {
            const items = groupedAttendances[date];
            items.sort(
              (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
            );

            // Create pairs of check-in and check-out
            const pairs = [];
            for (let i = 0; i < items.length; i += 2) {
              const checkIn = new Date(items[i].time);
              const checkOut = items[i + 1] ? new Date(items[i + 1].time) : null;
              pairs.push({ checkIn, checkOut });
            }

            return pairs.map((pair, index) => {
              const payrollValue = getPayrollValue(pair.checkIn, payrolls);
              const timeDifference = pair.checkOut
                ? calculateTimeDifference(pair.checkIn, pair.checkOut)
                : 0;
              const duePayment = timeDifference * payrollValue;

              return (
                <div
                  key={`${date}-${index}`}
                  className="flex flex-col shadow-lg p-5 bg-base-300 rounded-xl"
                >
                  <LocationMap location={items[0].location} />
                  <p>Date: {pair.checkIn.toLocaleDateString()}</p>
                  <p>Check-in Time: {formatTime(pair.checkIn)}</p>
                  {pair.checkOut && (
                    <>
                      <p>
                        Check-out Time: {formatTime(pair.checkOut)}
                      </p>
                      <p>
                        Time Difference: {timeDifference} hours
                      </p>
                      <p>Payroll: {payrollValue} (per hour)</p>
                      <p>Due Payment: {duePayment}</p>
                    </>
                  )}
                </div>
              );
            });
          })}
        </div>
      </div>
    </div>
  );
};

export default Attend;
