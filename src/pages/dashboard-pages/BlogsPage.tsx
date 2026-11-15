import { useEffect, useState, useCallback, type JSX } from "react";
import { FiUsers, FiCalendar, FiDollarSign, FiTrendingUp, FiDownload, FiPlus } from "react-icons/fi";
import StatCard from "../../components/StatCard";
import BlogsTable from "../../components/dashboard-components/BlogsTable";
import { useToast } from "../../contexts/ToastContext";
import { getBlogsList } from "../../api/landing-page-services";
import type { BlogList, BlogCategory } from "../../constants/basic-types";
import type { AxiosResponse } from "axios";
import LoadingModal from "../../components/LoadingModal";
import { useAuth } from "../../hooks/useAuth";
import { createBlog } from "../../api/admin-dashboard-apis";
import { useFormik } from "formik";
import * as Yup from "yup";
import Popup from "../../components/modals/Popup";
import RegularInputField from "../../components/inputs/RegularInputField";
import RegularTextArea from "../../components/inputs/RegularTextArea";
import MediaUploadField from "../../components/dashboard-components/MediaUploadField";


interface Stat {
  id: number;
  title: string;
  value: string | number;
  icon: JSX.Element;
}

const BlogsPage: React.FC = () => {
  const { showToast } = useToast();
  const { accessToken } = useAuth();

  const [blogPosts, setBlogPosts] = useState<BlogList[]>();

  const blogs = blogPosts || [];
  const featuredBlogs = blogs.filter(b => b.is_featured).length;
  const now = new Date();
  const thisMonthBlogs = blogs.filter(b => {
    const date = new Date(b.created_at);
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }).length;
  const uniqueCategories = new Set(blogs.map(b => b.category)).size;

  const stats: Stat[] = [
    { id: 1, title: "Total Blogs", value: blogs.length, icon: <FiUsers className="w-6 h-6 text-main-orange" /> },
    { id: 2, title: "Featured Blogs", value: featuredBlogs, icon: <FiCalendar className="w-6 h-6 text-main-orange" /> },
    { id: 3, title: "New This Month", value: thisMonthBlogs, icon: <FiDollarSign className="w-6 h-6 text-main-orange" /> },
    { id: 4, title: "Active Categories", value: uniqueCategories, icon: <FiTrendingUp className="w-6 h-6 text-main-orange" /> },
  ];

  const [loading, setLoading] = useState(false);

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

  const getBlogsFromApi = useCallback(async () => {
    setLoading(true);
    try {
      const res: AxiosResponse<BlogList[]> = await getBlogsList();
      setBlogPosts(res.data)
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  }, [handleApiError]);

  useEffect(() => {
    getBlogsFromApi();
  }, [getBlogsFromApi])

  const [createModal, setCreateModal] = useState(false);

  const blogCategories: BlogCategory[] = ['relationship', 'finance', 'family', 'spirituality', 'prayer', 'worship', 'bible_study', 'community', 'youth', 'giving', 'envangelism'];

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    // content: Yup.string().required("Content is required").min(50, "Content must be at least 50 characters"),
    excerpt: Yup.string().required("Excerpt is required").max(500, "Excerpt must be less than 500 characters"),
    featured_image: Yup.mixed()
      .test('is-file', 'Featured image must be a file', (value) => {
        return value instanceof File;
      })
      .test('file-type', 'Unsupported file format', (value) => {
        if (value instanceof File) {
          const supportedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
          return supportedTypes.includes(value.type);
        }
        return false;
      })
      .required('Featured image is required'),
    category: Yup.string().oneOf(blogCategories, "Invalid category").required("Category is required"),
    is_featured: Yup.boolean().required("Featured status is required"),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      content: "",
      excerpt: "",
      featured_image: null,
      category: "" as BlogCategory | "",
      is_featured: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await createBlog(accessToken || "", {
          title: values.title,
          // content: values.content,
          excerpt: values.excerpt,
          featured_image: values.featured_image,
          category: values.category as BlogCategory,
          is_featured: values.is_featured,
        });
        showToast("Blog created successfully!", "success");
        setCreateModal(false);
        formik.resetForm();
        getBlogsFromApi();
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <LoadingModal isLoading={loading} />
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Manage Blogs</h1>
          <p className="text-gray-500 mt-1">
            Organize and manage church sermons and activities effectively
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-2">
          <button className="flex items-center bg-white border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50 transition">
            <FiDownload className="mr-2" /> Export
          </button>

          <button
            onClick={() => setCreateModal(true)}
            className="flex items-center bg-main-orange text-white rounded-md px-4 py-2 hover:bg-orange-300 transition">
            <FiPlus className="mr-2" /> Create New Blog
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.id} title={stat.title} value={stat.value} icon={stat.icon} />
        ))}
      </div>
      {/* List */}
      <BlogsTable blogs={blogPosts || []} onBlogDeleted={getBlogsFromApi} />
      <Popup
        isOpen={createModal}
        onClose={() => {
          setCreateModal(false);
          formik.resetForm();
        }}
        title="Upload new blog"
        supportingText="Upload a new blog to your database, this will also be available on your website"
      >
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
          <RegularInputField
            label="Title"
            name="title"
            id="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.title && formik.errors.title ? formik.errors.title : undefined}
          />
          <RegularTextArea
            label="Excerpt"
            name="excerpt"
            id="excerpt"
            value={formik.values.excerpt}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.excerpt && formik.errors.excerpt ? formik.errors.excerpt : undefined}
          />
          {/* <RegularTextArea
            label="Content"
            name="content"
            id="content"
            value={formik.values.content}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.content && formik.errors.content ? formik.errors.content : undefined}
          /> */}
          {/* <RegularInputField
            label="Featured Image URL"
            name="featured_image"
            id="featured_image"
            type="url"
            placeholder="https://example.com/image.jpg"
            value={formik.values.featured_image}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.featured_image && formik.errors.featured_image ? formik.errors.featured_image : undefined}
          /> */}
          <div className="flex flex-col space-y-1">
            <label className="font-normal text-base text-[#383838]">Category</label>
            <select
              name="category"
              id="category"
              value={formik.values.category}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="appearance-none w-full p-3 rounded-[5px] border-[1px] border-[#EAECF0] focus:outline-none focus:ring-2 focus:ring-main-orange font-normal"
            >
              <option value="">Select category</option>
              {blogCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1).replace(/_/g, ' ')}
                </option>
              ))}
            </select>
            {formik.touched.category && formik.errors.category && (
              <p className="text-[12px] text-red-500">{formik.errors.category}</p>
            )}
          </div>
          <MediaUploadField
            label="Featured Image"
            type="Picture"
            name="featured_image"
            onChange={(file) => formik.setFieldValue('featured_image', file)}
            onBlur={() => formik.setFieldTouched("featured_image", true)}
            error={formik.touched.featured_image ? (formik.errors.featured_image as string) : undefined}
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_featured"
              id="is_featured"
              checked={formik.values.is_featured}
              onChange={(e) => formik.setFieldValue('is_featured', e.target.checked)}
              onBlur={formik.handleBlur}
              className="w-4 h-4 text-main-orange border-gray-300 rounded focus:ring-main-orange"
            />
            <label htmlFor="is_featured" className="font-normal text-base text-[#383838]">
              Featured Blog
            </label>
          </div>
          {formik.touched.is_featured && formik.errors.is_featured && (
            <p className="text-[12px] text-red-500">{formik.errors.is_featured}</p>
          )}
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={() => {
                setCreateModal(false);
                formik.resetForm();
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-main-orange text-white rounded-md hover:bg-orange-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Blog"}
            </button>
          </div>
        </form>
      </Popup>
    </div>
  );
};

export default BlogsPage;
