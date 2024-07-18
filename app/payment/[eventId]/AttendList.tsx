"use client";

import { useState } from "react";
import { attendance, payroll } from "@prisma/client";
import LocationMap from "./LocationMap"; // Import the LocationMap component
import ExportButton from "./ExportButton"; // Import the ExportButton component
import { AttendanceRow } from "./exportToCsv"; // Import AttendanceRow type
import { formatTime } from "./formatTime"; // Import the time formatting function
import Link from "next/link";

interface AttendListProps {
  attendances: attendance[];
  payrolls: payroll[];
  userId: string;
}

interface GroupedAttendances {
  [key: string]: attendance[];
}

const AttendList: React.FC<AttendListProps> = ({ attendances, payrolls, userId }) => {
  const [searchDate, setSearchDate] = useState("");

  const groupedAttendances: GroupedAttendances = attendances.reduce(
    (acc: GroupedAttendances, item: attendance) => {
      const date = new Date(item.time).toISOString().split('T')[0]; // Format date as YYYY-MM-DD
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
        Date: checkIn.toISOString().split('T')[0],
        "Check-in Time": formatTime(checkIn), // Use the formatTime function
        "Check-out Time": checkOut ? formatTime(checkOut) : "",
        "Time Difference (hours)": timeDifference,
        "Pay (per hour)": payrollValue,
        "Due Payment": duePayment,
        Location: items[i].location,
      });
    }
  });

  const filteredAttendances = Object.keys(groupedAttendances).filter((date) =>
    date.includes(searchDate)
  );

  return (
    <div className="container">
      <div className="flex flex-col p-5 bg-base-200 gap-5 rounded-xl">
        <div className="flex flex-wrap justify-between">
          <h1 className="font-bold text-xl">Attendance</h1>
          <br />
          <Link href="/event" className="btn btn-outline">Events</Link>
          
          <ExportButton data={rows} filename="attendance.csv"/>
        </div>
        <input
          type="date"
          className="input input-bordered"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />
        <div className="flex flex-wrap gap-5">
          {filteredAttendances.map((date) => {
            const items = groupedAttendances[date];
            items.sort(
              (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
            );

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
                  <p>Date: {pair.checkIn.toISOString().split('T')[0]}</p>
                  <p>Check-in Time: {formatTime(pair.checkIn)}</p>
                  {pair.checkOut && (
                    <>
                      <p>
                        Check-out Time: {formatTime(pair.checkOut)}
                      </p>
                      <p>
                        Time Difference: {timeDifference} hours
                      </p>
                      <p>Shift: {payrollValue} (per hour)</p>
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

export default AttendList;
