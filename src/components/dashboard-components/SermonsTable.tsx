import type React from "react";
import type { SermonPropType } from "../../constants/basic-types"
import { useMemo, useState } from "react";
import { IoCalendarOutline } from "react-icons/io5";
import { convertToSpacedText, formatToReadableDate } from "../../constants/app-logic";
import { GoTrash } from "react-icons/go";
import { deleteSermon } from "../../api/admin-dashboard-apis";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../contexts/ToastContext";
import { FaPlay, FaMusic, FaFileAlt } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";

interface SermonsTableProp {
  sermons: SermonPropType[];
  onSermonDeleted?: () => void;
}

const SermonsTable: React.FC<SermonsTableProp> = ({ sermons, onSermonDeleted }) => {
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"recent" | "oldest">("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [selectedSermon, setSelectedSermon] = useState<SermonPropType | null>(null);
  const { accessToken } = useAuth();
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

  const handleDeleteSermon = async (sermonId: number) => {
    if (!sermonId) {
      showToast("Sermon ID is missing.", "error");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this sermon? This action cannot be undone.")) {
      return;
    }

    setDeletingId(sermonId);
    try {
      await deleteSermon(accessToken || "", sermonId);
      showToast("Sermon deleted successfully!", "success");
      onSermonDeleted?.();
    } catch (error) {
      handleApiError(error);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredSermons = useMemo(() => {
    const filtered = sermons.filter(sermon => {
      const matchesSearch =
        sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sermon.id && sermon.id.toString().includes(searchTerm)) ||
        (sermon.minister && sermon.minister.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (sermon.description && sermon.description.toLowerCase().includes(searchTerm.toLowerCase()))
        ;


      return matchesSearch;
    });

    // Sort events
    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at || '').getTime();
      const dateB = new Date(b.created_at || '').getTime();

      return sortOrder === "recent" ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [sermons, searchTerm, sortOrder]);

  // Pagination
  const paginatedSermons = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSermons.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSermons, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredSermons.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Render media thumbnail based on sermon type
  const renderMediaThumbnail = (sermon: SermonPropType) => {
    const isVideo = sermon.sermon_type === "video";
    const isAudio = sermon.sermon_type === "audio";
    const isText = sermon.sermon_type === "text";

    if (isVideo) {
      return (
        <div
          className="relative rounded-[6px] overflow-hidden cursor-pointer group bg-gray-200 aspect-video"
          onClick={() => setSelectedSermon(sermon)}
        >
          <video
            src={sermon.file_url}
            className="w-full h-full object-cover"
            muted
            onMouseEnter={(e) => {
              const video = e.currentTarget;
              video.play().catch(() => { });
            }}
            onMouseLeave={(e) => {
              const video = e.currentTarget;
              video.pause();
              video.currentTime = 0;
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-white/90 rounded-full p-4 hover:bg-white transition-colors">
              <FaPlay className="text-main-orange text-2xl ml-1" />
            </div>
          </div>
        </div>
      );
    }

    if (isAudio) {
      return (
        <div
          className="relative rounded-[6px] overflow-hidden cursor-pointer group bg-gradient-to-br from-orange-100 to-orange-200 aspect-video flex items-center justify-center"
          onClick={() => setSelectedSermon(sermon)}
        >
          <FaMusic className="text-main-orange text-6xl opacity-50" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-white/90 rounded-full p-4 hover:bg-white transition-colors">
              <FaPlay className="text-main-orange text-2xl ml-1" />
            </div>
          </div>
        </div>
      );
    }

    if (isText) {
      return (
        <div
          className="relative rounded-[6px] overflow-hidden cursor-pointer group bg-gradient-to-br from-gray-100 to-gray-200 aspect-video flex items-center justify-center"
          onClick={() => setSelectedSermon(sermon)}
        >
          <FaFileAlt className="text-gray-600 text-6xl opacity-50" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-white/90 rounded-full p-4 hover:bg-white transition-colors">
              <FaPlay className="text-main-orange text-2xl ml-1" />
            </div>
          </div>
        </div>
      );
    }

    // Fallback for unknown types
    return (
      <div className="rounded-[6px] bg-gray-200 aspect-video flex items-center justify-center">
        <p className="text-gray-500">No preview</p>
      </div>
    );
  };

  // Media player popup modal
  const renderMediaPlayerModal = () => {
    if (!selectedSermon) return null;

    const isVideo = selectedSermon.sermon_type === "video";
    const isAudio = selectedSermon.sermon_type === "audio";
    const isText = selectedSermon.sermon_type === "text";

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={() => setSelectedSermon(null)}
        />

        {/* Modal content */}
        <div
          className="relative z-10 bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={() => setSelectedSermon(null)}
            className="absolute top-4 right-4 z-20 text-white bg-black/50 hover:bg-black/70 rounded-full text-xl p-2 transition-colors"
          >
            <IoCloseSharp />
          </button>

          {/* Media player */}
          <div className="p-6">
            <h3 className="text-2xl font-semibold mb-4">{selectedSermon.title}</h3>
            <p className="text-gray-600 mb-4">{selectedSermon.minister}</p>

            <div className="bg-black rounded-lg overflow-hidden">
              {isVideo && (
                <video
                  controls
                  autoPlay
                  className="w-full h-auto max-h-[70vh]"
                  src={selectedSermon.file_url}
                >
                  Your browser does not support the video tag.
                </video>
              )}
              {isAudio && (
                <div className="p-8 bg-gradient-to-br from-orange-100 to-orange-200">
                  <div className="flex flex-col items-center justify-center py-8">
                    <FaMusic className="text-main-orange text-8xl mb-6 opacity-50" />
                    <audio
                      controls
                      autoPlay
                      className="w-full max-w-2xl"
                      src={selectedSermon.file_url}
                    >
                      Your browser does not support the audio tag.
                    </audio>
                  </div>
                </div>
              )}
              {isText && (
                <div className="p-8 bg-gradient-to-br from-gray-100 to-gray-200">
                  <div className="flex flex-col items-center justify-center py-8">
                    <FaFileAlt className="text-gray-600 text-8xl mb-6 opacity-50" />
                    <a
                      href={selectedSermon.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-main-orange text-white px-6 py-3 rounded-md hover:bg-orange-600 transition-colors"
                    >
                      Open Document
                    </a>
                  </div>
                </div>
              )}
            </div>

            {selectedSermon.description && (
              <p className="mt-4 text-gray-700">{selectedSermon.description}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {renderMediaPlayerModal()}
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-1">Sermons Overview</h2>
        <p className="text-gray-main mb-4">Manage and track all your church sermons</p>

        {/* Search + Filters */}
        <div className="flex flex-wrap justify-between gap-2 mb-4 text-[#7A7A7A]">
          <input
            type="text"
            placeholder="Search by event name, location, or ID"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
            className="border border-gray-300 rounded-md px-3 py-2 w-full md:w-1/2 focus:outline-none "
          />
          <div className="flex gap-2">
            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value as "recent" | "oldest");
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none"
            >
              <option value="recent">Recently Added</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>

        {/* Sermon's list */}
        <div className="grid gap-4 max-w-6xl mx-auto mt-10 pb-10 sm:grid-cols-2 xl:grid-cols-3">
          {
            paginatedSermons.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-3.5 bg-gray-50 rounded-[10px] p-3">
                {renderMediaThumbnail(item)}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-xs">
                    <p className="bg-[#FF85001A] px-4 rounded-[10px]">{convertToSpacedText(item.sermon_type)}</p>
                    <p className="border border-[#7A7A7A7A] rounded-full px-2">{342} views</p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">{item.title}</h4>
                    <p className="text-sm text-gray-main">{item.description}</p>
                  </div>
                  {/* Pastor/Minister */}
                  <div>
                    <p className="text-sm text-gray-main">{item.minister}</p>
                  </div>
                  <div>
                    <div className="text-sm text-gray-main flex gap-2.5 items-center">
                      <IoCalendarOutline />
                      {formatToReadableDate(item.created_at || '')}
                    </div>
                  </div>
                  {user?.role === 'super_admin' && <div className="flex gap-3 mt-4">
                    <GoTrash
                      onClick={() => item.id && handleDeleteSermon(item.id)}
                      className={`cursor-pointer hover:text-red-600 text-red-500 transition-colors ${deletingId === item.id ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      title="Delete Sermon"
                    />
                  </div>}
                </div>
              </div>
            ))
          }
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-sm text-gray-600 gap-4">
          <p>
            Showing {paginatedSermons.length} of {filteredSermons.length} sermons
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
  )
}

export default SermonsTable