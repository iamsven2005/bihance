"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import GetUser from "@/components/GetUser";

interface Template {
  id: string;
  name: string;
}

interface Payroll {
  payrollid: string;
  userId: string;
}

interface Props {
  eventId: string;
}

const AssignTemplatePage = ({ eventId }: Props) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: templateData } = await axios.get("/api/typepay-template");
        setTemplates(templateData.templates);

        const { data: payrollData } = await axios.get(`/api/events/${eventId}/payrolls`);
        setPayrolls(payrollData.payrolls);
      } catch (error) {
        toast.error("Failed to fetch data");
      }
    };

    fetchData();
  }, [eventId]);

  const handleAssignTemplate = async (payrollId: string) => {
    try {
      await axios.post("/api/assign-template", {
        payrollId,
        templateId: selectedTemplate,
      });

      toast.success("Template assigned successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to assign template");
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">Assign Typepay Template</h1>

      <select
        value={selectedTemplate}
        onChange={(e) => setSelectedTemplate(e.target.value)}
        className="mb-5"
      >
        <option value="" disabled>Select Template</option>
        {templates.map((template) => (
          <option key={template.id} value={template.id}>
            {template.name}
          </option>
        ))}
      </select>

      <h2 className="text-xl font-semibold mb-3">Payrolls</h2>
      <ul>
        {payrolls.map((payroll) => (
          <li key={payroll.payrollid} className="mb-2">
            <div className="flex justify-between items-center">
              <GetUser id={payroll.userId}/>
              <Button onClick={() => handleAssignTemplate(payroll.payrollid)}>
                Assign Template
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AssignTemplatePage;
