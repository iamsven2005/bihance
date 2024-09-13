"use client";
import React, { useState } from "react";
import { attendance, payroll, typepay } from "@prisma/client"; // Ensure typepay is imported
import LocationMap from "./LocationMap"; // Import the LocationMap component
import ExportButton from "./ExportButton"; // Import the ExportButton component
import { AttendanceRow } from "./exportToCsv"; // Import AttendanceRow type
import { formatTime } from "./formatTime"; // Import the time formatting function
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import GetUser from "@/components/GetUser";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog"; // Import Shadcn components

interface AttendListProps {
  attendances: attendance[];
  payrolls: (payroll & { typepay: typepay[] })[];
  userId: string;
}

interface GroupedAttendances {
  [key: string]: { [userId: string]: attendance[] };
}

const AttendList = ({ attendances, payrolls, userId }: AttendListProps) => {
  const [searchDate, setSearchDate] = useState("");
  console.log(attendances);

  // Group attendances by date and userId
  const groupedAttendances: GroupedAttendances = attendances.reduce(
    (acc: GroupedAttendances, item: attendance) => {
      const date = new Date(item.time).toISOString().split("T")[0]; // Format date as YYYY-MM-DD
      if (!acc[date]) {
        acc[date] = {};
      }
      if (!acc[date][item.userId]) {
        acc[date][item.userId] = [];
      }
      acc[date][item.userId].push(item);
      return acc;
    },
    {}
  );

  // Calculate time difference between check-in and check-out
  const calculateTimeDifference = (
    checkIn: Date,
    checkOut: Date
  ): { hours: number; minutes: number } => {
    const differenceInMilliseconds = checkOut.getTime() - checkIn.getTime();
    const differenceInMinutes = Math.floor(differenceInMilliseconds / (1000 * 60));
    const hours = Math.floor(differenceInMinutes / 60);
    const minutes = differenceInMinutes % 60;
    return { hours, minutes };
  };

  const getPayroll = (
    userId: string
  ): (payroll & { typepay: typepay[] }) | undefined => {
    return payrolls.find((p) => p.userId === userId);
  };

  // Get pay rate based on typepay entry
  const getPayRate = (
    payroll: payroll & { typepay: typepay[] } | undefined,
    time: Date
  ): number => {
    if (!payroll || !payroll.typepay) {
      return 0;
    }

    const shiftType = determineShiftType(time);

    const typePayEntry = payroll.typepay.find((tp) => tp.shift === shiftType);
    return typePayEntry ? typePayEntry.pay : 0;
  };

  const determineShiftType = (time: Date): string => {
    const hour = time.getHours();
    if (hour < 12) return "morning";
    if (hour < 18) return "afternoon";
    return "evening";
  };

  const rows: AttendanceRow[] = [];

  Object.keys(groupedAttendances).forEach((date) => {
    const users = groupedAttendances[date];
    Object.keys(users).forEach((userId) => {
      const items = users[userId];
      items.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

      for (let i = 0; i < items.length; i += 2) {
        const checkIn = new Date(items[i].time);
        const checkOut = items[i + 1] ? new Date(items[i + 1].time) : null;
        const payroll = getPayroll(items[i].userId);
        const payRate = getPayRate(payroll, checkIn);
        const { hours, minutes } = checkOut
          ? calculateTimeDifference(checkIn, checkOut)
          : { hours: 0, minutes: 0 };

        rows.push({
          Date: checkIn.toISOString().split("T")[0],
          "Check-in Time": formatTime(checkIn),
          "Check-out Time": checkOut ? formatTime(checkOut) : "",
          "Hour Difference": hours,
          "Minute Difference": minutes,
          Location: items[i].location,
          Name: userId,
        });
      }
    });
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
            const users = groupedAttendances[date];

            return Object.keys(users).map((userId) => {
              const items = users[userId];
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
                const payroll = getPayroll(userId);
                const payRate = getPayRate(payroll, pair.checkIn);
                const { hours, minutes } = pair.checkOut
                  ? calculateTimeDifference(pair.checkIn, pair.checkOut)
                  : { hours: 0, minutes: 0 };
                const duePayment = payRate * hours + (payRate / 60) * minutes;

                return (
                  <div
                    key={`${date}-${userId}-${index}`}
                    className="flex flex-col shadow-lg p-5 rounded-xl"
                  >
                    <GetUser id={userId} />

                    {items[0]?.location && items[0].location !== "Unknown location" && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline">Check-in Location</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <LocationMap location={items[0].location} />
                        </DialogContent>
                      </Dialog>
                    )}

{items[1]?.location && items[1].location !== "Unknown location" && (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline">Check-out Location</Button>
    </DialogTrigger>
    <DialogContent>
      <LocationMap location={items[1]?.location} />
    </DialogContent>
  </Dialog>
)}


                    {pair.checkIn && items[0]?.imageurl && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline">View Check-in Image</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <img
                            src={items[0].imageurl}
                            alt="Check-in"
                            className="w-96 h-auto rounded-lg"
                          />
                        </DialogContent>
                      </Dialog>
                    )}
                    {pair.checkOut && items[1]?.imageurl && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline">View Check-out Image</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <img
                            src={items[1].imageurl}
                            alt="Check-out"
                            className="w-96 h-auto rounded-lg"
                          />
                        </DialogContent>
                      </Dialog>
                    )}

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">View Details</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <p>Date: {pair.checkIn.toISOString().split("T")[index]}</p>
                        <p>Check-in Time: {formatTime(pair.checkIn)}</p>
                        {pair.checkOut && (
                          <>
                            <p>Check-out Time: {formatTime(pair.checkOut)}</p>
                            <p>Hour Difference: {hours} hours</p>
                            <p>Minute Difference: {minutes} minutes</p>

                            <div>
                              Rolltype: {payroll?.rolltype}
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
                      </DialogContent>
                    </Dialog>
                  </div>
                );
              });
            });
          })}
        </div>
      </div>
    </div>
  );
};

export default AttendList;
