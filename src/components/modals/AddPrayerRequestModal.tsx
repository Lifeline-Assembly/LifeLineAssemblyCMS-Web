import React, { useCallback, useState } from "react";
import ReusableModal from "./ReusableModal";
import MinisterSelect from "../inputs/MinisterSelect";
import RegularInputField from "../inputs/RegularInputField";
import RegularTextArea from "../inputs/RegularTextArea";
import { createPrayerRequests } from "../../api/admin-dashboard-apis";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../contexts/ToastContext";
import type { PrayerRequestCreate } from "../../constants/basic-types";

interface AddPrayerRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CATEGORY_OPTIONS = [
  { label: "Health", value: "health" },
  { label: "Family", value: "family" },
  { label: "Finances", value: "finances" },
  { label: "Spiritual", value: "spiritual" },
  { label: "Relationship", value: "relationship" },
  { label: "Career", value: "career" },
  { label: "General", value: "general" },
  { label: "Thanksgiving", value: "thanksgiving" },
  { label: "Other", value: "other" },
];

const PRIORITY_OPTIONS = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Urgent", value: "urgent" },
];

const AddPrayerRequestModal: React.FC<AddPrayerRequestModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { accessToken } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<PrayerRequestCreate>({
    minister_id: undefined,
    category: "general",
    priority: "medium",
    title: "",
    description: "",
    is_anonymous: false,
  });

  const handleApiError = useCallback((error: unknown) => {
    if (error && typeof error === "object" && "non_field_errors" in error) {
      const mainError = error as { non_field_errors: string };
      showToast(mainError.non_field_errors, "error");
    } else if (error && typeof error === "object" && "detail" in error) {
      const mainError = error as { detail: string };
      showToast(mainError.detail, "error");
    } else if (error && typeof error === "object" && "error" in error) {
      const mainError = error as { error: string };
      showToast(mainError.error, "error");
    } else {
      showToast("An unexpected error occurred.", "error");
    }
  }, [showToast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleMinisterSelect = (ministerId: number) => {
    setFormData((prev) => ({ ...prev, minister_id: ministerId }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title) {
      showToast("Please enter a title", "error");
      return;
    }
    if (!formData.description) {
      showToast("Please enter a description", "error");
      return;
    }

    setLoading(true);
    try {
      await createPrayerRequests({
        token: accessToken!,
        data: formData,
      });
      showToast("Prayer request created successfully", "success");
      onSuccess();
      onClose();
      // Reset form
      setFormData({
        minister_id: undefined,
        category: "general",
        priority: "medium",
        title: "",
        description: "",
        is_anonymous: false,
      });
    } catch (error) {
      handleApiError(error);
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ReusableModal isOpen={isOpen} onClose={onClose} title="Add New Prayer Request">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <MinisterSelect
          label="Select Minister (Optional)"
          onSelect={handleMinisterSelect}
        />

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col space-y-1">
            <label className="font-normal text-base text-[#383838]">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 rounded-[5px] border-[1px] border-[#EAECF0] bg-white focus:outline-none focus:ring-2 focus:ring-main-orange"
            >
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col space-y-1">
            <label className="font-normal text-base text-[#383838]">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full p-3 rounded-[5px] border-[1px] border-[#EAECF0] bg-white focus:outline-none focus:ring-2 focus:ring-main-orange"
            >
              {PRIORITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <RegularInputField
          label="Title"
          placeholder="e.g. Prayer for healing"
          value={formData.title}
          name="title"
          onChange={handleChange}
        />

        <RegularTextArea
          label="Description"
          placeholder="Describe your prayer request..."
          value={formData.description}
          name="description"
          onChange={handleChange}
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_anonymous"
            name="is_anonymous"
            checked={formData.is_anonymous}
            onChange={handleChange}
            className="w-4 h-4 text-main-orange border-gray-300 rounded focus:ring-main-orange"
          />
          <label htmlFor="is_anonymous" className="text-sm text-gray-700">
            Submit Anonymously
          </label>
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
            {loading ? "Creating..." : "Create Request"}
          </button>
        </div>
      </form>
    </ReusableModal>
  );
};

export default AddPrayerRequestModal;
