"use client";

import { useState } from "react";
import { payroll, user } from "@prisma/client";
import UpdatePayrollDialog from "./UpdatePayrollDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

  const filteredMembers = members.filter((item) => {
    const user = userMap[item.userId];
    const fullName = `${user?.first_name} ${user?.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <Input
        type="text"
        placeholder="Search pay by name"
        value={searchTerm}
        onChange={handleSearchChange}
        className="input input-primary"
      />
      {filteredMembers.map((items: payroll) => (
        <div key={items.payrollid} className="flex flex-row justify-between p-5">
          <h2>{userMap[items.userId]?.last_name}&nbsp;{userMap[items.userId]?.first_name}</h2>
          <p>Weekday Payment: {items.weekday}</p>
          <p>Weekend Payment: {items.weekend}</p>
          <Button onClick={() => setSelectedUser({ userId: items.userId, weekday: items.weekday, weekend: items.weekend })} className="btn btn-outline">
            Edit Pay
          </Button>
        </div>
      ))}
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
