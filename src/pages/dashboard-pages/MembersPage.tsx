import { useEffect, useState, useMemo, type JSX, useCallback } from "react";
import { FiUsers, FiCalendar, FiDollarSign, FiTrendingUp, FiDownload, FiUserPlus, FiSearch, FiCheck, FiX } from "react-icons/fi";
import StatCard from "../../components/StatCard";
import { approveMember, getAllMembers } from "../../api/admin-dashboard-apis";
import { useAuth } from "../../hooks/useAuth";
import type { Member } from "../../constants/basic-types";
import LoadingModal from "../../components/LoadingModal";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import { useToast } from "../../contexts/ToastContext";
import { convertToSpacedText } from "../../constants/app-logic";


interface Stat {
  id: number;
  title: string;
  value: string | number;
  icon: JSX.Element;
}

const MembersPage: React.FC = () => {
  const { accessToken, user } = useAuth();
  const { showToast } = useToast();
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [members, setMembers] = useState<Member[]>([]);

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

  // Table State
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Modal State
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);

  const stats: Stat[] = [
    { id: 1, title: "Membership Growth", value: 245, icon: <FiUsers className="w-6 h-6 text-main-orange" /> },
    { id: 2, title: "Attendance Rate", value: "78%", icon: <FiCalendar className="w-6 h-6 text-main-orange" /> },
    { id: 3, title: "Donation Growth", value: "$12,300", icon: <FiDollarSign className="w-6 h-6 text-main-orange" /> },
    { id: 4, title: "Event Engagement", value: 320, icon: <FiTrendingUp className="w-6 h-6 text-main-orange" /> },
  ];

  const getAllExistingMembers = async () => {
    setLoading(true);
    try {
      const response = await getAllMembers({ token: accessToken || '' });
      setMembers(response);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllExistingMembers();
  }, []);

  // Filter and Pagination
  const filteredMembers = useMemo(() => {
    return members.filter(member => {
      const fullName = `${member.firstname} ${member.lastname}`.toLowerCase();
      const searchLower = searchTerm.toLowerCase();

      return (
        fullName.includes(searchLower) ||
        member.email?.toLowerCase().includes(searchLower) ||
        member.phone_number.includes(searchLower)
      );
    });
  }, [members, searchTerm]);

  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredMembers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMembers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleAcceptClick = (id: number) => {
    setSelectedMemberId(id);
    setIsConfirmModalOpen(true);
  };

  const confirmAccept = async () => {
    if (selectedMemberId) {
      console.log("Accepting member:", selectedMemberId);
      setLoading(true);
      try {
        const res = await approveMember({ token: accessToken || '', member_id: selectedMemberId });
        console.log("Accepting member:", res);
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false)
      }
      // After success:
      setIsConfirmModalOpen(false);
      setSelectedMemberId(null);
      // refresh members list
      getAllExistingMembers();
    }
    setIsConfirmModalOpen(false);
  };

  const handleReject = (id: number) => {
    console.log("Rejecting member:", id);
    // TODO: Implement reject logic
  };

  return (
    <div className="flex flex-col gap-6">
      <LoadingModal isLoading={loading} />

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmAccept}
        title="Accept Member"
        message="Are you sure you want to accept this member? This will verify their membership."
        confirmText="Accept"
        cancelText="Cancel"
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Member Management</h1>
          <p className="text-gray-500 mt-1">
            Manage church membership and member information effectively
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

          <button className="flex items-center bg-main-orange text-white rounded-md px-4 py-2 hover:bg-orange-300 transition">
            <FiUserPlus className="mr-2" /> Add New Member
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.id} title={stat.title} value={stat.value} icon={stat.icon} />
        ))}
      </div>

      {/* Members Table Section */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-900">All Members</h2>

            <div className="relative w-full md:w-64">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search members..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verified</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedMembers.length > 0 ? (
                paginatedMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold">
                          {member.firstname[0]}{member.lastname[0]}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{member.firstname} {member.lastname}</div>
                          {user?.id === member.id && <div className="text-sm text-gray-500">{'Me'}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{member.email || "No email"}</div>
                      <div className="text-sm text-gray-500">{member.phone_number}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(member.role) ? (
                          member.role.map((r, idx) => (
                            <span key={idx} className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {convertToSpacedText(r as string)}
                            </span>
                          ))
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {convertToSpacedText(member.role as string)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${member.membership_verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}>
                        {member.membership_verified ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${member.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                        {member.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {!member.membership_verified && (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleAcceptClick(member.id)}
                            className="text-green-600 hover:text-green-900 flex items-center gap-1"
                            title="Accept"
                          >
                            <FiCheck className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleReject(member.id)}
                            className="text-red-600 hover:text-red-900 flex items-center gap-1"
                            title="Reject"
                          >
                            <FiX className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    No members found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {paginatedMembers.length} of {filteredMembers.length} members
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

export default MembersPage;

