import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { event } from "@prisma/client";
import { useUser } from "@clerk/nextjs";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";

interface AssignEventModalProps {
  event: event;
  onClose: () => void;
}

const AssignEventModal = ({ event, onClose }: AssignEventModalProps) => {
  const { user } = useUser();
  const [organizationIds, setOrganizationIds] = useState<string[]>([]);
  const [orgNames, setOrgNames] = useState<string[]>([]);
  const [workspaceId, setWorkspaceId] = useState(event.orgId || "");
  const [selectedOrg, setSelectedOrg] = useState(workspaceId);
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
      await axios.patch(`/api/events/${event.eventid}/workspace`, {
        workspaceId: selectedOrg,
      });

      toast.success("Workspace assigned successfully!");
      router.refresh(); // Revalidate the path to reflect changes
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
      router.refresh(); // Revalidate the path to reflect changes
      onClose();
    } catch (error) {
      console.error("Failed to remove workspace:", error);
      toast.error("Failed to remove workspace");
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign to Workspace</DialogTitle>
        </DialogHeader>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {selectedOrg
                ? orgNames[organizationIds.indexOf(selectedOrg)] || "Select organization..."
                : "Select organization..."}
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
                    <CommandItem
                      key={orgId}
                      value={orgId}
                      onSelect={(currentValue) => {
                        setSelectedOrg(currentValue === selectedOrg ? "" : currentValue);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedOrg === orgId ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {orgNames[index]}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

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
