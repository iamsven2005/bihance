"use client";

import React, { useState, useEffect } from "react";
import { payroll, typepay, user } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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
import axios from "axios";
import { useRouter } from "next/navigation";
import AddTypePayDialog from "./AddType";

type PayrollListProps = {
  members: (payroll & { typepay: typepay[] })[];
  userMap: Record<string, user>;
};

interface Template {
  id: string;
  name: string;
}

const PayrollList: React.FC<PayrollListProps> = ({ members, userMap }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<{
    userId: string;
    weekday: number;
    weekend: number;
  } | null>(null);
  const [editingTypePay, setEditingTypePay] = useState<typepay | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplates, setSelectedTemplates] = useState<Record<string, string>>({});
  const [weekday, setWeekday] = useState<number>(0);
  const [weekend, setWeekend] = useState<number>(0);
  const [error, setError] = useState<string>("");

  const [editingTypePayId, setEditingTypePayId] = useState<string | null>(null);
  const [editedTypePayValues, setEditedTypePayValues] = useState<{
    [key: string]: Partial<typepay>;
  }>({});

  const router = useRouter();

  const handleUpdateTypePay = async (
    typeid: string,
    field: keyof typepay,
    value: string | number
  ) => {
    try {
      const updatedValue = { [field]: value };
      await axios.patch("/api/typepay", {
        typeid,
        ...updatedValue,
      });
      toast.success("Updated typepay successfully");
      setEditingTypePayId(null);
      router.refresh();
    } catch (error) {
      toast.error("Failed to update typepay");
    }
  };

  const handleBlur = (typeid: string, field: keyof typepay) => {
    const editedValue = editedTypePayValues[typeid]?.[field];
    
    if (editedValue !== undefined && editedValue !== null) {
      handleUpdateTypePay(typeid, field, editedValue);
    }
  };

  const handleInputChange = (typeid: string, field: keyof typepay, value: string | number) => {
    setEditedTypePayValues((prevValues) => ({
      ...prevValues,
      [typeid]: { ...prevValues[typeid], [field]: value },
    }));
  };

  const filteredMembers = members.filter((item) => {
    const user = userMap[item.userId];
    const fullName = `${user?.first_name} ${user?.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const { data: templateData } = await axios.get("/api/typepay-template");
        setTemplates(templateData.templates);
      } catch (error) {
        toast.error("Failed to fetch templates");
      }
    };

    fetchTemplates();
  }, []);

  const handleUpdatePayroll = async () => {
    try {
      if (!selectedUser) return;

      await axios.patch("/api/typepay", {
        userId: selectedUser.userId,
        weekday,
        weekend,
      });

      setError("");
      toast.success("Updated payroll successfully");
      setSelectedUser(null);
      router.refresh(); // Refresh the page instead of calling a non-existent handleUpdate function
    } catch (error) {
      setError(
        axios.isAxiosError(error) && error.response
          ? error.response.data.error || "An error occurred. Please try again."
          : "An error occurred. Please try again."
      );
      toast.error("Failed to update payroll");
    }
  };

  const handleDelete = async (userId: string, eventId: string) => {
    try {
      await axios.delete("/api/payroll", {
        data: { userIdToDelete: userId, eventId },
      });
      toast.success("Deleted payroll entry");
      router.refresh();
    } catch (error) {
      toast.error(
        axios.isAxiosError(error) && error.response
          ? error.response.data.error || "An error occurred. Please try again."
          : "An error occurred. Please try again."
      );
    }
  };

  const handleTypeDelete = async (typeid: string) => {
    try {
      await axios.delete(`/api/payroll/${typeid}`);
      toast.success("Deleted typepay entry");
      router.refresh();
    } catch (error) {
      toast.error(
        axios.isAxiosError(error) && error.response
          ? error.response.data.error || "An error occurred. Please try again."
          : "An error occurred. Please try again."
      );
    }
  };

  const handleAssignTemplate = async (payrollId: string, userId: string) => {
    try {
      await axios.post("/api/typepay", {
        payrollId,
        templateId: selectedTemplates[userId],
      });

      toast.success("Template assigned successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to assign template");
    }
  };

  const handleTemplateChange = (userId: string, templateId: string) => {
    setSelectedTemplates((prevSelectedTemplates) => ({
      ...prevSelectedTemplates,
      [userId]: templateId,
    }));
  };

 
  const [day, setDay] = useState("");
  const [pay, setPay] = useState<number | "">("");
  const [payType, setPayType] = useState("");
  const [isDayOpen, setIsDayOpen] = useState(false);
  const [isPayTypeOpen, setIsPayTypeOpen] = useState(false);

  const handleAddTypePay = async (payrollId: string) => {
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
    <div className="m-5">
      <Input
        type="text"
        placeholder="Search pay by name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="m-5"
      />

{filteredMembers.map((payrollItem) => {
  const user = userMap[payrollItem.userId];
  return (
    <Card key={payrollItem.payrollid} className="mb-4">
      <CardHeader>
        <CardTitle>
          {user?.first_name} {user?.last_name}
        </CardTitle>
      </CardHeader>

      {payrollItem.typepay.map((typepayItem) => (
        <CardContent key={typepayItem.typeid}>
          <CardDescription className="flex gap-5 flex-wrap items-center">
            {/* Inline Editable Day */}
            <Input
              type="text"
              value={editedTypePayValues[typepayItem.typeid]?.day || typepayItem.day}
              onChange={(e) =>
                handleInputChange(typepayItem.typeid, "day", e.target.value)
              }
              onBlur={() => handleBlur(typepayItem.typeid, "day")}
              className="w-32"
            />

            {/* Inline Editable Pay Type */}
            <Input
              type="text"
              value={
                editedTypePayValues[typepayItem.typeid]?.shift || typepayItem.shift
              }
              onChange={(e) =>
                handleInputChange(typepayItem.typeid, "shift", e.target.value)
              }
              onBlur={() => handleBlur(typepayItem.typeid, "shift")}
              className="w-32"
            />

            {/* Inline Editable Pay */}
            <Input
              type="number"
              value={editedTypePayValues[typepayItem.typeid]?.pay || typepayItem.pay}
              onChange={(e) =>
                handleInputChange(typepayItem.typeid, "pay", Number(e.target.value))
              }
              onBlur={() => handleBlur(typepayItem.typeid, "pay")}
              className="w-32"
            />

            {/* Delete TypePay Button */}
            <Button
              variant="destructive"
              onClick={() => handleTypeDelete(typepayItem.typeid)}
              className="ml-4"
            >
              Delete
            </Button>
          </CardDescription>
        </CardContent>
      ))}

      <CardFooter>
        {/* Template Assignment Combo Box */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between"
              aria-expanded="true"
            >
              {selectedTemplates[payrollItem.userId]
                ? templates.find((t) => t.id === selectedTemplates[payrollItem.userId])?.name
                : "Select Template..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search template..." />
              <CommandList>
                <CommandEmpty>No templates found.</CommandEmpty>
                <CommandGroup>
                  {templates.map((template) => (
                    <CommandItem
                      key={template.id}
                      onSelect={() => handleTemplateChange(payrollItem.userId, template.id)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedTemplates[payrollItem.userId] === template.id ? "opacity-100" : "opacity-0"
                        )}
                      />
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
          className="mt-4"
        >
          Assign Template
        </Button>

        {/* Delete Payroll Button */}
        <Button
          variant="destructive"
          onClick={() => handleDelete(payrollItem.userId, payrollItem.eventid)}
          className="mt-4"
        >
          Delete Payroll
        </Button>
        <AddTypePayDialog payrollId={payrollItem.payrollid}/>
      </CardFooter>
    </Card>
  );
})}



      {/* Update Payroll Dialog */}
      {selectedUser && (
        <Dialog open={true} onOpenChange={() => setSelectedUser(null)}>
          <DialogContent className="p-5">
            <DialogHeader>
              <DialogTitle>Update Shift</DialogTitle>
              <DialogDescription>
                Make changes to the payroll here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="weekday" className="text-right">
                  Weekday Payment
                </Label>
                <Input
                  type="number"
                  id="weekday"
                  name="weekday"
                  value={weekday}
                  onChange={(e) => setWeekday(Number(e.target.value))}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="weekend" className="text-right">
                  Weekend Payment
                </Label>
                <Input
                  type="number"
                  id="weekend"
                  name="weekend"
                  value={weekend}
                  onChange={(e) => setWeekend(Number(e.target.value))}
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <DialogFooter>
              <Button onClick={handleUpdatePayroll}>Save changes</Button>
              <Button variant="outline" onClick={() => setSelectedUser(null)}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {editingTypePay && (
        <Dialog open={true} onOpenChange={() => setEditingTypePay(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Type Pay</DialogTitle>
            </DialogHeader>

            <Popover open={true} onOpenChange={() => setEditingTypePay(null)}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={true}
                  className="w-full justify-between mb-4"
                >
                  {editingTypePay.day
                    ? "Day: " + editingTypePay.day
                    : "Select Day..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search day..." />
                  <CommandList>
                    <CommandEmpty>No day found.</CommandEmpty>
                    <CommandGroup>
                      {["weekday", "weekend"].map((day) => (
                        <CommandItem
                          key={day}
                          onSelect={() =>
                            setEditingTypePay((prev) =>
                              prev ? { ...prev, day } : null
                            )
                          }
                        >
                          <Check
                            className={cn("mr-2 h-4 w-4")}
                          />
                          {day}
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
              value={editingTypePay?.shift || ""}
              onChange={(e) =>
                setEditingTypePay((prev) =>
                  prev ? { ...prev, shift: e.target.value } : null
                )
              }
              className="mb-4"
            />

            <Input
              type="number"
              placeholder="Pay"
              value={editingTypePay?.pay || ""}
              onChange={(e) =>
                setEditingTypePay((prev) =>
                  prev ? { ...prev, pay: Number(e.target.value) } : null
                )
              }
              className="mb-4"
            />

            <DialogFooter>
              <Button variant="secondary" onClick={() => setEditingTypePay(null)}>
                Cancel
              </Button>
              <Button onClick={router.refresh}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default PayrollList;
