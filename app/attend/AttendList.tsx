"use client";

import { useState } from "react";
import { attendance } from "@prisma/client";

interface AttendListProps {
  attendances: attendance[];
}

interface GroupedAttendances {
  [key: string]: attendance[];
}

const AttendList: React.FC<AttendListProps> = ({ attendances }) => {
  const [searchDate, setSearchDate] = useState("");

  const groupedAttendances: GroupedAttendances = attendances.reduce(
    (acc: GroupedAttendances, item: attendance) => {
      const date = new Date(item.time).toISOString().split("T")[0];
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

  const filteredAttendances = Object.keys(groupedAttendances).filter((date) =>
    date.includes(searchDate)
  );

  return (
    <div className="container">
      <input
        type="date"
        value={searchDate}
        onChange={(e) => setSearchDate(e.target.value)}
        className="mb-4 p-2 border rounded"
      />
      <div className="flex flex-wrap container p-5 bg-base-200 gap-5">
        {filteredAttendances.map((date) => {
          const items = groupedAttendances[date];
          items.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

          // Create pairs of check-in and check-out
          const pairs = [];
          for (let i = 0; i < items.length; i += 2) {
            const checkIn = new Date(items[i].time);
            const checkOut = items[i + 1] ? new Date(items[i + 1].time) : null;
            pairs.push({ checkIn, checkOut });
          }

          return pairs.map((pair, index) => (
            <div key={`${date}-${index}`} className="flex flex-col shadow-lg p-5 bg-base-300">
              <p>Date: {pair.checkIn.toLocaleDateString()}</p>
              <p>Event ID: {items[0].eventId}</p>
              <p>Check-in Time: {pair.checkIn.toLocaleTimeString()}</p>
              {pair.checkOut && (
                <>
                  <p>Check-out Time: {pair.checkOut.toLocaleTimeString()}</p>
                  <p>Time Difference: {calculateTimeDifference(pair.checkIn, pair.checkOut)} hours</p>
                </>
              )}
            </div>
          ));
        })}
      </div>
    </div>
  );
};

export default AttendList;
