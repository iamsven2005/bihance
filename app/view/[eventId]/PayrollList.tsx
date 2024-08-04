"use client";

import { useState } from "react";
import { payroll, typepay, user } from "@prisma/client";
import UpdatePayrollDialog from "./UpdatePayrollDialog";
import AddTypePayDialog from "./AddType"; // Ensure this import is correct
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

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
  const handleUpdate = () => {
    location.reload();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  const router = useRouter()
  const handleDelete = async (userId: string, eventId: string) => {
    try {
      const response = await fetch("/api/add-payroll", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userIdToDelete: userId,
          eventId,
        }),
      });

      if (response.ok) {
        toast.success("Deleted payroll entry");
        router.refresh()
      } else {
        const data = await response.json();
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };
  const handletypeDelete = async (typeid: string) => {
    try {
      const response = await fetch(`/api/add-payroll/${typeid}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        }
      });

      if (response.ok) {
        toast.success("Deleted payroll entry");
        router.refresh()
      } else {
        const data = await response.json();
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
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
      />

      {filteredMembers.map((payrollItem) => {
        const user = userMap[payrollItem.userId];
        return (
          <Card key={payrollItem.payrollid}>
            <CardHeader>
            <CardTitle>
              {user?.first_name}
              &nbsp;
              {user?.last_name}
            </CardTitle>
            </CardHeader>
            
            {payrollItem.typepay.map((typepayItem) => (
              <CardContent key={typepayItem.typeid}>
                <CardDescription className="flex gap-5 flex-wrap">
                  <span>Day: {typepayItem.day}
                  </span>
                  <span>
                  Shift: {typepayItem.shift}
                  </span>
                  <span>
                  Pay: {typepayItem.pay}
                  </span>
                  <Button onClick={() => handletypeDelete(typepayItem.typeid)}>
              Delete
            </Button>
                </CardDescription>

                
              </CardContent>
            ))}
            <CardFooter>
            <Button onClick={() => handleDelete(payrollItem.userId, payrollItem.eventid)}>
              Delete
            </Button>
            <AddTypePayDialog
              payrollId={payrollItem.payrollid}
            />
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

    </div>
  );
};

export default PayrollList;
