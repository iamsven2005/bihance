"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast } from "sonner";

interface Template {
  id: string;
  name: string;
  day: string;
  shift: string;
  pay: number;
}

const TemplatesPage = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [name, setName] = useState("");
  const [day, setDay] = useState("weekday");
  const [shift, setShift] = useState("hour");
  const [pay, setPay] = useState<number | "">("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentTemplateId, setCurrentTemplateId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDay, setEditDay] = useState("weekday");
  const [editShift, setEditShift] = useState("hour");
  const [editPay, setEditPay] = useState<number | "">("");

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const { data } = await axios.get("/api/typepay-template");
        setTemplates(data.templates);
      } catch (error) {
        toast.error("Failed to fetch templates");
      }
    };

    fetchTemplates();
  }, []);

  const handleCreateTemplate = async () => {
    try {
      const { data } = await axios.post("/api/typepay-template", {
        name,
        day,
        shift,
        pay,
      });

      setTemplates([...templates, data.template]);
      setName("");
      setDay("weekday");
      setShift("hour");
      setPay("");
      toast.success("Template created successfully");
    } catch (error) {
      toast.error("Failed to create template");
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      await axios.delete(`/api/typepay-template/${templateId}`);
      setTemplates(templates.filter((template) => template.id !== templateId));
      toast.success("Template deleted successfully");
    } catch (error) {
      toast.error("Failed to delete template");
    }
  };

  const handleEditClick = async (templateId: string) => {
    setCurrentTemplateId(templateId);
    try {
      const { data } = await axios.get(`/api/typepay-template/${templateId}`);
      const template = data.template;
      setEditName(template.name);
      setEditDay(template.day);
      setEditShift(template.shift);
      setEditPay(template.pay);
      setIsEditModalOpen(true);
    } catch (error) {
      toast.error("Failed to load template");
    }
  };

  const handleEditTemplate = async () => {
    if (!currentTemplateId) return;

    try {
      await axios.patch(`/api/typepay-template/${currentTemplateId}`, {
        name: editName,
        day: editDay,
        shift: editShift,
        pay: editPay,
      });

      toast.success("Template updated successfully");
      setIsEditModalOpen(false);
      setCurrentTemplateId(null);

      const { data } = await axios.get("/api/typepay-template");
      setTemplates(data.templates);
    } catch (error) {
      toast.error("Failed to update template");
    }
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setCurrentTemplateId(null);
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">Manage Typepay Templates</h1>

      <div className="mb-5">
        <Input
          type="text"
          placeholder="Template Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Day"
          value={day}
          onChange={(e) => setDay(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Shift"
          value={shift}
          onChange={(e) => setShift(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Pay"
          value={pay}
          onChange={(e) => setPay(e.target.value === "" ? "" : Number(e.target.value))}
        />
        <Button onClick={handleCreateTemplate}>Create Template</Button>
      </div>

      <h2 className="text-xl font-semibold mb-3">Existing Templates</h2>
      <ul>
        {templates.map((template) => (
          <li key={template.id} className="mb-2">
            <div className="flex justify-between items-center">
              <span>{template.name}</span>
              <div>
                <Button onClick={() => handleEditClick(template.id)} variant="secondary">
                  Edit
                </Button>
                <Button
                  onClick={() => handleDeleteTemplate(template.id)}
                  variant="destructive"
                  className="ml-2"
                >
                  Delete
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-5 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-3">Edit Template</h2>

            <Input
              type="text"
              placeholder="Template Name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="mb-4"
            />
            <Input
              type="text"
              placeholder="Day"
              value={editDay}
              onChange={(e) => setEditDay(e.target.value)}
              className="mb-4"
            />
            <Input
              type="text"
              placeholder="Shift"
              value={editShift}
              onChange={(e) => setEditShift(e.target.value)}
              className="mb-4"
            />
            <Input
              type="number"
              placeholder="Pay"
              value={editPay}
              onChange={(e) => setEditPay(e.target.value === "" ? "" : Number(e.target.value))}
              className="mb-4"
            />

            <div className="flex justify-end space-x-2">
              <Button onClick={handleEditTemplate}>Save Changes</Button>
              <Button onClick={handleCloseModal} variant="secondary">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplatesPage;
