"use client";

import { useState } from "react";
import { payroll, typepay, user } from "@prisma/client";
import UpdatePayrollDialog from "./UpdatePayrollDialog";
import EditTypePayDialog from "./EditTypePayDialog";
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
import { useRouter } from "next/navigation";
import AddTypePayDialog from "./AddType";
import axios from "axios";

type PayrollListProps = {
  members: (payroll & { typepay: typepay[] })[]; // Ensure that typepay is associated with each payroll
  userMap: Record<string, user>;
};

const PayrollList: React.FC<PayrollListProps> = ({ members, userMap }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<{
    userId: string;
    weekday: number;
    weekend: number;
  } | null>(null);
  const [editingTypePay, setEditingTypePay] = useState<typepay | null>(null);

  const router = useRouter();

  const handleUpdate = () => {
    location.reload();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = async (userId: string, eventId: string) => {
    try {
      await axios.delete("/api/add-payroll", {
        data: { userIdToDelete: userId, eventId },
      });
      toast.success("Deleted payroll entry");
      router.refresh();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.error || "An error occurred. Please try again.");
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  const handleTypeDelete = async (typeid: string) => {
    try {
      await axios.delete(`/api/add-payroll/${typeid}`);
      toast.success("Deleted typepay entry");
      router.refresh();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.error || "An error occurred. Please try again.");
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  const filteredMembers = members.filter((item) => {
    const user = userMap[item.userId];
    const fullName = `${user?.first_name} ${user?.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="m-5">
      <Input
        type="text"
        placeholder="Search pay by name"
        value={searchTerm}
        onChange={handleSearchChange}
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
                  <span>Day: {typepayItem.day}</span>
                  <span>Pay Type: {typepayItem.shift}</span> {/* Replaced 'Shift' with the pay type */}
                  <span>Pay: {typepayItem.pay}</span>
                </CardDescription>
                <div className="flex gap-2">
                  <Button onClick={() => setEditingTypePay(typepayItem)}>Edit</Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleTypeDelete(typepayItem.typeid)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            ))}

            <CardFooter>
              <Button
                variant="destructive"
                onClick={() => handleDelete(payrollItem.userId, payrollItem.eventid)}
              >
                Delete
              </Button>
              <AddTypePayDialog payrollId={payrollItem.payrollid} />
            </CardFooter>
          </Card>
        );
      })}

      {selectedUser && (
        <UpdatePayrollDialog
          userId={selectedUser.userId}
          initialWeekday={selectedUser.weekday}
          initialWeekend={selectedUser.weekend}
          onClose={() => setSelectedUser(null)}
          onUpdate={handleUpdate}
        />
      )}

      {editingTypePay && (
        <EditTypePayDialog
          typepayId={editingTypePay.typeid}
          initialDay={editingTypePay.day}
          initialShift={editingTypePay.shift} // This will now hold the pay type
          initialPay={editingTypePay.pay}
          onClose={() => setEditingTypePay(null)}
          onUpdate={router.refresh} // Refresh the data after update
        />
      )}
    </div>
  );
};

export default PayrollList;
