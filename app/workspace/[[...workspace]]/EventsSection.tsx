"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { QRCodeCanvas } from "qrcode.react";
import { saveAs } from "file-saver";
import { event } from "@prisma/client";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface EventsSectionProps {
  orgId: string;
  events: event[];
}

export const EventsSection = ({ orgId, events }: EventsSectionProps) => {
  const [qrCodePreviewEventId, setQrCodePreviewEventId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleDownloadQRCode = (eventId: string) => {
    const canvas = document.getElementById(`qr-code-${eventId}`) as HTMLCanvasElement;
    canvas.toBlob((blob) => {
      if (blob) {
        saveAs(blob, `event-${eventId}-qrcode.png`);
      }
    });
  };

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>All events:</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          type="text"
          placeholder="Search for an event..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex flex-wrap m-5">
          {filteredEvents.map((item) => (
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
                      <Link href={`/view/${item.eventid}`} className="w-full">Employees</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href={`/payment/${item.eventid}`} className="w-full">Shifts</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Button variant={"ghost"} onClick={() => handleCopyLink(item.eventid)}>Copy Invite</Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Button variant={"ghost"} onClick={() => setQrCodePreviewEventId(item.eventid)}>QR Code</Button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                {item.image && item.image !== "" && (
                  <img src={item.image} alt={item.name} />
                )}
                <CardTitle>{item.name}</CardTitle>
                <CardDescription>{item.location}</CardDescription>
              </CardContent>
              <CardFooter>
                <div dangerouslySetInnerHTML={{ __html: item.description }}></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </CardContent>

      {/* QR Code Preview Dialog */}
      {qrCodePreviewEventId && (
        <Dialog open={qrCodePreviewEventId !== null} onOpenChange={() => setQrCodePreviewEventId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>QR Code Preview</DialogTitle>
            </DialogHeader>
            <QRCodeCanvas
              id={`qr-code-preview`}
              value={`https://www.bihance.app/event/${qrCodePreviewEventId}`}
              size={256}
            />
            <DialogFooter>
              <Button onClick={() => handleDownloadQRCode(qrCodePreviewEventId)}>Download QR Code</Button>
              <Button variant="ghost" onClick={() => setQrCodePreviewEventId(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};
