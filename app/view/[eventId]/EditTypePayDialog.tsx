import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList, CommandInput } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import axios from "axios";

type EditTypePayDialogProps = {
  typepayId: string;
  initialDay: string;
  initialShift: string;
  initialPay: number;
  onClose: () => void;
  onUpdate: () => void;
};

const dayOptions = [
  { value: "weekday", label: "Weekday" },
  { value: "weekend", label: "Weekend" },
];

const payTypeOptions = [
  { value: "location", label: "Per Location" },
  { value: "project", label: "Per Project" },
  { value: "hour", label: "Per Hour" },
  { value: "minute", label: "Per Minute" },
];

const EditTypePayDialog: React.FC<EditTypePayDialogProps> = ({
  typepayId,
  initialDay,
  initialShift,
  initialPay,
  onClose,
  onUpdate,
}) => {
  const [day, setDay] = useState(initialDay);
  const [shift, setShift] = useState(initialShift);
  const [pay, setPay] = useState<number | "">(initialPay);
  const [isDayOpen, setIsDayOpen] = useState(false);

  const handleEdit = async () => {
    if (!day || !shift || pay === "") {
      toast.error("All fields are required");
      return;
    }

    try {
      await axios.patch(`/api/add-payroll/${typepayId}`, {
        day,
        shift,
        pay: Number(pay),
      });

      toast.success("Typepay entry updated");
      onUpdate();  // Notify parent component about the update
      onClose();   // Close the dialog
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.error || "An error occurred. Please try again.");
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Type Pay</DialogTitle>
        </DialogHeader>

        {/* Day Selection Combobox */}
        <Popover open={isDayOpen} onOpenChange={setIsDayOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={isDayOpen}
              className="w-full justify-between mb-4"
            >
              {day ? dayOptions.find((option) => option.value === day)?.label : "Select Day..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search day..." />
              <CommandList>
                <CommandEmpty>No day found.</CommandEmpty>
                <CommandGroup>
                  {dayOptions.map((option) => (
                    <CommandItem
                      key={option.value}
                      onSelect={() => {
                        setDay(option.value);
                        setIsDayOpen(false);
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", day === option.value ? "opacity-100" : "opacity-0")} />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Input
          type="text"
          placeholder="Shift"
          value={shift}
          onChange={(e) => setShift(e.target.value)}
          className="mb-4"
        />

        <Input
          type="number"
          placeholder="Pay"
          value={pay}
          onChange={(e) => setPay(e.target.value === "" ? "" : Number(e.target.value))}
          className="mb-4"
        />

        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleEdit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditTypePayDialog;
