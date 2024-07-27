"use client";

import { useState } from "react";
import { payroll, user } from "@prisma/client";
import UpdatePayrollDialog from "./UpdatePayrollDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type PayrollListProps = {
  members: payroll[];
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
        location.reload(); // Reload method page to show method updated payroll
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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Weekday Payment</TableHead>
            <TableHead>Weekend Payment</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMembers.map((items: payroll) => (
            <TableRow key={items.payrollid}>
              <TableCell>
                {userMap[items.userId]?.first_name}&nbsp;{userMap[items.userId]?.last_name}
              </TableCell>
              <TableCell>{items.weekday}</TableCell>
              <TableCell>{items.weekend}</TableCell>
              <TableCell className="flex gap-5 flex-wrap">
                <Button
                  onClick={() =>
                    setSelectedUser({
                      userId: items.userId,
                      weekday: items.weekday,
                      weekend: items.weekend,
                    })
                  }
                  className="mr-2"
                >
                  Edit Pay
                </Button>
                <Button onClick={() => handleDelete(items.userId, items.eventid)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
