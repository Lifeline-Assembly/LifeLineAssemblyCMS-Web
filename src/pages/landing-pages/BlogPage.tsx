import { motion } from "framer-motion";
import { Blog } from "../../assets/images";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { BlogList } from "../../constants/basic-types";
import type { AxiosResponse } from "axios";
import { convertToSpacedText, formatToReadableDate } from "../../constants/app-logic";
import { getBlogsList } from "../../api/landing-page-services";

const BlogPage = () => {
  const [blogPosts, setBlogPosts] = useState<BlogList[]>();
  const recentPost: BlogList = blogPosts && blogPosts?.length > 0 ? blogPosts[0] : {
    id: 0,
    title: "Church was doing what he often did when dropped an oracle",
    slug: "church-was-doing-what-he-often-did-when-dropped-an-oracle",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
    featured_image: Blog,
    author: {
      id: 0,
      firstname: "John",
      lastname: "Emeka C.O",
      full_name: "John Emeka C.O",
      role: "Guest",
    },
    category: "spirituality",
    is_featured: false,
    reading_time: 5,
    published_at: "2025-05-13T00:00:00Z",
    created_at: "2025-05-13T00:00:00Z",
    time_since_published: "0 days",
  };

  const [loading, setLoading] = useState(false);

  const getBlogs = async () => {
    setLoading(true);
    try {
      const res: AxiosResponse<BlogList[]> = await getBlogsList();
      setBlogPosts(res.data)
    } catch (error) {
      console.error('after error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getBlogs();
  }, [])

  const fadeInUp = (delay = 0, y = 30) => ({
    initial: { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay },
  });

  return (
    <div className="font-sans bg-[#f8f7f6]">
      <motion.div className="text-center py-10" {...fadeInUp(0, -30)}>
        <p className="uppercase text-gray-500">Our Blog</p>
        <h1 className="text-3xl font-bold mt-2 uppercase">Most Recent Post</h1>
      </motion.div>

      <motion.div
        className="flex flex-col md:flex-row bg-white max-w-6xl mx-auto rounded-lg overflow-hidden shadow-sm"
        {...fadeInUp(0.2, 50)}
      >
        <motion.div className="md:w-1/2" {...fadeInUp(0.3, -50)}>
          <img
            src={Blog}
            alt="Most Recent Post"
            className="w-full h-full object-cover"
          />
        </motion.div>

        <motion.div className="md:w-1/2 p-8" {...fadeInUp(0.5, 50)}>
          <p className="text-sm text-gray-600 mb-2">
            {formatToReadableDate(recentPost.published_at || '')}
            <span className="float-right">By {recentPost.author.full_name}</span>
          </p>
          <h2 className="text-xl font-bold mb-4">{recentPost.title}</h2>
          <p className="text-gray-600 leading-relaxed">{recentPost.excerpt}</p>

          <Link to={`/blog/${recentPost.slug}`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 bg-main-orange text-white px-5 py-2 rounded font-bold hover:bg-orange-500"
            >
              Read More
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div className="text-center mt-16" {...fadeInUp(0.7)}>
        <h2 className="text-2xl font-bold uppercase">All Blog Posts</h2>
      </motion.div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="grid gap-6 max-w-6xl mx-auto mt-10 pb-10 sm:grid-cols-2 md:grid-cols-3">
          {blogPosts?.map((item, index) => (
            <Link to={`/blog/${item.slug}`} key={index}>
              <motion.div
                className="bg-white p-6 rounded-lg shadow-sm text-left h-full"
                {...fadeInUp(0.2 + index * 0.1)}
                whileHover={{ scale: 1.03 }}
              >
                <p className="text-xs text-main-orange uppercase font-semibold">
                  {item.category}
                </p>
                <h3 className="text-lg font-semibold mt-2 mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-snug">
                  {item.excerpt}<br />
                  {convertToSpacedText(item.slug)}
                </p>
                <p className="text-xs text-gray-500 mt-4">
                  By {item.author.full_name} <br /> {formatToReadableDate(item?.published_at || '')}
                </p>
              </motion.div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogPage;
