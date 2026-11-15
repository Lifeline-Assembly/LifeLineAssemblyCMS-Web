import React from "react";
import ReusableModal from "./ReusableModal";
import type { AppointmentResponse } from "../../constants/basic-types";
import { FiCalendar, FiClock, FiUser, FiBriefcase, FiAlignLeft, FiInfo } from "react-icons/fi";

interface AppointmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: AppointmentResponse | null;
}

const AppointmentDetailsModal: React.FC<AppointmentDetailsModalProps> = ({ isOpen, onClose, appointment }) => {
  if (!appointment) return null;

  return (
    <ReusableModal isOpen={isOpen} onClose={onClose} title="Appointment Details">
      <div className="flex flex-col gap-6">
        {/* Header Info */}
        <div className="flex flex-col gap-2 border-b border-gray-100 pb-4">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-semibold text-gray-900">{appointment.subject}</h3>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize ${appointment.status === 'approved' ? 'bg-green-100 text-green-800' :
              appointment.status === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'}`}>
              {appointment.status_display || appointment.status}
            </span>
          </div>
          <span className="text-sm text-gray-500 capitalize flex items-center gap-2">
            <FiInfo className="w-4 h-4" />
            {appointment.appointment_type_display || appointment.appointment_type}
          </span>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <FiAlignLeft className="w-4 h-4" /> Description
          </h4>
          <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-3 rounded-md">
            {appointment.description || "No description provided."}
          </p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Date & Time */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-medium text-gray-700 border-b border-gray-100 pb-1">Schedule</h4>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <FiCalendar className="w-4 h-4 text-gray-400" />
              <div className="flex flex-col">
                <span className="text-xs text-gray-400">Preferred Date</span>
                <span>{new Date(appointment.preferred_date).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <FiClock className="w-4 h-4 text-gray-400" />
              <div className="flex flex-col">
                <span className="text-xs text-gray-400">Preferred Time</span>
                <span>{appointment.preferred_time}</span>
              </div>
            </div>
          </div>

          {/* People Involved */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-medium text-gray-700 border-b border-gray-100 pb-1">Participants</h4>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <FiUser className="w-4 h-4 text-gray-400" />
              <div className="flex flex-col">
                <span className="text-xs text-gray-400">Member</span>
                <span className="font-medium">{appointment.member.full_name}</span>
                <span className="text-xs">{appointment.member.email}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <FiBriefcase className="w-4 h-4 text-gray-400" />
              <div className="flex flex-col">
                <span className="text-xs text-gray-400">Minister</span>
                <span className="font-medium">{appointment.minister.full_name}</span>
                <span className="text-xs">{appointment.minister.title}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </ReusableModal>
  );
};

export default AppointmentDetailsModal;
