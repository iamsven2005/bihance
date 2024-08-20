import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { event } from "@prisma/client";

interface AssignEventModalProps {
  event: event;
  onClose: () => void;
}

const AssignEventModal = ({ event, onClose }: AssignEventModalProps) => {
  const [workspaceId, setWorkspaceId] = useState(event.orgId || "");
  const router = useRouter();

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/events/${event.eventid}/workspace`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ workspaceId }),
      });

      if (!response.ok) {
        throw new Error("Failed to assign workspace");
      }

      toast.success("Workspace assigned successfully!");
      router.refresh(); // Revalidate the path to reflect changes
      onClose();
    } catch (error) {
      toast.error("Failed to assign workspace");
    }
  };

  const handleRemove = async () => {
    try {
      const response = await fetch(`/api/events/${event.eventid}/workspace`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to remove workspace");
      }

      toast.success("Workspace removed successfully!");
      router.refresh(); // Revalidate the path to reflect changes
      onClose();
    } catch (error) {
      toast.error("Failed to remove workspace");
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign to Workspace</DialogTitle>
        </DialogHeader>
        <input
          type="text"
          value={workspaceId}
          onChange={(e) => setWorkspaceId(e.target.value)}
          placeholder="Enter Workspace ID"
          className="mb-4"
        />
        <DialogFooter>
          <Button onClick={handleSave}>Save</Button>
          {event.orgId && (
            <Button variant="destructive" onClick={handleRemove}>
              Remove from Workspace
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignEventModal;
