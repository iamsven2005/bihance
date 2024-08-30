"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast } from "sonner";

interface EditTemplateProps {
  params: {
    Id: string;
  };
  onEditSuccess: () => void;
  onClose: () => void; // Add the onClose prop to handle closing the modal
}

const EditTemplate = ({ params, onEditSuccess, onClose }: EditTemplateProps) => {
  const [name, setName] = useState("");
  const [day, setDay] = useState("weekday");
  const [shift, setShift] = useState("hour");
  const [pay, setPay] = useState<number | "">("");

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const { data } = await axios.get(`/api/typepay-template/${params.Id}`);
        const template = data.template;
        setName(template.name);
        setDay(template.day);
        setShift(template.shift);
        setPay(template.pay);
      } catch (error) {
        toast.error("Failed to load template");
      }
    };

    fetchTemplate();
  }, [params.Id]);

  const handleEditTemplate = async () => {
    try {
      await axios.patch(`/api/typepay-template/${params.Id}`, {
        name,
        day,
        shift,
        pay,
      });

      toast.success("Template updated successfully");
      onEditSuccess(); // Trigger any post-edit actions
    } catch (error) {
      toast.error("Failed to update template");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className=" p-5 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-3">Edit Template</h2>

        <Input
          type="text"
          placeholder="Template Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-4"
        />
        <Input
          type="text"
          placeholder="Day"
          value={day}
          onChange={(e) => setDay(e.target.value)}
          className="mb-4"
        />
        <Input
          type="text"
          placeholder="Shift"
          value={shift}
          onChange={(e) => setShift(e.target.value)}
          className="mb-4"
        />
        <Input
          type="number"
          placeholder="Pay"
          value={pay}
          onChange={(e) => setPay(e.target.value === "" ? "" : Number(e.target.value))}
          className="mb-4"
        />

        <div className="flex justify-end space-x-2">
          <Button onClick={handleEditTemplate}>Save Changes</Button>
          <Button onClick={onClose} variant="secondary">Cancel</Button>
        </div>
      </div>
    </div>
  );
};

export default EditTemplate;
