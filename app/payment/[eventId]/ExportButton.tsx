"use client";

import React from "react";
import { AttendanceRow, exportToCsv } from "./exportToCsv";
import { toast } from "sonner";

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
    <button onClick={handleExport} className="px-4 py-2 bg-blue-500 text-white rounded">
      Export as CSV
    </button>
  );
};

export default ExportButton;
