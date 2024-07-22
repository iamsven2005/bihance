"use client";

import { useState } from "react";
import { event } from "@prisma/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

type EventListProps = {
  events: event[];
};

const EventList: React.FC<EventListProps> = ({ events }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCopyLink = (eventId: string) => {
    const uploadLink = `${window.location.origin}/event/${eventId}`;
    navigator.clipboard.writeText(uploadLink).then(() => {
      toast.success("Copied Link!");
    }).catch(err => {
      toast.error('Failed to copy: ', err);
    });
  };

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col p-5 text-base-content bg-base-100">
      <div className="flex flex-row items-center justify-between mb-4">
        <h1 className="font-bold text-2xl">All events:</h1>
        <Link href="/edit-event" className="btn">
          Create event
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="Search for an event..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="flex flex-wrap">
        {filteredEvents.map((item: event) => (
          <Card key={item.eventid} className="w-56">
            <CardHeader>
              <DropdownMenu>
                <DropdownMenuTrigger>    <Ellipsis />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <Link href={`/edit-event/${item.eventid}`} className="w-full"> <DropdownMenuItem>
                    Edit
                    </DropdownMenuItem>
                    </Link>
                  <DropdownMenuItem>
                    <Link href={`/view/${item.eventid}`}className="w-full">Employees
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href={`/payment/${item.eventid}`} className="w-full">Shifts
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Button onClick={() => handleCopyLink(item.eventid)}>
                      Copy Invite
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <img src={item.image}/>
              <CardTitle>{item.name}</CardTitle>
              <CardDescription>
                {item.location}
              </CardDescription>
            </CardContent>
            <CardFooter>
            <div dangerouslySetInnerHTML={{ __html: item.description }}></div>
            </CardFooter>

          </Card>
        ))}
      </div>
    </div>
  );
};

export default EventList;
