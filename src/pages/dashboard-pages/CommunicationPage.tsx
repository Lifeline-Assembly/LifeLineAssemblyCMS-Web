import { useState, type JSX } from "react";
import { FiUsers, FiCalendar, FiDollarSign, FiTrendingUp, FiDownload, FiPlus } from "react-icons/fi";
import StatCard from "../../components/StatCard";

interface Stat {
  id: number;
  title: string;
  value: string | number;
  icon: JSX.Element;
}

const CommunicationPage: React.FC = () => {
  const [selectedBranch, setSelectedBranch] = useState<string>("");

  const stats: Stat[] = [
    { id: 1, title: "Messages Sent", value: 124, icon: <FiUsers className="w-6 h-6 text-main-orange" /> },
    { id: 2, title: "Announcements", value: 35, icon: <FiCalendar className="w-6 h-6 text-main-orange" /> },
    { id: 3, title: "Subscribers", value: 560, icon: <FiDollarSign className="w-6 h-6 text-main-orange" /> },
    { id: 4, title: "Engagement Rate", value: "72%", icon: <FiTrendingUp className="w-6 h-6 text-main-orange" /> },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Communication</h1>
          <p className="text-gray-500 mt-1">
            Send messages, announcements, and manage church communications effectively
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            className="border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50 transition"
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
          >
            <option value="">Select Branch</option>
            <option value="north">North Branch</option>
            <option value="south">South Branch</option>
            <option value="east">East Branch</option>
            <option value="west">West Branch</option>
          </select>

          <button className="flex items-center bg-white border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50 transition">
            <FiDownload className="mr-2" /> Export
          </button>

          <button className="flex items-center bg-main-orange text-white rounded-md px-4 py-2 hover:bg-orange-300 transition">
            <FiPlus className="mr-2" /> New Message
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.id} title={stat.title} value={stat.value} icon={stat.icon} />
        ))}
      </div>
    </div>
  );
};

export default CommunicationPage;
