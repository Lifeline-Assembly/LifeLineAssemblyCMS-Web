import React, { useCallback, useState } from "react";
import ReusableModal from "./ReusableModal";
import MinisterSelect from "../inputs/MinisterSelect";
import RegularInputField from "../inputs/RegularInputField";
import RegularTextArea from "../inputs/RegularTextArea";
import { createAppointment } from "../../api/admin-dashboard-apis";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../contexts/ToastContext";
import type { AppointmentType } from "../../constants/basic-types";

interface AddAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const APPOINTMENT_TYPES: { label: string; value: AppointmentType }[] = [
  { label: "Counseling", value: "counseling" },
  { label: "Spiritual Guidance", value: "spiritual_guidance" },
  { label: "Marriage Issues", value: "marriage_issues" },
  { label: "Family Matters", value: "family_matters" },
  { label: "General", value: "general" },
  { label: "Other", value: "other" },
];

const AddAppointmentModal: React.FC<AddAppointmentModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { accessToken } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<{
    minister_id: number;
    appointment_type: AppointmentType | "";
    subject: string;
    description: string;
    preferred_date: string;
    preferred_time: string;
  }>({
    minister_id: 0,
    appointment_type: "",
    subject: "",
    description: "",
    preferred_date: "",
    preferred_time: "",
  });

  const handleApiError = useCallback((error: unknown) => {
    if (error && typeof error === "object" && "non_field_errors" in error) {
      const mainError = error as { non_field_errors: string };
      showToast(mainError.non_field_errors, "error");
    } else if (error && typeof error === "object" && "detail" in error) {
      const mainError = error as { detail: string };
      showToast(mainError.detail, "error");
    } else {
      showToast("An unexpected error occurred.", "error");
    }
  }, [showToast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMinisterSelect = (ministerId: number) => {
    setFormData((prev) => ({ ...prev, minister_id: ministerId }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.minister_id) {
      showToast("Please select a minister", "error");
      return;
    }
    if (!formData.appointment_type) {
      showToast("Please select an appointment type", "error");
      return;
    }
    if (!formData.subject) {
      showToast("Please enter a subject", "error");
      return;
    }
    if (!formData.description) {
      showToast("Please enter a description", "error");
      return;
    }
    if (!formData.preferred_date) {
      showToast("Please select a preferred date", "error");
      return;
    }
    if (!formData.preferred_time) {
      showToast("Please select a preferred time", "error");
      return;
    }

    setLoading(true);
    try {
      await createAppointment({
        token: accessToken!,
        data: {
          minister_id: formData.minister_id,
          appointment_type: formData.appointment_type as AppointmentType,
          subject: formData.subject,
          description: formData.description,
          preferred_date: formData.preferred_date,
          preferred_time: formData.preferred_time,
        },
      });
      showToast("Appointment created successfully", "success");
      onSuccess();
      onClose();
      // Reset form
      setFormData({
        minister_id: 0,
        appointment_type: "",
        subject: "",
        description: "",
        preferred_date: "",
        preferred_time: "",
      });
    } catch (error) {
      handleApiError(error);
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ReusableModal isOpen={isOpen} onClose={onClose} title="Add New Appointment">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <MinisterSelect
          label="Select Minister"
          onSelect={handleMinisterSelect}
        />

        <div className="flex flex-col space-y-1">
          <label className="font-normal text-base text-[#383838]">Appointment Type</label>
          <select
            name="appointment_type"
            value={formData.appointment_type}
            onChange={handleChange}
            className="w-full p-3 rounded-[5px] border-[1px] border-[#EAECF0] bg-white focus:outline-none focus:ring-2 focus:ring-main-orange"
          >
            <option value="">Select Type</option>
            {APPOINTMENT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <RegularInputField
          label="Subject"
          placeholder="e.g. Counseling Session"
          value={formData.subject}
          name="subject"
          onChange={handleChange}
        />

        <RegularTextArea
          label="Description"
          placeholder="Briefly describe the purpose of the appointment..."
          value={formData.description}
          name="description"
          onChange={handleChange}
        />

        <div className="grid grid-cols-2 gap-4">
          <RegularInputField
            label="Preferred Date"
            type="date"
            value={formData.preferred_date}
            name="preferred_date"
            onChange={handleChange}
          />
          <RegularInputField
            label="Preferred Time"
            type="time"
            value={formData.preferred_time}
            name="preferred_time"
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-main-orange text-white rounded-md hover:bg-orange-600 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Appointment"}
          </button>
        </div>
      </form>
    </ReusableModal>
  );
};

export default AddAppointmentModal;
