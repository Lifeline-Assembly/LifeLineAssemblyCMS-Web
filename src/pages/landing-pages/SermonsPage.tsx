import { SermonHeaderImg } from "../../assets/images";
import RegularHeading from "../../components/landing-components/RegularHeading";
import { FiClock, FiMapPin, FiEye } from "react-icons/fi";
import { motion } from "framer-motion";
import ReactPlayer from "react-player";
import { useEffect, useState } from "react";
import type { EventPropType, SermonPropType } from "../../constants/basic-types";
import type { AxiosResponse } from "axios";
import { getEventList, getSermonsList } from "../../api/landing-page-services";
import { FcManager } from "react-icons/fc";
import { formatToReadableDate } from "../../constants/app-logic";
import { GrLocation } from "react-icons/gr";
import { useNavigate } from "react-router-dom";

const SermonsPage = () => {
  const [recentEvents, setRecentEvents] = useState<EventPropType[]>([]);
  const [recentSermons, setRecentSermons] = useState<SermonPropType[]>([]);
  const [loadingEvent, setLoadingEvent] = useState(false);
  const [loadingSermon, setLoadingSermon] = useState(false);

  const navigate = useNavigate();

  const getEventListFromApi = async () => {
    setLoadingEvent(true);
    try {
      const res: AxiosResponse<EventPropType[]> = await getEventList();
      setRecentEvents(res.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoadingEvent(false);
    }
  };

  const getSermonListFromApi = async () => {
    setLoadingSermon(true);
    try {
      const res: AxiosResponse<SermonPropType[]> = await getSermonsList();
      setRecentSermons(res.data);
    } catch (error) {
      console.error('Error fetching sermons:', error);
    } finally {
      setLoadingSermon(false);
    }
  };

  useEffect(() => {
    getEventListFromApi();
    getSermonListFromApi();
  }, []);
  // Format date to extract day and month
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate().toString(),
      month: date.toLocaleString('default', { month: 'short' })
    };
  };

  // Format time from datetime string
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const fadeIn = (delay = 0, y = 30) => ({
    initial: { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay },
  });
  // Loading skeleton for events and sermons
  const LoadingSkeleton = ({ count = 4 }) => (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4 max-w-6xl mx-auto">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white p-6 rounded shadow-sm text-left relative animate-pulse">
          <div className="absolute top-6 right-6 text-gray-700 font-bold text-center">
            <div className="h-6 w-6 bg-gray-300 rounded mb-1"></div>
            <div className="h-4 w-8 bg-gray-300 rounded"></div>
          </div>
          <div className="h-4 w-24 bg-gray-300 rounded mb-2"></div>
          <div className="h-6 w-full bg-gray-300 rounded mb-3"></div>
          <div className="h-4 w-full bg-gray-300 rounded mb-2"></div>
          <div className="h-4 w-3/4 bg-gray-300 rounded mb-6"></div>
          <div className="space-y-2 mb-4">
            <div className="h-4 w-full bg-gray-300 rounded"></div>
            <div className="h-4 w-full bg-gray-300 rounded"></div>
          </div>
          <div className="h-4 w-40 bg-gray-300 rounded"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="font-sans bg-[#f8f7f6]">
      <motion.div {...fadeIn(0, -30)}>
        <RegularHeading
          title="SERMON"
          text="TAKE PART IN OUR SERMONS & EVENTS"
          imgSrc={SermonHeaderImg}
        />
      </motion.div>

      <section className="text-center py-16 px-5">
        <motion.p className="uppercase text-gray-500 mb-2" {...fadeIn(0.2)}>
          Upcoming Sermons
        </motion.p>
        <motion.h2 className="text-3xl font-bold mb-10 uppercase" {...fadeIn(0.3, 20)}>
          Join Us And Become Part Of <br /> Something Great
        </motion.h2>

        {loadingSermon ? (
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row bg-white shadow-md animate-pulse">
            <div className="bg-[#fff4ec] md:w-1/3 p-8 text-left relative h-96"></div>
            <div className="md:w-2/3 relative h-96"></div>
          </div>
        ) : recentSermons.length > 0 ? (
          <motion.div
            className="max-w-6xl mx-auto flex flex-col md:flex-row bg-white shadow-md"
            {...fadeIn(0.4, 40)}
          >
            <div className="bg-[#fff4ec] md:w-1/3 p-8 text-left relative">
              {recentSermons[0].created_at && (
                <span className="absolute top-6 right-6 text-gray-700 font-bold text-center">
                  <span className="block text-2xl">
                    {formatDate(recentSermons[0].created_at).day}
                  </span>
                  <span className="text-sm">
                    {formatDate(recentSermons[0].created_at).month}
                  </span>
                </span>
              )}
              <p className="text-xs uppercase text-main-orange font-bold mb-2">
                {recentSermons[0].sermon_type}
              </p>
              <h3 className="text-xl font-semibold mb-4">{recentSermons[0].title}</h3>
              <p className="text-gray-600 mb-6">
                {recentSermons[0].description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor."}
              </p>
              <ul className="text-sm text-gray-700 space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <FcManager /> Minister: {recentSermons[0].minister}
                </li>
                {recentSermons[0].created_at && (
                  <li className="flex items-center gap-2">
                    <FiClock /> {formatToReadableDate(recentSermons[0].created_at)}
                  </li>
                )}
                <li className="flex items-center gap-2">
                  <GrLocation /> Minister: {recentSermons[0].minister}
                </li>
              </ul>
              {/* <button className="bg-orange-500 text-white px-5 py-2 rounded font-bold hover:bg-orange-600 mb-4">
                Register
              </button> */}
              <p className="text-sm text-main-orange font-semibold cursor-pointer" onClick={()=>navigate(`/sermons/${recentSermons[0].id}`)}>
                Click Here To Stream This Sermon Live →
              </p>
            </div>

            <div className="md:w-2/3 relative">
              <ReactPlayer
                oEmbedUrl={recentSermons[0].file_url}
                controls
                width="100%"
                height="100%"
                className="react-player"
              />
              <div className="absolute bottom-4 left-4 flex items-center space-x-6 text-white text-sm bg-black/50 px-4 py-2 rounded">
                <span className="flex items-center gap-2">
                  <FiEye /> {Math.floor(Math.random() * 100) + 100}K Viewers
                </span>
                <span className="flex items-center gap-2">
                  <FiClock /> {Math.floor(Math.random() * 59) + 1}:{Math.floor(Math.random() * 59).toString().padStart(2, '0')}
                </span>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="max-w-6xl mx-auto bg-white p-8 text-center">
            <p>No sermons available at the moment.</p>
          </div>
        )}

        <div className="mt-6 text-right max-w-6xl mx-auto">
          <a
            href="#"
            className="text-sm font-semibold text-gray-800 hover:underline flex items-center justify-end"
          >
            View all Sermons →
          </a>
        </div>
      </section>

      {/* Events */}
      <section className="py-16 px-5">
        <h2 className="text-center text-2xl font-bold mb-10">
          Recent Events
        </h2>

        {loadingEvent ? (
          <LoadingSkeleton count={4} />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 max-w-6xl mx-auto">
            {/* Display events */}
            {recentEvents.map((event, index) => (
              <motion.div
                key={`event-${event.id}`}
                className="bg-white p-6 rounded shadow-sm text-left relative"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                {event.start_datetime && (
                  <span className="absolute top-6 right-6 text-gray-700 font-bold text-center">
                    <span className="block text-2xl">
                      {formatDate(event.start_datetime).day}
                    </span>
                    <span className="text-sm">
                      {formatDate(event.start_datetime).month}
                    </span>
                  </span>
                )}
                <p className="text-xs uppercase text-orange-600 font-bold mb-2">
                  Event
                </p>
                <h3 className="text-lg font-semibold mb-3 w-[80%] truncate">{event.title}</h3>
                <p className="text-gray-600 text-sm leading-snug mb-6">
                  {event.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
                </p>
                <ul className="text-sm text-gray-700 space-y-2 mb-4">
                  {event.start_datetime && (
                    <li className="flex items-center gap-2">
                      <FiClock /> {new Date(event.start_datetime).toLocaleDateString()} {formatTime(event.start_datetime)}
                    </li>
                  )}
                  {event.location && (
                    <li className="flex items-center gap-2">
                      <FiMapPin /> {event.location}
                    </li>
                  )}
                </ul>
                <p onClick={()=>navigate(`/event/${event.id}`)} className="text-sm text-orange-600 font-semibold cursor-pointer">
                  Click Here For More Details →
                </p>
              </motion.div>
            ))}

          </div>
        )}
      </section>

      {/* Sermons */}
      <section className="py-16 px-5">
        <h2 className="text-center text-2xl font-bold mb-10">
          Recent Sermons
        </h2>

        {loadingSermon ? (
          <LoadingSkeleton count={4} />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 max-w-6xl mx-auto">

            {/* Display sermons */}
            {recentSermons.map((sermon, index) => (
              <motion.div
                key={`sermon-${sermon.id}`}
                className="bg-white p-6 rounded shadow-sm text-left relative"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: (index + 2) * 0.2 }}
                viewport={{ once: true }}
              >
                {sermon.created_at && (
                  <span className="absolute top-6 right-6 text-gray-700 font-bold text-center">
                    <span className="block text-2xl">
                      {formatDate(sermon.created_at).day}
                    </span>
                    <span className="text-sm">
                      {formatDate(sermon.created_at).month}
                    </span>
                  </span>
                )}
                <p className="text-xs uppercase text-orange-600 font-bold mb-2">
                  {sermon.sermon_type}
                </p>
                <h3 className="text-lg font-semibold mb-3 w-[80%]">{sermon.title}</h3>
                <p className="text-gray-600 text-sm leading-snug mb-6">
                  {sermon.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
                </p>
                <ul className="text-sm text-gray-700 space-y-2 mb-4">
                  <li className="flex items-center gap-2">
                    <FiClock /> Minister: {sermon.minister}
                  </li>
                  {sermon.created_at && (
                    <li className="flex items-center gap-2">
                      <FiClock /> Posted: {new Date(sermon.created_at).toLocaleDateString()}
                    </li>
                  )}
                </ul>
                <p 
                className="text-sm text-orange-600 font-semibold cursor-pointer"
                onClick={()=>navigate(`/sermons/${sermon.id}`)}
                >
                  Click Here To Watch This Sermon →
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default SermonsPage;