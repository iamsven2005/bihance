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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandInput,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import axios from "axios";

type AddTypePayDialogProps = {
  payrollId: string;
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

const AddTypePayDialog: React.FC<AddTypePayDialogProps> = ({ payrollId }) => {
  const [day, setDay] = useState("");
  const [pay, setPay] = useState<number | "">("");
  const [payType, setPayType] = useState("");
  const [isDayOpen, setIsDayOpen] = useState(false);
  const [isPayTypeOpen, setIsPayTypeOpen] = useState(false);
  const router = useRouter();

  const handleAdd = async () => {
    if (!day || !payType || pay === "") {
      toast.error("All fields are required");
      return;
    }

    try {
      await axios.post("/api/add-typepay", {
        payrollId,
        day,
        shift: payType,
        pay: Number(pay),
      });

      toast.success("Added new typepay entry");
      router.refresh();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.error || "An error occurred. Please try again.");
      } else {
        toast.error("An error occurred. Please try again.");
      }
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

        {/* Day Selection Combobox */}
        <Popover open={isDayOpen} onOpenChange={setIsDayOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={isDayOpen}
              className="w-full justify-between mb-4"
            >
              {day ? dayOptions.find(option => option.value === day)?.label : "Select Day..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search day..." />
              <CommandList>
                <CommandEmpty>No day found.</CommandEmpty>
                <CommandGroup>
                  {dayOptions.map(option => (
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

        {/* Pay Type Selection Combobox */}
        <Popover open={isPayTypeOpen} onOpenChange={setIsPayTypeOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={isPayTypeOpen}
              className="w-full justify-between mb-4"
            >
              {payType ? payTypeOptions.find(option => option.value === payType)?.label : "Select Pay Type..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search pay type..." />
              <CommandList>
                <CommandEmpty>No pay type found.</CommandEmpty>
                <CommandGroup>
                  {payTypeOptions.map(option => (
                    <CommandItem
                      key={option.value}
                      onSelect={() => {
                        setPayType(option.value);
                        setIsPayTypeOpen(false);
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", payType === option.value ? "opacity-100" : "opacity-0")} />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Input
          type="number"
          placeholder="Pay"
          value={pay}
          onChange={(e) => setPay(e.target.value === "" ? "" : Number(e.target.value))}
          className="mb-4"
        />

        <DialogFooter>
          <Button 
            variant="secondary" 
            onClick={() => {
              setDay("");
              setPay("");
              setPayType("");
            }}
          >
            Cancel
          </Button>

          <Button onClick={handleAdd}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTypePayDialog;