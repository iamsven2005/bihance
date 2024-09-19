"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { event, attendance, files, user } from "@prisma/client";
import { useUser } from "@clerk/nextjs";
import { QRCodeCanvas } from "qrcode.react";
import { saveAs } from 'file-saver';
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Ellipsis, Check, ChevronsUpDown, Search, Plus } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import {useInView} from "react-intersection-observer"
type UnifiedEventType = event & {
  attendances: attendance[];
  files: files[];
};

const AssignEventModal = ({ event, onClose }: { event: event, onClose: () => void }) => {
  const { user } = useUser();
  const [organizationIds, setOrganizationIds] = useState<string[]>([]);
  const [orgNames, setOrgNames] = useState<string[]>([]);
  const [selectedOrg, setSelectedOrg] = useState(event.orgId || "");
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchOrganizations = () => {
      if (user) {
        const organizations = user.organizationMemberships;
        const orgIds = organizations.map((org) => org.organization.id);
        const orgNames = organizations.map((org) => org.organization.name);
        setOrganizationIds(orgIds);
        setOrgNames(orgNames);
      }
    };
    fetchOrganizations();
  }, [user]);

  const handleSave = async () => {
    try {
      await axios.patch(`/api/events/${event.eventid}/workspace`, { workspaceId: selectedOrg });
      toast.success("Workspace assigned successfully!");
      router.refresh();
      onClose();
    } catch (error) {
      console.error("Failed to assign workspace:", error);
      toast.error("Failed to assign workspace");
    }
  };

  const handleRemove = async () => {
    try {
      await axios.delete(`/api/events/${event.eventid}/workspace`);
      toast.success("Workspace removed successfully!");
      router.refresh();
      onClose();
    } catch (error) {
      console.error("Failed to remove workspace:", error);
      toast.error("Failed to remove workspace");
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign to Workspace</DialogTitle>
        </DialogHeader>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
              {selectedOrg ? orgNames[organizationIds.indexOf(selectedOrg)] || "Select organization..." : "Select organization..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search organization..." />
              <CommandList>
                <CommandEmpty>No organization found.</CommandEmpty>
                <CommandGroup>
                  {organizationIds.map((orgId, index) => (
                    <CommandItem key={orgId} value={orgId} onSelect={(currentValue) => {
                      setSelectedOrg(currentValue === selectedOrg ? "" : currentValue);
                      setOpen(false);
                    }}>
                      <Check className={cn("mr-2 h-4 w-4", selectedOrg === orgId ? "opacity-100" : "opacity-0")} />
                      {orgNames[index]}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button onClick={handleSave} className="w-full sm:w-auto">Save</Button>
          {event.orgId && <Button variant="destructive" onClick={handleRemove} className="w-full sm:w-auto">Remove from Workspace</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const EventCard = ({ item, onAssignWorkspace, onCopyLink, onShowQRCode }: { 
  item: UnifiedEventType, 
  onAssignWorkspace: (event: UnifiedEventType) => void,
  onCopyLink: (eventId: string) => void,
  onShowQRCode: (eventId: string) => void
}) => (
  <Card className="flex flex-col h-full">
    <CardHeader className="flex-grow-0">
      <div className="flex justify-between items-center">
        <CardTitle className="text-lg sm:text-xl truncate">{item.name}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Ellipsis className="h-5 w-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Link href={`/edit-event/${item.eventid}`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/view/${item.eventid}`}>Employees</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/payment/${item.eventid}`}>Shifts</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onCopyLink(item.eventid)}>
              Copy Invite
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onShowQRCode(item.eventid)}>
              QR Code
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onAssignWorkspace(item)}>
              Assign to Workspace
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </CardHeader>
    <CardContent className="flex-grow">
      {item.image && item.image !== "" && (
        <img src={item.image} alt={item.name} className="w-full h-32 object-cover mb-2 rounded" />
      )}
      <CardDescription className="text-sm">{item.location}</CardDescription>
    </CardContent>
    <CardFooter className="flex-grow-0">
      <div className="text-xs sm:text-sm line-clamp-2" dangerouslySetInnerHTML={{ __html: item.description }}></div>
    </CardFooter>
  </Card>
);

const EventList = ({ events, user }: { events: UnifiedEventType[], user: user }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<UnifiedEventType | null>(null);
  const [qrCodePreviewEventId, setQrCodePreviewEventId] = useState<string | null>(null);
  const qrCodeRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const [displayedEvents, setDisplayedEvents] = useState<UnifiedEventType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ref, inView] = useInView();

  const loadMoreEvents = useCallback(() => {
    const nextEvents = events.slice(displayedEvents.length, displayedEvents.length + 12);
    setDisplayedEvents(prev => [...prev, ...nextEvents]);
    setIsLoading(false);
  }, [events, displayedEvents]);

  useEffect(() => {
    if (inView) {
      loadMoreEvents();
    }
  }, [inView, loadMoreEvents]);

  useEffect(() => {
    setDisplayedEvents([]);
    setIsLoading(true);
    const timer = setTimeout(() => {
      const filteredEvents = events.filter((event) => 
        event.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setDisplayedEvents(filteredEvents.slice(0, 12));
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, events]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleAssignWorkspace = (event: UnifiedEventType) => {
    setSelectedEvent(event);
  };

  const handleCopyLink = (eventId: string) => {
    const uploadLink = `https://www.bihance.app/event/${eventId}`;
    navigator.clipboard.writeText(uploadLink).then(() => {
      toast.success("Copied Link!");
    }).catch((err) => {
      toast.error("Failed to copy: ", err);
    });
  };

  const handleDownloadQRCode = () => {
    const canvas = qrCodeRef.current;
    if (canvas) {
      setTimeout(() => {
        canvas.toBlob((blob) => {
          if (blob) {
            saveAs(blob, `event-${qrCodePreviewEventId}-qrcode.png`);
          } else {
            toast.error("Failed to generate QR code file.");
          }
        });
      }, 100);
    } else {
      toast.error("QR code not rendered yet.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col mb-8 gap-4">
        <h1 className="font-bold text-3xl sm:text-4xl">Analytics</h1>
        <p className="text-lg">Credits Left: {user ? user.credits : "Loading..."}</p>
        <h2 className="font-bold text-2xl sm:text-3xl">All events</h2>
        <div className="flex flex-wrap gap-4">
          <Button asChild className="w-full sm:w-auto">
            <Link href="/edit-event">
              <Plus className="mr-2 h-4 w-4" />
              Create event
            </Link>
          </Button>
        </div>
      </div>
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input 
          type="text" 
          placeholder="Search for an event..." 
          value={searchTerm} 
          onChange={handleSearchChange}
          className="pl-10 w-full"
        />
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(12)].map((_, index) => (
            <Card key={index} className="flex flex-col h-64">
              <CardHeader className="flex-grow-0">
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent className="flex-grow">
                <Skeleton className="h-32 w-full mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
              <CardFooter className="flex-grow-0">
                <Skeleton className="h-4 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : displayedEvents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedEvents.map((item: UnifiedEventType) => (
            <EventCard 
              key={item.eventid} 
              item={item} 
              onAssignWorkspace={handleAssignWorkspace}
              onCopyLink={handleCopyLink}
              onShowQRCode={setQrCodePreviewEventId}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-8">No events found. Try adjusting your search.</p>
      )}
      {!isLoading && displayedEvents.length < events.length && (
        <div ref={ref} className="flex justify-center mt-8">
          <Button onClick={loadMoreEvents} variant="outline">Load More</Button>
        </div>
      )}

      {selectedEvent && (
        <AssignEventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}

      {qrCodePreviewEventId && (
        <Dialog open={qrCodePreviewEventId !== null} onOpenChange={() => setQrCodePreviewEventId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>QR Code Preview</DialogTitle>
            </DialogHeader>
            <div className="flex justify-center">
              <QRCodeCanvas ref={qrCodeRef} value={`https://www.bihance.app/event/${qrCodePreviewEventId}`} size={256} />
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="ghost" onClick={() => setQrCodePreviewEventId(null)} className="w-full sm:w-auto">Close</Button>
              <Button onClick={handleDownloadQRCode} className="w-full sm:w-auto">Download QR Code</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default EventList;