import { useState, type JSX } from "react";
import { FiUsers, FiCalendar, FiDollarSign, FiTrendingUp, FiDownload } from "react-icons/fi";
import StatCard from "../../components/StatCard";

interface Stat {
  id: number;
  title: string;
  value: string | number;
  icon: JSX.Element;
}

const AnalyticsPage: React.FC = () => {
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [timeRange, setTimeRange] = useState<string>("");

  const stats: Stat[] = [
    { id: 1, title: "Membership Growth", value: 245, icon: <FiUsers className="w-6 h-6 text-main-orange" /> },
    { id: 2, title: "Average Attendance", value: "78%", icon: <FiCalendar className="w-6 h-6 text-main-orange" /> },
    { id: 3, title: "Donation Growth", value: "$12,300", icon: <FiDollarSign className="w-6 h-6 text-main-orange" /> },
    { id: 4, title: "Event Engagement", value: 320, icon: <FiTrendingUp className="w-6 h-6 text-main-orange" /> },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Comprehensive church growth and engagement analytics
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

          <select
            className="border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50 transition"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="">Last 6 Months</option>
            <option value="3">Last 3 Months</option>
            <option value="12">Last 12 Months</option>
            <option value="all">All Time</option>
          </select>

          <button className="flex items-center bg-white border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50 transition">
            <FiDownload className="mr-2" /> Export Report
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

export default AnalyticsPage;
