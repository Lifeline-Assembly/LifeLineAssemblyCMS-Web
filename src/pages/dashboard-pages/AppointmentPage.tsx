import { useCallback, useEffect, useState, type JSX } from "react";
import { FiUsers, FiCalendar, FiDollarSign, FiTrendingUp, FiDownload, FiUserPlus, FiSearch } from "react-icons/fi";
import StatCard from "../../components/StatCard";
import LoadingModal from "../../components/LoadingModal";
import { useToast } from "../../contexts/ToastContext";
import { useAuth } from "../../hooks/useAuth";
import { getAppointments } from "../../api/admin-dashboard-apis";
import AddAppointmentModal from "../../components/modals/AddAppointmentModal";
import AppointmentDetailsModal from "../../components/modals/AppointmentDetailsModal";
import type { AppointmentResponse } from "../../constants/basic-types";

interface Stat {
  id: number;
  title: string;
  value: string | number;
  icon: JSX.Element;
}

const AppointmentPage: React.FC = () => {
  const { accessToken } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);

  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);

  // Table State
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter Logic
  const filteredAppointments = appointments.filter((appointment) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      appointment.member.full_name.toLowerCase().includes(searchLower) ||
      appointment.minister.full_name.toLowerCase().includes(searchLower) ||
      appointment.subject.toLowerCase().includes(searchLower)
    );
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredAppointments.slice(startIndex, startIndex + itemsPerPage);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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

  const stats: Stat[] = [
    { id: 1, title: "Total Appointments", value: appointments.length, icon: <FiUsers className="w-6 h-6 text-main-orange" /> },
    { id: 2, title: "Pending", value: appointments.filter(a => a.status === 'pending').length, icon: <FiCalendar className="w-6 h-6 text-main-orange" /> },
    { id: 3, title: "Approved", value: appointments.filter(a => a.status === 'approved').length, icon: <FiDollarSign className="w-6 h-6 text-main-orange" /> },
    { id: 4, title: "Completed", value: appointments.filter(a => a.status === 'completed').length, icon: <FiTrendingUp className="w-6 h-6 text-main-orange" /> },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentResponse | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const handleRowClick = (appointment: AppointmentResponse) => {
    setSelectedAppointment(appointment);
    setIsDetailsModalOpen(true);
  };

  const handleGetAppointments = async () => {
    setLoading(true);
    try {
      const res: AppointmentResponse[] = await getAppointments({ token: accessToken! });
      setAppointments(res);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    handleGetAppointments();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <LoadingModal isLoading={loading} />
      <AddAppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleGetAppointments}
      />
      <AppointmentDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        appointment={selectedAppointment}
      />
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Pastor Management</h1>
          <p className="text-gray-500 mt-1">
            Manage branch pastors and their assignments effectively
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-2">
          <button className="flex items-center bg-white border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50 transition">
            <FiDownload className="mr-2" /> Export
          </button>

          <button
            className="flex items-center bg-main-orange text-white rounded-md px-4 py-2 hover:bg-orange-300 transition"
            onClick={() => setIsModalOpen(true)}
          >
            <FiUserPlus className="mr-2" /> Add New Appointment
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.id} title={stat.title} value={stat.value} icon={stat.icon} />
        ))}
      </div>

      {/* Appointments Table Section */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-900">All Appointments</h2>

            <div className="relative w-full md:w-64">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search Appointment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main-orange focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Member</th>
                <th className="px-6 py-4 font-medium">Minister</th>
                <th className="px-6 py-4 font-medium">Subject / Type</th>
                <th className="px-6 py-4 font-medium">Date & Time</th>
                <th className="px-6 py-4 font-medium">Status</th>
                {/* <th className="px-6 py-4 font-medium text-right">Actions</th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentItems.length > 0 ? (
                currentItems.map((appointment) => (
                  <tr
                    key={appointment.id}
                    className="hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => handleRowClick(appointment)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{appointment.member.full_name}</span>
                        <span className="text-sm text-gray-500">{appointment.member.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{appointment.minister.full_name}</span>
                        <span className="text-sm text-gray-500">{appointment.minister.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{appointment.subject}</span>
                        <span className="text-sm text-gray-500 capitalize">{appointment.appointment_type_display || appointment.appointment_type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-gray-900">{new Date(appointment.preferred_date).toLocaleDateString()}</span>
                        <span className="text-sm text-gray-500">{appointment.preferred_time}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${appointment.status === 'approved' ? 'bg-green-100 text-green-800' :
                          appointment.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'}`}>
                        {appointment.status_display || appointment.status}
                      </span>
                    </td>
                    {/* <td className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-main-orange transition">
                        <FiMoreVertical className="w-5 h-5" />
                      </button>
                    </td> */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No appointments found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentPage;
