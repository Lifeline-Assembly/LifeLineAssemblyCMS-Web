import React from "react";
import { FaClock, FaMapMarkerAlt, FaEye } from "react-icons/fa";

const UpcomingSermon: React.FC = () => {
 
  return (
    <section className="w-full bg-white py-14 px-5 md:px-16">
      <div className="text-center mb-10">
        <p className="text-sm text-main-black uppercase tracking-widest">
          Upcoming Sermons 
        </p>
        <h2 className="text-2xl md:text-4xl font-bold text-main-black mt-2">
          JOIN US AND BECOME PART <br /> OF SOMETHING GREAT
        </h2>
      </div>

      {/* Content Grid */}
      <div className="max-w-6xl mx-auto flex md:flex-row flex-col-reverse">
        {/* Left Card */}
        <div className="bg-light-orange sm:p-18 p-6 flex flex-col justify-between md:w-[50%] relative">
          <div className="text-right absolute top-12 right-12">
            <p className="text-2xl font-bold">20</p>
            <p className="text-base uppercase">July</p>
          </div>
          <div>
            <p
            style={{ backgroundClip: "text", WebkitTextFillColor: "transparent" }} 
            className="text-xs bg-gradient-to-r from-[#A54E2B] to-[#DC9853] font-bold uppercase">
              Upcoming Event
            </p>
            <div className="flex justify-between items-start mt-2">
              <h3 className="text-2xl font-bol leading-snug">
                WATCH AND LISTEN <br /> TO OUR SERMONS
              </h3>

            </div>
            <p className="text-base mt-3">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
            </p>

            {/* Times */}
            <div className="mt-5 space-y-2">
              <div className="flex items-start gap-2 ">
                <FaClock className="" />
                <span className="text-base">
                  Friday 23:39 WAT <br /> Saturday 11:20 WAT
                </span>
              </div>
              <div className="flex items-start gap-2 ">
                <FaMapMarkerAlt className="" />
                <span className="text-base">Umuahia, Abia State</span>
              </div>
            </div>
          </div>

          {/* Register Button */}
          <div className="mt-6">
            <button className="bg-gray-900 text-main-orange py-6 sm:px-16 px-10 rounded-xl font-semiboldfont-semibold hover:bg-gray-800 transition">
              REGISTER
            </button>
            <p className="mt-3 text-sm text-[#0D0D0D] flex items-center gap-1">
              Click Here To Stream This Sermon Live
              <span className="text-orange-500 font-bold">▶</span>
            </p>
          </div>
        </div>

        {/* Right Video */}
        <div className="relative w-full h-64 md:h-auto">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="Sermon Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          {/* Video Info */}
          <div className="absolute bottom-0 left-0 w-full bg-black/70 text-white flex justify-between items-center px-4 py-2 text-sm rounded-b-md">
            <div className="flex items-center gap-2">
              <FaEye /> <span>190,000 Viewers</span>
            </div>
            <span>07:16</span>
          </div>
        </div>
      </div>

      {/* Bottom link */}
      <div className="text-right mt-6 max-w-6xl mx-auto">
        <a
          href="#"
          className="text-gray-900 font-medium hover:underline flex items-center justify-end gap-2"
        >
          View all Sermons →
        </a>
      </div>
    </section>
  );
};

export default UpcomingSermon;
