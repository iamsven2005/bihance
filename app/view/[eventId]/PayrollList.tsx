// pages/combined-payroll.tsx

"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Check, ChevronsUpDown, Loader2, Trash2, Plus } from "lucide-react";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandInput,
} from "@/components/ui/command";
import { payroll, typepay, user } from "@prisma/client";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Day and Pay Type options
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

// Add Payroll Component
interface AddPayrollProps {
  eventId: string;
  onPayrollAdded: () => void;
}

const AddPayroll: React.FC<AddPayrollProps> = ({ eventId, onPayrollAdded }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddPayroll = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post("/api/payroll", { email, eventId });
      setEmail("");
      toast.success("Added payroll");
      onPayrollAdded();
    } catch (error) {
      toast.error("Failed to add payroll");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleAddPayroll} className="flex flex-wrap gap-4 mb-8">
      <div className="flex-grow">
        <Label htmlFor="email" className="sr-only">
          User Email
        </Label>
        <Input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter user email"
          required
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
        Add Payroll
      </Button>
    </form>
  );
};

// Payroll List Component
interface PayrollListProps {
  members: (payroll & { typepay: typepay[] })[];
  userMap: Record<string, user>;
}

const PayrollList: React.FC<PayrollListProps> = ({ members, userMap }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTemplates, setSelectedTemplates] = useState<Record<string, string>>({});
  const [templates, setTemplates] = useState<{ id: string; name: string }[]>([]);
  const [editedTypePayValues, setEditedTypePayValues] = useState<{ [key: string]: Partial<typepay> }>({});
  const router = useRouter();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const { data } = await axios.get("/api/typepay-template");
        setTemplates(data.templates);
      } catch (error) {
        toast.error("Failed to fetch templates");
      }
    };
    fetchTemplates();
  }, []);

  const handleUpdateTypePay = useCallback(async (typeid: string, field: keyof typepay, value: string | number) => {
    try {
      const updatedValue = { [field]: value };
      await axios.patch("/api/typepay", { typeid, ...updatedValue });
      toast.success("Updated typepay successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to update typepay");
    }
  }, [router]);

  const handleBlur = useCallback((typeid: string, field: keyof typepay) => {
    const editedValue = editedTypePayValues[typeid]?.[field];
    if (editedValue !== undefined && editedValue !== null) {
      handleUpdateTypePay(typeid, field, editedValue);
    }
  }, [editedTypePayValues, handleUpdateTypePay]);

  const handleInputChange = useCallback((typeid: string, field: keyof typepay, value: string | number) => {
    setEditedTypePayValues((prevValues) => ({
      ...prevValues,
      [typeid]: { ...prevValues[typeid], [field]: value },
    }));
  }, []);

  const handleDelete = useCallback(async (userId: string, eventId: string) => {
    try {
      await axios.delete("/api/payroll", { data: { userIdToDelete: userId, eventId } });
      toast.success("Deleted payroll entry");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete payroll entry");
    }
  }, [router]);

  const handleTypeDelete = useCallback(async (typeid: string) => {
    try {
      await axios.delete(`/api/payroll/${typeid}`);
      toast.success("Deleted typepay entry");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete typepay entry");
    }
  }, [router]);

  const filteredMembers = members.filter((item) => {
    const user = userMap[item.userId];
    const fullName = `${user?.first_name} ${user?.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  const handleAssignTemplate = useCallback(async (payrollId: string, userId: string) => {
    try {
      await axios.post("/api/typepay", { payrollId, templateId: selectedTemplates[userId] });
      toast.success("Template assigned successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to assign template");
    }
  }, [selectedTemplates, router]);

  return (
    <div>
      <Input
        type="text"
        placeholder="Search payroll by name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6"
      />

      {filteredMembers.map((payrollItem) => {
        const user = userMap[payrollItem.userId];
        return (
          <Card key={payrollItem.payrollid} className="mb-6">
            <CardHeader>
              <CardTitle>{user?.first_name} {user?.last_name}</CardTitle>
            </CardHeader>

            <CardContent>
              {payrollItem.typepay.map((typepayItem) => (
                <div key={typepayItem.typeid} className="flex items-center gap-4 mb-4">
                  <Input
                    type="text"
                    value={editedTypePayValues[typepayItem.typeid]?.day || typepayItem.day}
                    onChange={(e) => handleInputChange(typepayItem.typeid, "day", e.target.value)}
                    onBlur={() => handleBlur(typepayItem.typeid, "day")}
                    className="w-32"
                  />
                  <Input
                    type="text"
                    value={editedTypePayValues[typepayItem.typeid]?.shift || typepayItem.shift}
                    onChange={(e) => handleInputChange(typepayItem.typeid, "shift", e.target.value)}
                    onBlur={() => handleBlur(typepayItem.typeid, "shift")}
                    className="w-32"
                  />
                  <Input
                    type="number"
                    value={editedTypePayValues[typepayItem.typeid]?.pay || typepayItem.pay}
                    onChange={(e) => handleInputChange(typepayItem.typeid, "pay", Number(e.target.value))}
                    onBlur={() => handleBlur(typepayItem.typeid, "pay")}
                    className="w-32"
                  />
                  <Button
                    variant="destructive"
                    onClick={() => handleTypeDelete(typepayItem.typeid)}
                    size="icon"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>

            <CardFooter className="flex flex-wrap gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto justify-between">
                    {selectedTemplates[payrollItem.userId]
                      ? templates.find((t) => t.id === selectedTemplates[payrollItem.userId])?.name
                      : "Select Template..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search templates..." />
                    <CommandList>
                      <CommandGroup>
                        {templates.map((template) => (
                          <CommandItem key={template.id} onSelect={() => setSelectedTemplates((prev) => ({
                            ...prev,
                            [payrollItem.userId]: template.id,
                          }))}>
                            <Check className={cn("mr-2 h-4 w-4", selectedTemplates[payrollItem.userId] === template.id ? "opacity-100" : "opacity-0")} />
                            {template.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <Button
                onClick={() => handleAssignTemplate(payrollItem.payrollid, payrollItem.userId)}
              >
                Assign Template
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(payrollItem.userId, payrollItem.eventid)}
              >
                Delete Payroll
              </Button>
              <AddTypePayDialog payrollId={payrollItem.payrollid} />
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

// Combined Payroll Component
interface CombinedPayrollProps {
  eventId: string;
  members: (payroll & { typepay: typepay[] })[];
  userMap: Record<string, user>;
}

export const CombinedPayroll: React.FC<CombinedPayrollProps> = ({ eventId, members, userMap }) => {
  const [payrollMembers, setPayrollMembers] = useState(members);

  const handlePayrollAdded = useCallback(() => {
    setPayrollMembers([...members]);
  }, [members]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Payroll Management</h1>
      <AddPayroll eventId={eventId} onPayrollAdded={handlePayrollAdded} />
      <PayrollList members={payrollMembers} userMap={userMap} />
    </div>
  );
};

// AddTypePayDialog Component
interface AddTypePayDialogProps {
  payrollId: string;
}

const AddTypePayDialog: React.FC<AddTypePayDialogProps> = ({ payrollId }) => {
  const [day, setDay] = useState("");
  const [pay, setPay] = useState<number | "">("");
  const [payType, setPayType] = useState("");
  const [isDayOpen, setIsDayOpen] = useState(false);
  const [isPayTypeOpen, setIsPayTypeOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAdd = async () => {
    if (!day || !payType || pay === "") {
      toast.error("All fields are required");
      return;
    }

    setIsLoading(true);
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
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Add Pay Type
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Type Pay</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Popover open={isDayOpen} onOpenChange={setIsDayOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={isDayOpen}
                className="w-full justify-between"
              >
                {day ? dayOptions.find(option => option.value === day)?.label : "Select Day..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search day..." />
                <CommandList>
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

          <Popover open={isPayTypeOpen} onOpenChange={setIsPayTypeOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={isPayTypeOpen}
                className="w-full justify-between"
              >
                {payType ? payTypeOptions.find(option => option.value === payType)?.label : "Select Pay Type..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search pay type..." />
                <CommandList>
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

          <div>
            <Label htmlFor="pay">Pay Amount</Label>
            <Input
              id="pay"
              type="number"
              placeholder="Enter pay amount"
              value={pay}
              onChange={(e) => setPay(e.target.value === "" ? "" : Number(e.target.value))}
            />
          </div>
        </div>

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

          <Button onClick={handleAdd} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CombinedPayroll;
