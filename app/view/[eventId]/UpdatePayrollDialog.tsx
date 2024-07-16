"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";

type UpdatePayrollDialogProps = {
  userId: string;
  initialWeekday: number;
  initialWeekend: number;
  onClose: () => void;
  onUpdate: () => void;
};

const UpdatePayrollDialog: React.FC<UpdatePayrollDialogProps> = ({
  userId,
  initialWeekday,
  initialWeekend,
  onClose,
  onUpdate,
}) => {
  const [weekday, setWeekday] = useState<number>(initialWeekday);
  const [weekend, setWeekend] = useState<number>(initialWeekend);
  const [error, setError] = useState<string>("");

  const handleUpdatePayroll = async () => {
    try {
      const response = await fetch("/api/update-payroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          weekday,
          weekend,
        }),
      });

      if (response.ok) {
        setError("");
        onUpdate();
        onClose();
      } else {
        const data = await response.json();
        setError(data.error);
      }
      toast.success("Updated Shift")
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose} >
      <DialogContent className="text-base-content bg-base-200 p-5">
        <DialogHeader>
          <DialogTitle>Update Shift</DialogTitle>
          <DialogDescription>
            Make changes to the payroll here. Click save when you&apos;re done.
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
          <Button onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdatePayrollDialog;
