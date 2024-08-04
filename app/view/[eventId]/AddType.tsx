// AddTypePayDialog.tsx

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
const frameworks = [
    {
      value: "Weekday",
      label: "Weekday",
    },
    {
      value: "Weekend",
      label: "Weekend",
    },
  ]
type AddTypePayDialogProps = {
  payrollId: string;
};

const AddTypePayDialog: React.FC<AddTypePayDialogProps> = ({ payrollId }) => {
  const [day, setDay] = useState("");
  const [shift, setShift] = useState("");
  const [pay, setPay] = useState<number | "">("");
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const handleAdd = async () => {
    if (!day || !shift || pay === "") {
      toast.error("All fields are required");
      return;
    }

    try {
      const response = await fetch("/api/add-typepay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payrollId,
          day,
          shift,
          pay: Number(pay),
        }),
      });

      if (response.ok) {
        toast.success("Added new typepay entry");
      } else {
        const data = await response.json();
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add Pay Type</Button>
      </DialogTrigger>
      <DialogContent>
      <DialogHeader>
        <DialogTitle>Add New Type Pay</DialogTitle>
      </DialogHeader>
        <Input
          type="text"
          placeholder="Day (weekday or weekend)"
          value={day}
          onChange={(e) => setDay(e.target.value)}
          className="mb-4"
        />
        <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : "Select framework..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup>
            {frameworks.map((framework) => (
              <CommandItem
                key={framework.value}
                value={framework.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === framework.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {framework.label}
              </CommandItem>
            ))}
          </CommandGroup>
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
        <Button variant="secondary">
          Cancel
        </Button>
        <Button onClick={handleAdd}>
          Add
        </Button>
        </DialogFooter>
      </DialogContent>

    </Dialog>
  );
};

export default AddTypePayDialog;
