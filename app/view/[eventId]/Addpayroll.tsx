"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";

type AddPayrollProps = {
  eventId: string;
};

const AddPayroll: React.FC<AddPayrollProps> = ({ eventId }) => {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleAddPayroll = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("/api/add-payroll", {
        email,
        eventId,
      });

      setEmail("");
      router.refresh(); // Refresh the page to show the updated payroll
      toast.success("Added payroll");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.error || "An error occurred. Please try again.");
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleAddPayroll} className="flex flex-wrap gap-4 m-5">
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
