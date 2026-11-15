import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { BlogList } from "../../constants/basic-types";
import type { AxiosResponse } from "axios";
import { formatToReadableDate } from "../../constants/app-logic";
import { getBlogsList } from "../../api/landing-page-services";

const SingleBlogPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<BlogList | null>(null);
  const [loading, setLoading] = useState(false);

  const getBlog = async () => {
    setLoading(true);
    try {
      const res: AxiosResponse<BlogList[]> = await getBlogsList();
      const single = res.data.find((item) => item.slug === slug) || null;
      setBlog(single);
    } catch (error) {
      console.error("Failed to fetch blog:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBlog();
  }, [slug]);

  const fadeInUp = (delay = 0, y = 30) => ({
    initial: { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay },
  });

  if (loading) {
    return <p className="text-center py-20">Loading blog...</p>;
  }

  if (!blog) {
    return <p className="text-center py-20">Blog not found.</p>;
  }
console.log(blog)
  return (
    <div className="font-sans bg-[#f8f7f6] min-h-screen">
      {/* --- Blog Header --- */}
      <motion.div className="text-center py-10" {...fadeInUp(0, -30)}>
        <p className="uppercase text-main-orange text-xs tracking-wide font-semibold">
          {blog.category}
        </p>
        <h1 className="text-4xl font-extrabold mt-2 uppercase">{blog.title}</h1>
        <p className="text-sm text-gray-600 mt-2">
          {formatToReadableDate(blog.published_at || "")} &nbsp; By{" "}
          <span className="font-semibold">{blog.author.full_name}</span>
        </p>
      </motion.div>

      {/* --- Featured Image --- */}
      {blog.featured_image && (
        <motion.img
          src={blog.featured_image === 'string' ? 'https://picsum.photos/800/400' : blog.featured_image}
          alt={blog.title}
          className="w-full max-w-5xl mx-auto h-[450px] object-cover rounded-lg shadow-sm"
          {...fadeInUp(0.3, -50)}
        />
      )}

      {/* --- Blog Content --- */}
      <motion.div
        className="max-w-3xl mx-auto bg-white mt-10 p-8 rounded-lg shadow-sm leading-relaxed text-gray-800"
        {...fadeInUp(0.5, 50)}
      >
        {/* Example structure: Replace with actual blog body */}
        <h2 className="text-xl font-bold mb-4">Lorem Ipsum Dolor Sit Amet</h2>
        <p className="mb-4">
          {blog.excerpt} Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
        </p>

        <p className="mb-6">
          Aenean vel elit scelerisque mauris. Imperdiet sed euismod nisi porta. 
          Eros donec ac odio tempor orci dapibus ultrices in iaculis. 
          Elementum eu facilisis sed odio morbi. 
        </p>

        {/* Secondary Image */}
        <img
          src="https://picsum.photos/800/400"
          alt="Blog content section"
          className="w-full h-[300px] object-cover rounded-md my-6"
        />

        <h2 className="text-xl font-bold mb-4">Another Section Title</h2>
        <p className="mb-4">
          Quis vel eros donec ac odio tempor orci dapibus ultrices. 
          Elementum eu facilisis sed odio morbi. Mattis ullamcorper velit sed ullamcorper.
        </p>

        {/* Highlighted Quote */}
        <blockquote className="border-l-4 border-main-orange bg-orange-50 px-6 py-4 my-6 italic text-gray-700">
          “Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.”
        </blockquote>

        <p className="mb-4">
          Faucibus in ornare quam viverra orci sagittis eu volutpat. 
          Amet porttitor eget dolor morbi non arcu risus quis.
        </p>
      </motion.div>

      {/* --- Back Button --- */}
      <div className="text-center mt-10 pb-10">
        <Link to="/blog">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-main-orange text-white px-6 py-2 rounded font-semibold hover:bg-orange-500"
          >
            ← Back to Blogs
          </motion.button>
        </Link>
      </div>
    </div>
  );
};

export default SingleBlogPage;
