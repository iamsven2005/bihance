"use client";

import { useState } from "react";
import { payroll, user } from "@prisma/client";
import UpdatePayrollDialog from "./UpdatePayrollDialog";
import { Button } from "@/components/ui/button";

type PayrollListProps = {
  members: payroll[];
  userMap: Record<string, user>;
};

const PayrollList: React.FC<PayrollListProps> = ({ members, userMap }) => {
  const [selectedUser, setSelectedUser] = useState<{
    userId: string;
    weekday: number;
    weekend: number;
  } | null>(null);

  const handleUpdate = () => {
    location.reload(); // Refresh logic to update the payroll list
  };

  return (
    <div>
      {members.map((items: payroll) => (
        <div key={items.payrollid}>
          <h2>{userMap[items.userId]?.name}</h2>
          <p>Weekday Payment: {items.weekday}</p>
          <p>Weekend Payment: {items.weekend}</p>
          <Button onClick={() => setSelectedUser({ userId: items.userId, weekday: items.weekday, weekend: items.weekend })}>
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
