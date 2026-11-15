import React, { useCallback, useState } from "react";
import ReusableModal from "./ReusableModal";
import MemberSelect from "../inputs/MemberSelect";
import RegularInputField from "../inputs/RegularInputField";
import { createStaff } from "../../api/admin-dashboard-apis";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../contexts/ToastContext";
import type { CreateStaffResponse } from "../../constants/basic-types";

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddStaffModal: React.FC<AddStaffModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { accessToken } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [branchDisabled] = useState(true);

  const handleApiError = useCallback((error: unknown) => {
    if (error && typeof error === "object" && "non_field_errors" in error) {
      const mainError = error as { non_field_errors: string };
      showToast(mainError.non_field_errors, "error");
    } else if (error && typeof error === "object" && "detail" in error) {
      const mainError = error as { detail: string };
      showToast(mainError.detail, "error");
    } else {
      // fallback for unexpected errors
      showToast("An unexpected error occurred.", "error");
    }
  }, [showToast]);

  const [formData, setFormData] = useState<{ user_id: number; position: string; branch?: string; }>({
    user_id: 0,
    position: "",
    branch: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMemberSelect = (memberId: number) => {
    setFormData((prev) => ({ ...prev, user_id: memberId }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.user_id) {
      showToast("Please select a member", "error");
      return;
    }
    if (!formData.position) {
      showToast("Please enter a position", "error");
      return;
    }

    setLoading(true);
    try {
      // Map branch string to number if backend expects number, or keep as is based on API
      // Assuming branch is an ID or enum value. For now passing as is or mapping.
      // The API definition expects a number for branch.
      // Let's assume the select values are numbers in string format.
      const branchId: number | undefined = parseInt(formData.branch || "");

      const res: CreateStaffResponse = await createStaff({
        token: accessToken!,
        user_id: formData.user_id,
        position: formData.position,
        branch: branchId ? (isNaN(branchId) ? 1 : branchId) : undefined, // Default or handle error. 
        // Note: In a real app, we'd fetch branches. For now using the static list from pages.
      });
      showToast(res.message || "Staff member added successfully", "success");
      onSuccess();
      onClose();
      // Reset form
      setFormData({ user_id: 0, position: "", branch: "" });
    } catch (error) {
      handleApiError(error);
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ReusableModal isOpen={isOpen} onClose={onClose} title="Add New Staff">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <MemberSelect
          label="Select Member"
          onSelect={handleMemberSelect}
        />

        <RegularInputField
          label="Position"
          placeholder="e.g. Choir Director"
          value={formData.position}
          name="position"
          onChange={handleChange}
        />

        <div className="flex flex-col space-y-1">
          <label className="font-normal text-base text-[#383838]">Branch</label>
          <select
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            disabled={branchDisabled}
            className={`w-full p-3 rounded-[5px] border-[1px] ${branchDisabled ? 'bg-gray-100 text-gray-300' : 'bg-white'} border-[#EAECF0] focus:outline-none focus:ring-2 focus:ring-main-orange`}
          >
            <option value="">Select Branch</option>
            {/* Using arbitrary IDs for branches as placeholders */}
            <option value="1">North Branch</option>
            <option value="2">South Branch</option>
            <option value="3">East Branch</option>
            <option value="4">West Branch</option>
          </select>
          {branchDisabled && <p className="text-sm text-blue-400">Brach selection is disabled for now</p>}
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
            {loading ? "Adding..." : "Add Staff"}
          </button>
        </div>
      </form>
    </ReusableModal>
  );
};

export default AddStaffModal;
