import { useCallback, useEffect, useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import { FiUsers, FiCalendar, FiDollarSign, FiTrendingUp, FiDownload, FiUserPlus, FiSearch } from "react-icons/fi";
import StatCard from "../../components/StatCard";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../contexts/ToastContext";
import LoadingModal from "../../components/LoadingModal";
import { getPrayerRequests } from "../../api/admin-dashboard-apis";
import AddPrayerRequestModal from "../../components/modals/AddPrayerRequestModal";
import type { PrayerRequestResponse } from "../../constants/basic-types";

interface Stat {
  id: number;
  title: string;
  value: string | number;
  icon: JSX.Element;
}

const PrayerRequestPage: React.FC = () => {
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequestResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Table State
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  const fetchPrayerRequests = async () => {
    setLoading(true);
    try {
      const response = await getPrayerRequests({ token: accessToken! });
      setPrayerRequests(response);
    } catch (error) {
      handleApiError(error)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrayerRequests();
  }, []);

  // Filter Logic
  const filteredRequests = prayerRequests.filter((request) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      request.title.toLowerCase().includes(searchLower) ||
      request.member.full_name.toLowerCase().includes(searchLower) ||
      (request.minister?.full_name.toLowerCase().includes(searchLower) ?? false)
    );
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredRequests.slice(startIndex, startIndex + itemsPerPage);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const stats: Stat[] = [
    { id: 1, title: "Total Requests", value: prayerRequests.length, icon: <FiUsers className="w-6 h-6 text-main-orange" /> },
    { id: 2, title: "Pending", value: prayerRequests.filter(r => r.status === 'pending').length, icon: <FiCalendar className="w-6 h-6 text-main-orange" /> },
    { id: 3, title: "Answered", value: prayerRequests.filter(r => r.status === 'answered').length, icon: <FiDollarSign className="w-6 h-6 text-main-orange" /> }, // Assuming 'answered' status exists
    { id: 4, title: "Urgent", value: prayerRequests.filter(r => r.priority === 'urgent').length, icon: <FiTrendingUp className="w-6 h-6 text-main-orange" /> },
  ];

  const handleViewRequest = (id: number) => {
    navigate(`${id}`);
  };

  return (
    <div className="flex flex-col gap-4">
      <LoadingModal isLoading={loading} />
      <AddPrayerRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchPrayerRequests}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Prayer Requests</h1>
          <p className="text-gray-500 mt-1">
            Manage and respond to prayer requests from members
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
            <FiUserPlus className="mr-2" /> Add New Prayer Request
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.id} title={stat.title} value={stat.value} icon={stat.icon} />
        ))}
      </div>

      {/* Prayer Requests Table Section */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-900">All Prayer Requests</h2>

            <div className="relative w-full md:w-64">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search requests..."
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
                <th className="px-6 py-4 font-medium">Title / Category</th>
                <th className="px-6 py-4 font-medium">Minister</th>
                <th className="px-6 py-4 font-medium">Priority</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentItems.length > 0 ? (
                currentItems.map((request) => (
                  <tr
                    key={request.id}
                    className="hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => handleViewRequest(request.id)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">
                          {request.is_anonymous ? "Anonymous" : request.member.full_name}
                        </span>
                        {!request.is_anonymous && (
                          <span className="text-sm text-gray-500">{request.member.email}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{request.title}</span>
                        <span className="text-sm text-gray-500 capitalize">{request.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {request.minister ? (
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">{request.minister.full_name}</span>
                          <span className="text-sm text-gray-500">{request.minister.title}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${request.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                          request.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                            request.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'}`}>
                        {request.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900">{new Date(request.created_at).toLocaleDateString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${(request.status === 'answered' || request.status === 'closed') ? 'bg-green-100 text-green-800' :
                          (request.status === 'praying' || request.status === 'pending') ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'}`}>
                        {request.status_display || request.status || 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No prayer requests found matching your search.
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

export default PrayerRequestPage;
