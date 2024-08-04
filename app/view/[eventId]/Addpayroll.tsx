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

      const data = await response.json();
      if (response.ok) {
        setEmail("");
        setWeekday("");
        setWeekend("");
        setError("");
        router.refresh(); // Refresh the page to show the updated payroll
        toast.success("Added payroll");
      } else {
        setError(data.error);
        toast.error(data.error);
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <form onSubmit={handleAddPayroll} className="flex flex-wrap gap-4 m-5">
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
      <Button type="submit">Add Shift</Button>
    </form>
  );
};

export default AddPayroll;
