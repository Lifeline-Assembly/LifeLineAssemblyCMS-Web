import type { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { EventPropType } from "../../../constants/basic-types";
import { getEachEvent } from "../../../api/landing-page-services";
import { formatToReadableDate } from "../../../constants/app-logic";

const EachEvent = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventData, setEventData] = useState<EventPropType | null>(null);

  const getEventFromApi = async () => {
    setLoading(true);
    setError(null);
    try {
      const mainId = Number(id);
      const res: AxiosResponse<EventPropType> = await getEachEvent({ id: mainId });
      setEventData(res.data);
    } catch (err) {
      console.error("Error fetching event:", err);
      setError("Failed to load event. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  console.log(eventData)
  useEffect(() => {
    if (id) {
      getEventFromApi();
    } else {
      setError("Invalid event ID");
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return <div className="text-center py-10">Loading event...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }

  if (!eventData) {
    return <div className="text-center py-10">No event found.</div>;
  }

  const formattedDate = eventData.start_datetime
    ? formatToReadableDate(eventData.start_datetime)
    : "TBA";

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 py-10">
      {/* LEFT SECTION */}
      <div className="max-sm:px-6">
        {eventData.banner && (
          <img
            src={eventData.banner}
            alt={eventData.title}
            className="w-full h-64 object-cover rounded-md"
          />
        )}

        <p className="text-orange-600 uppercase mt-4 text-sm font-semibold">
          Upcoming Event
        </p>

        <h1 className="text-2xl md:text-3xl font-bold mt-2">
          {eventData.title}
        </h1>

        <p className="text-gray-700 mt-4">{eventData.description}</p>

        <blockquote className="bg-gray-100 border-l-4 border-orange-500 p-4 my-6 text-gray-700">
          {eventData.description}
        </blockquote>

        <p className="text-gray-700">{eventData.description}</p>

        <a
          href="#"
          className="inline-flex items-center text-sm font-medium text-orange-600 mt-4"
        >
          Click here to view other events
          <span className="ml-2">▶</span>
        </a>
      </div>

      {/* RIGHT SECTION */}
      <div className="bg-[#F7F8FA] p-6 rounded-md shadow-sm">
        <h2 className="text-xl font-bold mb-4">Register Now</h2>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
          <span>📍 {eventData.location || "Location not available"}</span>
          <span>📅 {formattedDate}</span>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full border-b border-gray-300 focus:outline-none py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border-b border-gray-300 focus:outline-none py-2"
            />
          </div>

          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md w-full"
          >
            Register Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default EachEvent;
