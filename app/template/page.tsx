"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast } from "sonner";
import EditTemplate from "./EditTemplate";

interface Template {
  id: string;
  name: string;
  day: string;
  shift: string;
  pay: number;
}

const TemplatesPage = () => {
  const [templates, setTemplates] = useState<Template[]>([]); // State for templates
  const [name, setName] = useState("");
  const [day, setDay] = useState("weekday");
  const [shift, setShift] = useState("hour");
  const [pay, setPay] = useState<number | "">("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State to manage modal visibility
  const [currentTemplateId, setCurrentTemplateId] = useState<string | null>(null); // Current template being edited
  const router = useRouter(); // Initialize the router

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

  const handleEditClick = (templateId: string) => {
    setCurrentTemplateId(templateId); // Set the current template ID
    setIsEditModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false); // Close the modal
    setCurrentTemplateId(null); // Reset current template ID
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false); // Close the modal
    setCurrentTemplateId(null); // Reset current template ID
    const fetchTemplates = async () => {
      try {
        const { data } = await axios.get("/api/typepay-template");
        setTemplates(data.templates);
      } catch (error) {
        toast.error("Failed to fetch templates");
      }
    };

    fetchTemplates(); // Refresh the template list after edit
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

      {isEditModalOpen && currentTemplateId && (
        <EditTemplate
          params={{ Id: currentTemplateId }}
          onEditSuccess={handleEditSuccess}
          onClose={handleCloseModal} // Pass the function to close the modal
        />
      )}
    </div>
  );
};

export default TemplatesPage;
