import { useEffect, useState } from "react";
import { GalleryHeaderImg } from "../../assets/images";
import RegularHeading from "../../components/landing-components/RegularHeading";
import { FiSearch } from "react-icons/fi";
import { FaPlay } from "react-icons/fa";
import { motion } from "framer-motion";
import type { Gallery } from "../../constants/basic-types";
import type { AxiosResponse } from "axios";
import { getGalleryList } from "../../api/landing-page-services";

const GalleryPage = () => {
  const [galleryList, setGalleryList] = useState<Gallery[]>()
  const [loading, setLoading] = useState(false);

  const getGallery = async () => {
    setLoading(true);
    try {
      const res: AxiosResponse<Gallery[]> = await getGalleryList();
      console.log('final result:', res.data);
      setGalleryList(res.data)
    } catch (error) {
      console.error('after error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getGallery();
  }, [])
  console.log(galleryList || 'Waiting')

  const allItems = [
    { title: "Sunday Service", date: "2025-08-01", type: "sermon", media: "video", img: "https://picsum.photos/id/1011/400/250" },
    { title: "Youth Fellowship", date: "2025-07-15", type: "event", media: "image", img: "https://picsum.photos/id/1012/400/250" },
    { title: "Bible Study", date: "2025-07-05", type: "sermon", media: "video", img: "https://picsum.photos/id/1013/400/250" },
    { title: "Community Outreach", date: "2024-12-20", type: "event", media: "image", img: "https://picsum.photos/id/1014/400/250" },
    { title: "Faith Seminar", date: "2024-11-10", type: "sermon", media: "video", img: "https://picsum.photos/id/1015/400/250" },
    { title: "Praise Night", date: "2024-10-01", type: "event", media: "image", img: "https://picsum.photos/id/1016/400/250" },
    { title: "Leadership Training", date: "2025-02-15", type: "sermon", media: "image", img: "https://picsum.photos/id/1017/400/250" },
    { title: "Choir Rehearsal", date: "2025-03-05", type: "event", media: "video", img: "https://picsum.photos/id/1018/400/250" },
    { title: "Youth Camp", date: "2025-04-12", type: "event", media: "image", img: "https://picsum.photos/id/1019/400/250" },
    { title: "Holy Communion", date: "2025-06-20", type: "sermon", media: "video", img: "https://picsum.photos/id/1020/400/250" },
    { title: "Pastors’ Conference", date: "2025-07-22", type: "event", media: "image", img: "https://picsum.photos/id/1021/400/250" },
    { title: "Thanksgiving Sunday", date: "2025-05-30", type: "sermon", media: "image", img: "https://picsum.photos/id/1022/400/250" },
  ];

  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("all");
  const [mediaFilter, setMediaFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filters = {
    event: [
      { value: "recent", label: "Recent Events" },
      { value: "past", label: "Past Events" },
      { value: "all", label: "All" },
    ],
    media: [
      { value: "all", label: "All Media" },
      { value: "video", label: "Videos" },
      { value: "image", label: "Images" },
    ],
    type: [
      { value: "all", label: "All Types" },
      { value: "sermon", label: "Sermons" },
      { value: "event", label: "Events" },
    ],
  };

  const filteredItems = allItems.filter(({ title, date, type, media }) => {
    const matchesSearch =
      title.toLowerCase().includes(search.toLowerCase()) || date.includes(search);

    const today = new Date();
    const itemDate = new Date(date);
    const isRecent = itemDate >= today;

    const matchesEvent =
      eventFilter === "recent" ? isRecent : eventFilter === "past" ? !isRecent : true;

    const matchesMedia = mediaFilter === "all" || media === mediaFilter;
    const matchesType = typeFilter === "all" || type === typeFilter;

    return matchesSearch && matchesEvent && matchesMedia && matchesType;
  });

  const cardVariants = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } };

  return (
    <div className="font-sans bg-[#f8f7f6]">
      <RegularHeading
        text="TAKE A LOOK AT OUR GALLERY"
        title="GALLERY"
        imgSrc={GalleryHeaderImg}
      />

      {loading ?
        <p className="text-center">Loading</p>
        :
        <section className="text-center py-12">
          <p className="uppercase text-orange-500 font-semibold text-sm mb-2">Gallery</p>
          <h2 className="text-3xl font-bold uppercase">
            Gallery Collection of Preached <br /> Sermons & Events
          </h2>
        </section>}

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 items-center md:items-center justify-between px-4 md:px-5 mb-10">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Search by sermon/event name or date"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-lg py-3 px-4 pl-10 focus:ring-2 focus:ring-orange-500 outline-none"
          />
          <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          {[
            { value: eventFilter, set: setEventFilter, options: filters.event },
            { value: mediaFilter, set: setMediaFilter, options: filters.media },
            { value: typeFilter, set: setTypeFilter, options: filters.type },
          ].map(({ value, set, options }, idx) => (
            <select
              key={idx}
              value={value}
              onChange={(e) => set(e.target.value)}
              className="flex-1 md:flex-none border border-gray-300 rounded-lg py-3 px-4 text-gray-600 focus:ring-2 focus:ring-orange-500"
            >
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ))}
        </div>
      </div>

      <motion.div
        className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 md:grid-cols-3 px-5 pb-16"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
      >
        {filteredItems.length > 0 ? (
          filteredItems.map((item, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-lg shadow-sm overflow-hidden group cursor-pointer"
              variants={cardVariants}
            >
              <div className="relative">
                <img src={item.img} alt={item.title} className="w-full h-52 object-cover" />
                {item.media === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
                    <FaPlay className="text-white text-3xl" />
                  </div>
                )}
              </div>
              <div className="p-4 text-left">
                <p className="text-xs text-gray-500 uppercase">Picture Title</p>
                <div className="flex justify-between items-center mt-1">
                  <h3 className="font-bold">{item.title}</h3>
                  <span className="text-sm text-gray-500">
                    {new Date(item.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 py-10">No results found.</p>
        )}
      </motion.div>
    </div>
  );
};

export default GalleryPage;
