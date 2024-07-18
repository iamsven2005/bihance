"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type AddPayrollProps = {
  eventId: string;
};

const AddPayroll: React.FC<AddPayrollProps> = ({ eventId }) => {
  const [email, setEmail] = useState("");
  const [weekday, setWeekday] = useState("");
  const [weekend, setWeekend] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleAddPayroll = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/add-payroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          weekday: parseInt(weekday),
          weekend: parseInt(weekend),
          eventId,
        }),
      });

      if (response.ok) {
        setEmail("");
        setWeekday("");
        setWeekend("");
        setError("");
        router.refresh(); // Refresh the page to show the updated payroll
      } else {
        const data = await response.json();
        setError(data.error);
      }
      toast.success("Added payroll")
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <form onSubmit={handleAddPayroll} className="flex flex-wrap gap-4">
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <label htmlFor="email">User Email:</label>
        <Input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="weekday">Weekday Payment:</label>
        <Input
          type="number"
          id="weekday"
          name="weekday"
          value={weekday}
          onChange={(e) => setWeekday(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="weekend">Weekend Payment:</label>
        <Input
          type="number"
          id="weekend"
          name="weekend"
          value={weekend}
          onChange={(e) => setWeekend(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="btn">Add Shift</Button>
    </form>
  );
};

export default AddPayroll;
