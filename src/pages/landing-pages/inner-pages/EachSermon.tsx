import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { formatToReadableDate } from "../../../constants/app-logic";
import { getEachSermon } from "../../../api/landing-page-services";
import type { AxiosResponse } from "axios";
import type { SermonPropType } from "../../../constants/basic-types";

const EachSermon = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sermonData, setSermonData] = useState<SermonPropType | null>(null);
  const [activeTab, setActiveTab] = useState<'INFO' | 'COMMENT'>('INFO');

  const getSermonFromApi = async () => {
    setLoading(true);
    setError(null);
    try {
      const mainId = Number(id);
      const res: AxiosResponse<SermonPropType> = await getEachSermon({ id: mainId });
      setSermonData(res.data);
    } catch (err) {
      console.error('Error fetching sermon:', err);
      setError('Failed to load sermon. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getSermonFromApi();
    } else {
      setError('Invalid sermon ID');
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main-orange mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading sermon...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Sermon</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={getSermonFromApi}
            className="mt-4 px-6 py-2 bg-main-orange text-white rounded-md hover:bg-orange-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Determine if we should show video or audio player
  const isAudioSermon = sermonData?.sermon_type?.toLowerCase() === 'audio';
  const mediaUrl =
    // sermonData?.file_url || 
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
  console.log(sermonData?.file_url)
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-16 px-4 md:px-12 lg:px-20 text-center max-w-7xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="uppercase text-sm bg-gradient-to-r from-[#A54E2B] to-[#DC9853] font-bold"
          style={{ backgroundClip: "text", WebkitTextFillColor: "transparent" }}
        >
          SERMON
        </motion.p>

        {/* Main headline */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-2xl md:text-3xl lg:text-4xl font-bold mt-2 mb-6 uppercase"
        >
          {sermonData?.title}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center items-center gap-2 flex-wrap"
        >
          <p className="text-gray-600">{formatToReadableDate(sermonData?.created_at || '')}</p>
          <span className="text-gray-400">•</span>
          <p className="text-gray-800 font-medium">By {sermonData?.minister}</p>
        </motion.div>

        <div className="my-8 flex flex-col gap-4">
          {/* Media player - changes based on sermon type */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={`${isAudioSermon ? 'flex flex-col justify-center' : ''} min-h-[300px] md:min-h-[400px] lg:min-h-[500px] bg-black rounded-lg overflow-hidden shadow-lg`}
          >
            {isAudioSermon ? (
              // Audio player
              <div className="w-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-8">
                <div className="w-full max-w-md text-center text-white">
                  <div className="mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-main-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                    <h3 className="text-xl font-semibold mt-4">AUDIO SERMON</h3>
                    <p className="text-gray-400 mt-2">Now Playing: {sermonData?.title}</p>
                  </div>
                  <audio
                    controls
                    className="w-full mt-4"
                    style={{ borderRadius: '0.5rem', overflow: 'hidden' }}
                  >
                    <source src={mediaUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              </div>
            ) : (
              // Video player
              <video
                controls
                width="100%"
                height="100%"
                style={{ borderRadius: '0.5rem', overflow: 'hidden' }}
                autoPlay
                muted
                playsInline
              >
                <source src={mediaUrl} />
                Your browser does not support the video tag.
              </video>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-6"
          >
            <div className="flex gap-4 text-lg">
              <button
                className={`cursor-pointer transition-colors relative ${activeTab === 'INFO'
                  ? "text-main-orange after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-1/2 after:bg-main-orange"
                  : "text-main-black hover:text-main-orange"
                  }`}
                onClick={() => setActiveTab('INFO')}
              >{isAudioSermon ? 'AUDIO INFORMATION' : 'VIDEO INFORMATION'}</button>
              <button
                className={`cursor-pointer transition-colors relative ${activeTab === 'COMMENT'
                  ? "text-main-orange after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-1/2 after:bg-main-orange"
                  : "text-main-black hover:text-main-orange"
                  }`}
                onClick={() => setActiveTab('COMMENT')}
              >COMMENTS</button>
            </div>
            <div className="flex gap-2">
              <button className="rounded-md flex items-center gap-1.5 py-2 px-4 bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                SHARE
              </button>
              <button className="rounded-md flex items-center gap-1.5 py-2 px-4 bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                DOWNLOAD
              </button>
            </div>
          </motion.div>

          {/* Line */}
          <div className="h-0.5 bg-gray-200 w-full my-4" />

          <AnimatePresence mode="wait">
            {activeTab === 'INFO' ? (
              <motion.div
                key="info"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6 text-left"
              >
                <p
                  style={{ backgroundClip: "text", WebkitTextFillColor: "transparent" }}
                  className="uppercase text-sm bg-gradient-to-r from-[#A54E2B] to-[#DC9853] font-bold inline-block self-start"
                >
                  {sermonData?.sermon_type}
                </p>
                <h1 className="uppercase text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                  {sermonData?.title}
                </h1>
                <div className="flex gap-3 text-gray-600 flex-wrap">
                  <p>{formatToReadableDate(sermonData?.updated_at || '')}</p>
                  <span>•</span>
                  <p>By {sermonData?.minister}</p>
                </div>
                <div className="prose max-w-none">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {sermonData?.description}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="comment"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center py-12"
              >
                <div className="text-center max-w-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <h3 className="text-2xl font-bold text-gray-700 mb-2">Comment Section</h3>
                  <p className="text-gray-500">The comment section is not available at the moment. Please check back later.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default EachSermon;