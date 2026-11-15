import React, { useState, useMemo } from "react";
import { FaCalendarAlt, FaClock, FaUsers, FaMapMarkerAlt } from "react-icons/fa";
import type { EventPropType } from "../../constants/basic-types";
import { GoTrash } from "react-icons/go";
import { FiEdit } from "react-icons/fi";
import { IoEyeOutline } from "react-icons/io5";
import { deleteEvent } from "../../api/admin-dashboard-apis";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../contexts/ToastContext";
import Popup from "../modals/Popup";
import { formatToReadableDate } from "../../constants/app-logic";

interface EventsTableProps {
  events: EventPropType[];
  onEventDeleted?: () => void;
}

const EventsTable: React.FC<EventsTableProps> = ({ events, onEventDeleted }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "closed">("all");
  const [sortOrder, setSortOrder] = useState<"recent" | "oldest">("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [viewingEvent, setViewingEvent] = useState<EventPropType | null>(null);
  const { accessToken, user } = useAuth();
  const { showToast } = useToast();

  const handleApiError = (error: unknown) => {
    if (error && typeof error === "object" && "non_field_errors" in error) {
      const mainError = error as { non_field_errors: string };
      showToast(mainError.non_field_errors, "error");
    } else if (error && typeof error === "object" && "detail" in error) {
      const mainError = error as { detail: string };
      showToast(mainError.detail, "error");
    } else {
      showToast("An unexpected error occurred.", "error");
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    if (!eventId) {
      showToast("Event ID is missing.", "error");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      return;
    }

    setDeletingId(eventId);
    try {
      await deleteEvent(accessToken || "", eventId);
      showToast("Event deleted successfully!", "success");
      onEventDeleted?.();
    } catch (error) {
      handleApiError(error);
    } finally {
      setDeletingId(null);
    }
  };

  // Determine event status based on current time
  const getEventStatus = (event: EventPropType): "open" | "closed" => {
    const now = new Date();
    const start = new Date(event.start_datetime);
    const end = event.end_datetime ? new Date(event.end_datetime) : null;

    if (now < start) return "closed"; // Event hasn't started yet
    if (end && now > end) return "closed"; // Event has ended
    return "open"; // Event is currently ongoing
  };

  // Filter and sort events
  const filteredAndSortedEvents = useMemo(() => {
    const filtered = events.filter(event => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.id && event.id.toString().includes(searchTerm)) ||
        (event.location && event.location.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus =
        statusFilter === "all" ||
        getEventStatus(event) === statusFilter;

      return matchesSearch && matchesStatus;
    });

    // Sort events
    filtered.sort((a, b) => {
      const dateA = new Date(a.start_datetime).getTime();
      const dateB = new Date(b.start_datetime).getTime();

      return sortOrder === "recent" ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [events, searchTerm, statusFilter, sortOrder]);

  // Pagination
  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedEvents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedEvents, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedEvents.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Calculate registration progress (you might want to replace this with actual data)
  const getRegistrationProgress = () => {
    // This is a placeholder - replace with actual registration data from your API
    const registered = 1300; // Example data
    const capacity = 4020; // Example data
    const percentage = Math.round((registered / capacity) * 100);

    return { registered, capacity, percentage };
  };

  // Format datetime for display
  const formatDateTime = (isoDate: string) => {
    const date = new Date(isoDate);
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  // Get event status for display
  const getEventStatusDisplay = (event: EventPropType) => {
    const status = getEventStatus(event);
    return {
      text: status === "open" ? "Open" : "Closed",
      className: status === "open"
        ? "bg-[#5CCE9C] text-white"
        : "bg-gray-300 text-gray-700"
    };
  };

  return (
    <>
      {/* Event View Popup */}
      <Popup
        isOpen={!!viewingEvent}
        onClose={() => setViewingEvent(null)}
        title={viewingEvent?.title || "Event Details"}
        supportingText="View complete event information"
      >
        {viewingEvent && (
          <div className="flex flex-col gap-6">
            {/* Banner Image */}
            {viewingEvent.banner && (
              <div className="w-full h-64 rounded-lg overflow-hidden">
                <img
                  src={viewingEvent.banner}
                  alt={viewingEvent.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Event Status */}
            <div className="flex items-center gap-3">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getEventStatusDisplay(viewingEvent).className}`}>
                {getEventStatusDisplay(viewingEvent).text}
              </span>
              {viewingEvent.id && (
                <span className="text-sm text-gray-500">ID: {viewingEvent.id}</span>
              )}
            </div>

            {/* Description */}
            {viewingEvent.description && (
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold text-gray-900">Description</h3>
                <p className="text-gray-700 leading-relaxed">{viewingEvent.description}</p>
              </div>
            )}

            {/* Date & Time Information */}
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold text-gray-900">Date & Time</h3>
              <div className="flex flex-col gap-3">
                {/* Start Date & Time */}
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <FaCalendarAlt className="text-main-orange mt-1 flex-shrink-0" />
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-gray-600">Start Date & Time</span>
                    <span className="text-base text-gray-900">{formatDateTime(viewingEvent.start_datetime).date}</span>
                    <span className="text-sm text-gray-600 flex items-center gap-2">
                      <FaClock className="text-gray-400" />
                      {formatDateTime(viewingEvent.start_datetime).time}
                    </span>
                  </div>
                </div>

                {/* End Date & Time */}
                {viewingEvent.end_datetime && (
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <FaCalendarAlt className="text-main-orange mt-1 flex-shrink-0" />
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-gray-600">End Date & Time</span>
                      <span className="text-base text-gray-900">{formatDateTime(viewingEvent.end_datetime).date}</span>
                      <span className="text-sm text-gray-600 flex items-center gap-2">
                        <FaClock className="text-gray-400" />
                        {formatDateTime(viewingEvent.end_datetime).time}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            {viewingEvent.location && (
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold text-gray-900">Location</h3>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <FaMapMarkerAlt className="text-main-orange flex-shrink-0" />
                  <span className="text-gray-700">{viewingEvent.location}</span>
                </div>
              </div>
            )}

            {/* Registration Progress */}
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold text-gray-900">Registration</h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FaUsers className="text-gray-400" />
                    <span className="text-gray-700">
                      {getRegistrationProgress().registered.toLocaleString()} / {getRegistrationProgress().capacity.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {getRegistrationProgress().percentage}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-main-orange transition-all duration-300"
                    style={{ width: `${getRegistrationProgress().percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Event Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {viewingEvent.created_at && (
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-600">Created</span>
                    <span className="text-gray-900">{formatToReadableDate(viewingEvent.created_at)}</span>
                  </div>
                )}
                {viewingEvent.updated_at && (
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-600">Last Updated</span>
                    <span className="text-gray-900">{formatToReadableDate(viewingEvent.updated_at)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Popup>

      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-1">Events Overview</h2>
        <p className="text-[#999999] mb-4">Manage and track all your church events</p>

        {/* Search + Filters */}
        <div className="flex flex-wrap justify-between gap-2 mb-4">
          <input
            type="text"
            placeholder="Search by event name, location, or ID"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
            className="border border-gray-300 rounded-md px-3 py-2 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as "all" | "open" | "closed");
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value as "recent" | "oldest");
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="recent">Recently Added</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100 text-gray-600 text-sm">
              <tr>
                <th className="text-left py-3 px-4">Event</th>
                <th className="text-left py-3 px-4">Date & Time</th>
                <th className="text-left py-3 px-4">Location</th>
                <th className="text-left py-3 px-4">Registration</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEvents.length > 0 ? (
                paginatedEvents.map((event, index) => {
                  const status = getEventStatus(event);
                  const progress = getRegistrationProgress();

                  return (
                    <tr
                      key={event.id || index}
                      className="border-t border-gray-200 hover:bg-gray-50 transition"
                    >
                      {/* Event */}
                      <td className="py-3 px-4 font-medium">{event.title}</td>

                      {/* Date & Time */}
                      <td className="py-3 px-4 text-gray-600 flex flex-col">
                        <span className="flex items-center gap-2">
                          <FaCalendarAlt className="text-gray-400" />{" "}
                          {new Date(event.start_datetime).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-2 text-sm text-gray-500">
                          <FaClock className="text-gray-400" />{" "}
                          {new Date(event.start_datetime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </td>

                      {/* Location */}
                      <td className="py-3 px-4 text-gray-600">
                        {event.location || "All Branches"}
                      </td>

                      {/* Registration */}
                      <td className="py-3 px-4 text-gray-600 flex items-center gap-2">
                        <FaUsers className="text-gray-400" />
                        <span>{progress.registered.toLocaleString()}/{progress.capacity.toLocaleString()}</span>
                        <div className="w-20 h-1 bg-gray-200 rounded overflow-hidden">
                          <div
                            className="h-full bg-orange-400 transition-all duration-300"
                            style={{ width: `${progress.percentage}%` }}
                          ></div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded text-sm ${status === "open"
                            ? "bg-[#5CCE9C] text-white"
                            : "bg-gray-300 text-gray-700"
                            }`}
                        >
                          {status === "open" ? "Open" : "Closed"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 flex items-center gap-3 text-gray-600">
                        <IoEyeOutline
                          onClick={() => setViewingEvent(event)}
                          className="cursor-pointer hover:text-blue-600 transition-colors"
                          title="View Event"
                        />
                        {user && user.is_superuser && <FiEdit
                          className="cursor-pointer hover:text-yellow-600 transition-colors"
                          title="Edit Event"
                        />}
                        {user && user.is_superuser && <GoTrash
                          onClick={() => event.id && handleDeleteEvent(event.id)}
                          className={`cursor-pointer hover:text-red-600 text-red-500 transition-colors ${deletingId === event.id ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                          title="Delete Event"
                        />}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 px-4 text-center text-gray-500">
                    No events found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-sm text-gray-600 gap-4">
          <p>
            Showing {paginatedEvents.length} of {filteredAndSortedEvents.length} events
            {searchTerm && ` for "${searchTerm}"`}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`border border-gray-300 rounded px-3 py-1 ${currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "hover:bg-gray-50"
                }`}
            >
              {"<"}
            </button>

            {/* Page numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-1 rounded ${currentPage === pageNum
                    ? "bg-gray-600 text-white"
                    : "border border-gray-300 hover:bg-gray-50"
                    }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`border border-gray-300 rounded px-3 py-1 ${currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "hover:bg-gray-50"
                }`}
            >
              {">"}
            </button>

            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventsTable;