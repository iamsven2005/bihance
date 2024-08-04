"use client";

import { useState } from "react";
import { attendance, payroll, typepay } from "@prisma/client"; // Ensure typepay is imported
import LocationMap from "./LocationMap"; // Import the LocationMap component
import ExportButton from "./ExportButton"; // Import the ExportButton component
import { AttendanceRow } from "./exportToCsv"; // Import AttendanceRow type
import { formatTime } from "./formatTime"; // Import the time formatting function
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AttendListProps {
  attendances: attendance[];
  payrolls: (payroll & { typepay: typepay[] })[];
  userId: string;
}

interface GroupedAttendances {
  [key: string]: attendance[];
}

const AttendList = ({ attendances, payrolls, userId }: AttendListProps) => {
  const [searchDate, setSearchDate] = useState("");

  // Group attendances by date
  const groupedAttendances: GroupedAttendances = attendances.reduce(
    (acc: GroupedAttendances, item: attendance) => {
      const date = new Date(item.time).toISOString().split("T")[0]; // Format date as YYYY-MM-DD
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(item);
      return acc;
    },
    {}
  );

  // Calculate time difference between check-in and check-out
  const calculateTimeDifference = (checkIn: Date, checkOut: Date): { hours: number; minutes: number } => {
    const differenceInMilliseconds = checkOut.getTime() - checkIn.getTime();
    const differenceInMinutes = Math.floor(differenceInMilliseconds / (1000 * 60));
    const hours = Math.floor(differenceInMinutes / 60);
    const minutes = differenceInMinutes % 60;
    return { hours, minutes };
  };

  // Find payroll entry for the event
  const getPayroll = (userId: string): (payroll & { typepay: typepay[] }) | undefined => {
    return payrolls.find((p) => p.userId === userId);
  };
  

  // Get pay rate based on typepay entry
  const getPayRate = (payroll: payroll & { typepay: typepay[] } | undefined, time: Date): number => {
    if (!payroll || !payroll.typepay) {
      return 0;
    }

    // Determine shift type (e.g., morning, evening) or any other logic needed
    const shiftType = determineShiftType(time);

    // Find the relevant pay rate from typepay entries
    const typePayEntry = payroll.typepay.find((tp) => tp.shift === shiftType);
    return typePayEntry ? typePayEntry.pay : 0;
  };

  // Dummy function to determine shift type based on time
  const determineShiftType = (time: Date): string => {
    const hour = time.getHours();
    if (hour < 12) return "morning";
    if (hour < 18) return "afternoon";
    return "evening";
  };

  const rows: AttendanceRow[] = [];

  // Populate rows for export
  Object.keys(groupedAttendances).forEach((date) => {
    const items = groupedAttendances[date];
    items.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

    for (let i = 0; i < items.length; i += 2) {
      const checkIn = new Date(items[i].time);
      const checkOut = items[i + 1] ? new Date(items[i + 1].time) : null;
      const payroll = getPayroll(items[i].userId); // Use the correct function to retrieve payroll
      const payRate = getPayRate(payroll, checkIn);
      const { hours, minutes } = checkOut ? calculateTimeDifference(checkIn, checkOut) : { hours: 0, minutes: 0 };

      rows.push({
        Date: checkIn.toISOString().split("T")[0],
        "Check-in Time": formatTime(checkIn),
        "Check-out Time": checkOut ? formatTime(checkOut) : "",
        "Hour Difference": hours,
        "Minute Difference": minutes,
        Location: items[i].location,
      });
    }
  });

  const filteredAttendances = Object.keys(groupedAttendances).filter((date) =>
    date.includes(searchDate)
  );

  return (
    <div className="container">
      <div className="flex flex-col p-5 gap-5 rounded-xl">
        <div className="flex flex-wrap justify-between">
          <h1 className="font-bold text-xl">Attendance</h1>
          <div className="flex flex-wrap gap-5">
            <Button asChild>
              <Link href="/event">Events</Link>
            </Button>
            <ExportButton data={rows} filename="attendance.csv" />
          </div>
        </div>
        <Input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />
        <div className="flex flex-wrap gap-5">
          {filteredAttendances.map((date) => {
            const items = groupedAttendances[date];
            items.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
            const pairs = [];
            for (let i = 0; i < items.length; i += 2) {
              const checkIn = new Date(items[i].time);
              const checkOut = items[i + 1] ? new Date(items[i + 1].time) : null;
              pairs.push({ checkIn, checkOut });
            }

            return pairs.map((pair, index) => {
              const payroll = getPayroll(items[index].userId);
              const payRate = getPayRate(payroll, pair.checkIn);
              const { hours, minutes } = pair.checkOut ? calculateTimeDifference(pair.checkIn, pair.checkOut) : { hours: 0, minutes: 0 };
              const duePayment = payRate * hours + (payRate / 60) * minutes;

              return (
                <div
                  key={`${date}-${index}`}
                  className="flex flex-col shadow-lg p-5 rounded-xl"
                >
                  <LocationMap location={items[index].location} />
                  <p>Date: {pair.checkIn.toISOString().split("T")[index]}</p>
                  <p>Check-in Time: {formatTime(pair.checkIn)}</p>
                  {pair.checkOut && (
                    <>
                      <p>Check-out Time: {formatTime(pair.checkOut)}</p>
                      <p>Hour Difference: {hours} hours</p>
                      <p>Minute Difference: {minutes} minutes</p>
                      <p>Pay (per hour): {payRate}</p>
                      <p>Due Payment: {duePayment.toFixed(2)}</p>
                      <div>
                        {payroll?.rolltype}
                        {payroll?.typepay.map((list) => (
                          <div key={list.typeid}>
                            <p>Shift: {list.shift}</p>
                            <p>Day: {list.day}</p>
                            <p>Pay: {list.pay}</p>
                          </div>
                        ))}
                      </div>
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

export default AttendList;
