"use client";
import React, { useState } from "react";
import { attendance, event, files, user } from "@prisma/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, Link2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { OrganizationList } from "@clerk/nextjs";

// Define a unified event type that includes attendances and files
type UnifiedEventType = event & {
  attendances: attendance[];
  files: files[];
};

// Define props interface for EventList
interface EventListProps {
  events: UnifiedEventType[];
  user: user;
}

const EventList = ({ events, user }: EventListProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCopyLink = (eventId: string) => {
    const uploadLink = `https://www.bihance.app/event/${eventId}`;
    navigator.clipboard
      .writeText(uploadLink)
      .then(() => {
        toast.success("Copied Link!");
      })
      .catch((err) => {
        toast.error("Failed to copy: ", err);
      });
  };

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col p-5">
      <div className="flex flex-col mb-4 gap-5">
        <h1 className="font-bold text-2xl">Analytics</h1>
        <p>Credits Left: {user ? user.credits : "Loading..."}</p>
        {/* <div>
          <h1 className="font-bold text-xl">
            Images
          </h1>
          
          {events.map((images) => (
            <div key={images.eventid} className="flex flex-col gap-5">
              <a href={images.image} download><img src={images.image} className="rounded-lg w-48"/></a>

              {images.attendances.map((atd) => (
                <a href={atd.imageurl} download key={atd.id}><img src={atd.imageurl} className="rounded-lg w-48"/></a>
              ))}
              <h1>
                Event Files
              </h1>
              {images.files.map((file) => (
                <a key={file.id} href={file.url} className="flex"><Link2/>{file.name}</a>
              ))}
            </div>
          ))}
        </div> */}
        <h1 className="font-bold text-2xl">All events:</h1>

        <div className="flex-wrap flex gap-5">
          <Button asChild>
            <Link href="/edit-event">Create event</Link>
          </Button>
        </div>
      </div>
      <Input
        type="text"
        placeholder="Search for an event..."
        value={searchTerm}
        onChange={handleSearchChange}
      />

      <div className="flex flex-wrap m-5">
        {filteredEvents.map((item: UnifiedEventType) => (
          <Card key={item.eventid} className="w-56">
            <CardHeader>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Ellipsis />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <Link href={`/edit-event/${item.eventid}`} className="w-full">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem>
                    <Link href={`/view/${item.eventid}`} className="w-full">
                      Employees
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href={`/payment/${item.eventid}`} className="w-full">
                      Shifts
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
              <img src={item.image} alt={item.name} /> {/* Add alt for accessibility */}
              <CardTitle>{item.name}</CardTitle>
              <CardDescription>{item.location}</CardDescription>
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
