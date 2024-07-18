"use client";

import React from "react";
import { AttendanceRow, exportToCsv } from "./exportToCsv";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface ExportButtonProps {
  data: AttendanceRow[];
  filename: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({ data, filename }) => {
  const handleExport = () => {
    exportToCsv(filename, data);
    toast.success("Exported")
  };

  return (
    <Button onClick={handleExport} className="btn btn-outline">
      Export as CSV
    </Button>
  );
};

export default ExportButton;
