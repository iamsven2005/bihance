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
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "axios";

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
      await axios.post("/api/update-payroll", {
        userId,
        weekday,
        weekend,
      });

      setError("");
      toast.success("Updated payroll successfully");
      onUpdate();
      onClose();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.error || "An error occurred. Please try again.");
      } else {
        setError("An error occurred. Please try again.");
      }
      toast.error("Failed to update payroll");
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="p-5">
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
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdatePayrollDialog;
