"use client";

import { useState } from "react";
import { attendance } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";

interface AttendListProps {
  attendances: attendance[];
}

interface GroupedAttendances {
  [key: string]: attendance[];
}

const AttendList: React.FC<AttendListProps> = ({ attendances }) => {
  const [searchDate, setSearchDate] = useState<Date | undefined>(undefined);

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
    searchDate ? date === format(searchDate, "yyyy-MM-dd") : true
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Attendance List</h1>
      <div className="mb-6">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !searchDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {searchDate ? format(searchDate, "PPP") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={searchDate}
              onSelect={setSearchDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAttendances.map((date) => {
          const items = groupedAttendances[date];
          items.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

          const pairs = [];
          for (let i = 0; i < items.length; i += 2) {
            const checkIn = new Date(items[i].time);
            const checkOut = items[i + 1] ? new Date(items[i + 1].time) : null;
            pairs.push({ checkIn, checkOut });
          }

          return pairs.map((pair, index) => (
            <Card key={`${date}-${index}`} className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">
                  {format(pair.checkIn, "MMMM d, yyyy")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">Event ID: {items[0].eventId}</p>
                <div className="flex items-center mb-2">
                  <Clock className="mr-2 h-4 w-4 text-green-500" />
                  <p>Check-in: {format(pair.checkIn, "h:mm a")}</p>
                </div>
                {pair.checkOut && (
                  <>
                    <div className="flex items-center mb-2">
                      <Clock className="mr-2 h-4 w-4 text-red-500" />
                      <p>Check-out: {format(pair.checkOut, "h:mm a")}</p>
                    </div>
                    <p className="font-semibold">
                      Total Time: {calculateTimeDifference(pair.checkIn, pair.checkOut)} hours
                    </p>
                  </>
                )}
                {!pair.checkOut && (
                  <p className="text-yellow-500">Check-out pending</p>
                )}
              </CardContent>
            </Card>
          ));
        })}
      </div>
      {filteredAttendances.length === 0 && (
        <p className="text-center text-muted-foreground mt-8">No attendance records found for the selected date.</p>
      )}
    </div>
  );
};

export default AttendList;