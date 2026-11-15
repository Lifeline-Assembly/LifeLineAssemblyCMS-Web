import { useCallback, useEffect, useState, useMemo, type JSX } from "react";
import { FiUsers, FiCalendar, FiDollarSign, FiTrendingUp, FiDownload, FiUserPlus, FiSearch, FiEdit, FiTrash2 } from "react-icons/fi";
import StatCard from "../../components/StatCard";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../contexts/ToastContext";
import { getMinisters } from "../../api/admin-dashboard-apis";
import type { MinisterPropType } from "../../constants/basic-types";
import LoadingModal from "../../components/LoadingModal";
import AddPastorModal from "../../components/modals/AddPastorModal";

interface Stat {
  id: number;
  title: string;
  value: string | number;
  icon: JSX.Element;
}

const PastorsPage: React.FC = () => {
  const { accessToken } = useAuth();
  const { showToast } = useToast();
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [pastors, setPastors] = useState<MinisterPropType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isAddPastorModalOpen, setIsAddPastorModalOpen] = useState(false);

  // Table State
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

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
    { id: 1, title: "Pastor Assignments", value: 12, icon: <FiUsers className="w-6 h-6 text-main-orange" /> },
    { id: 2, title: "Attendance Rate", value: "85%", icon: <FiCalendar className="w-6 h-6 text-main-orange" /> },
    { id: 3, title: "Donation Oversight", value: "$18,500", icon: <FiDollarSign className="w-6 h-6 text-main-orange" /> },
    { id: 4, title: "Event Leadership", value: 8, icon: <FiTrendingUp className="w-6 h-6 text-main-orange" /> },
  ];

  const getAllPastors = async () => {
    setLoading(true);
    try {
      const res: MinisterPropType[] = await getMinisters({ token: accessToken! });
      setPastors(res);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  }

  // Filter and Pagination
  const filteredPastors = useMemo(() => {
    return pastors.filter(pastor => {
      const fullName = pastor.full_name.toLowerCase();
      const searchLower = searchTerm.toLowerCase();
      const email = pastor.user.email?.toLowerCase() || "";
      const phone = pastor.user.phone_number.toLowerCase();

      return (
        fullName.includes(searchLower) ||
        email.includes(searchLower) ||
        phone.includes(searchLower)
      );
    });
  }, [pastors, searchTerm]);

  const paginatedPastors = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPastors.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPastors, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredPastors.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  useEffect(() => {
    getAllPastors();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <LoadingModal isLoading={loading} />
      <AddPastorModal
        isOpen={isAddPastorModalOpen}
        onClose={() => setIsAddPastorModalOpen(false)}
        onSuccess={getAllPastors}
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
          <select
            className="border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50 transition"
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
          >
            <option value="">Select Branch</option>
            <option value="north">North Branch</option>
            <option value="south">South Branch</option>
            <option value="east">East Branch</option>
            <option value="west">West Branch</option>
          </select>

          <button className="flex items-center bg-white border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50 transition">
            <FiDownload className="mr-2" /> Export
          </button>

          <button
            className="flex items-center bg-main-orange text-white rounded-md px-4 py-2 hover:bg-orange-300 transition"
            onClick={() => setIsAddPastorModalOpen(true)}
          >
            <FiUserPlus className="mr-2" /> Add New Pastor
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.id} title={stat.title} value={stat.value} icon={stat.icon} />
        ))}
      </div>

      {/* Pastors Table Section */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-900">All Pastors</h2>

            <div className="relative w-full md:w-64">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search pastors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main-orange focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appoint Minister</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedPastors.length > 0 ? (
                paginatedPastors.map((pastor) => (
                  <tr key={pastor.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold">
                          {pastor.full_name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{pastor.full_name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{pastor.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{pastor.branch || "N/A"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{pastor.user.email || "No email"}</div>
                      <div className="text-sm text-gray-500">{pastor.user.phone_number}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className={`px-4 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-main-orange text-white cursor-pointer`}>
                        Assign
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-3">
                        <button
                          className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                          title="Edit"
                        >
                          <FiEdit className="w-5 h-5" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900 flex items-center gap-1"
                          title="Delete"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    No pastors found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {paginatedPastors.length} of {filteredPastors.length} pastors
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PastorsPage;
