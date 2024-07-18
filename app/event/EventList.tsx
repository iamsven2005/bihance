"use client";

import { useState } from "react";
import { event } from "@prisma/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type EventListProps = {
  events: event[];
};

const EventList: React.FC<EventListProps> = ({ events }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
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
          <div
            key={item.eventid}
            className="flex flex-col rounded-xl bg-base-200 shadow-lg gap-5 p-5 w-72 m-5 mx-auto"
          >
            <img src={item.image} className="m-5 rounded-xl" />
            <h1 className="font-bold text-2xl">{item.name}</h1>
            <p>
              About the event:
            </p>
              <div dangerouslySetInnerHTML={{ __html: item.description }}></div>
            <p>
              Location:
              <br />
              {item.location}
            </p>
            <div className="flex flex-row gap-2">
              <Link href={`/edit-event/${item.eventid}`}>
                <Button>Edit</Button>
              </Link>
              <Link href={`/view/${item.eventid}`}>
                <Button>Employees</Button>
              </Link>
              <Link href={`/payment/${item.eventid}`}>
                <Button>Shifts</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;
