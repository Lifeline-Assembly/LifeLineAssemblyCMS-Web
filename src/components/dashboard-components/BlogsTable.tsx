import type React from "react";
import type { BlogList } from "../../constants/basic-types"
import { useMemo, useState } from "react";
import { IoCalendarOutline } from "react-icons/io5";
import { convertToSpacedText, formatToReadableDate } from "../../constants/app-logic";
import { deleteBlog } from "../../api/admin-dashboard-apis";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../contexts/ToastContext";
import Popup from "../modals/Popup";

interface BlogsTableProp {
  blogs: BlogList[];
  onBlogDeleted?: () => void;
}

const BlogsTable: React.FC<BlogsTableProp> = ({ blogs, onBlogDeleted }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"recent" | "oldest">("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<BlogList | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleDeleteBlog = async (slug: string) => {
    if (!slug) {
      showToast("Blog slug is missing.", "error");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this blog? This action cannot be undone.")) {
      return;
    }

    setDeletingSlug(slug);
    try {
      await deleteBlog(accessToken || "", slug);
      showToast("Blog deleted successfully!", "success");
      onBlogDeleted?.();
    } catch (error) {
      handleApiError(error);
    } finally {
      setDeletingSlug(null);
    }
  };

  const handleReadMore = (blog: BlogList) => {
    setSelectedBlog(blog);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBlog(null);
  };

  const filteredBlogs = useMemo(() => {
    const filtered = blogs.filter(blog => {
      const matchesSearch =
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (blog.id && blog.id.toString().includes(searchTerm)) ||
        (blog.author.full_name && blog.author.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (blog.category && blog.category.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesSearch;
    });

    // Sort events
    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at || '').getTime();
      const dateB = new Date(b.created_at || '').getTime();

      return sortOrder === "recent" ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [blogs, searchTerm, sortOrder]);

  // Pagination
  const paginatedBlogs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredBlogs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredBlogs, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-1">Blogs Overview</h2>
      <p className="text-gray-main mb-4">Manage and track all your church blogs</p>

      {/* Search + Filters */}
      <div className="flex flex-wrap justify-between gap-2 mb-4 text-[#7A7A7A]">
        <input
          type="text"
          placeholder="Search by blog title, author, or Catrgory"
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
          filteredBlogs.map((item, idx) => (
            <div key={idx} className="flex flex-col gap-3.5 bg-gray-50 rounded-[10px] p-3">
              <img
                className="rounded-[6px] max-h-[200px] object-cover"
                src={(item.featured_image && item.featured_image !== 'string') ? item.featured_image : 'https://picsum.photos/800/400'}
                alt="" />
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs">
                  <p className="bg-[#FF85001A] px-4 rounded-[10px]">{convertToSpacedText(item.category)}</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold">{item.title}</h4>
                  <p className="text-sm text-gray-main">
                    {item.excerpt}<br />
                    {convertToSpacedText(item.slug)}
                  </p>
                </div>
                {/* Pastor/Minister */}
                <div>
                  <p className="text-sm text-gray-main">{item.author.full_name}</p>
                </div>
                <div>
                  <div className="text-sm text-gray-main flex gap-2.5 items-center">
                    <IoCalendarOutline />
                    {formatToReadableDate(item.created_at || '')}
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => handleReadMore(item)}
                    className="px-2 py-1 bg-main-orange text-white rounded-md hover:bg-orange-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Read More
                  </button>
                  {(user?.role === 'pastor' || user?.role === 'super_admin' || user?.role === 'parish_admin' || user?.role === 'leader') && <button
                    type="button"
                    onClick={() => item.slug && handleDeleteBlog(item.slug)}
                    disabled={deletingSlug === item.slug}
                    className={`px-2 py-1 border border-gray-300 rounded-md hover:bg-gray-50 transition cursor-pointer hover:text-red-500 ${deletingSlug === item.slug ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                  >
                    {deletingSlug === item.slug ? "Deleting..." : "Delete"}
                  </button>}
                </div>
              </div>
            </div>
          ))
        }
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-sm text-gray-600 gap-4">
        <p>
          Showing {paginatedBlogs.length} of {filteredBlogs.length} blogs
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

      {/* Blog Content Modal */}
      <Popup
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedBlog?.title}
        supportingText={selectedBlog ? `By ${selectedBlog.author.full_name} • ${formatToReadableDate(selectedBlog.created_at || '')}` : ''}
      >
        {selectedBlog && (
          <div className="flex flex-col gap-4">
            <img
              src={(selectedBlog.featured_image && selectedBlog.featured_image !== 'string') ? selectedBlog.featured_image : 'https://picsum.photos/800/400'}
              alt={selectedBlog.title}
              className="w-full h-[300px] object-cover rounded-lg"
            />
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {selectedBlog.content || selectedBlog.excerpt || "No content available."}
              </p>
            </div>
          </div>
        )}
      </Popup>
    </div>
  )
}

export default BlogsTable