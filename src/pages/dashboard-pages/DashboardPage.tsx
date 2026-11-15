import { useState } from "react";
import {
  FiUsers,
  FiTrendingUp,
  FiCalendar,
  FiDollarSign,
  FiCalendar as FiSchedule,
} from "react-icons/fi";
import StatCard from "../../components/StatCard";
import { useAuth } from "../../hooks/useAuth";

// Recharts
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedBranch, setSelectedBranch] = useState("");

  // Stats
  const stats = [
    {
      id: 1,
      title: "Total Members",
      value: 245,
      icon: <FiUsers className="w-6 h-6 text-main-orange" />,
    },
    {
      id: 2,
      title: "Monthly Growth",
      value: "12%",
      icon: <FiTrendingUp className="w-6 h-6 text-main-orange" />,
    },
    {
      id: 3,
      title: "Weekly Attendance",
      value: 180,
      icon: <FiCalendar className="w-6 h-6 text-main-orange" />,
    },
    {
      id: 4,
      title: "Monthly Donations",
      value: "$1,230",
      icon: <FiDollarSign className="w-6 h-6 text-main-orange" />,
    },
  ];

  // Chart Data
  const attendanceData = [
    { week: "Week 1", attendance: 160 },
    { week: "Week 2", attendance: 180 },
    { week: "Week 3", attendance: 175 },
    { week: "Week 4", attendance: 190 },
  ];

  const donationData = [
    { month: "Jan", amount: 1200 },
    { month: "Feb", amount: 980 },
    { month: "Mar", amount: 1500 },
    { month: "Apr", amount: 1700 },
  ];

  const demographicsData = [
    { name: "Men", value: 120 },
    { name: "Women", value: 100 },
    { name: "Children", value: 60 },
  ];

  const colors = ["#fb923c", "#fdba74", "#fed7aa"];

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            An overview of your church’s activities
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            className="border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50"
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
          >
            <option value="">Select Branch</option>
            <option value="north">North Branch</option>
            <option value="south">South Branch</option>
            <option value="east">East Branch</option>
            <option value="west">West Branch</option>
          </select>

          <button className="flex items-center bg-white border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50">
            <FiSchedule className="mr-2" /> Schedule Events
          </button>

          <button className="flex items-center bg-white border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50">
            <FiDollarSign className="mr-2" /> Record Donations
          </button>
        </div>
      </div>

      {/* Welcome Banner */}
      <div className="bg-main-orange rounded-md p-4">
        <h2 className="text-lg text-white font-medium">
          Welcome back,{" "}
          {user?.role === "super_admin" ? "Admin" : user?.firstname || "User"}
        </h2>
        <p className="text-gray-100 mt-1">
          Here’s what’s happening in your church today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Attendance Chart */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-3">Attendance Overview</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="attendance"
                fill="#f97316"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Donations Line Chart */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-3">Donation Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={donationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#f97316"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Demographics Pie Chart */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-3">Member Demographics</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={demographicsData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
                dataKey="value"
              >
                {demographicsData.map((_entry, index) => (
                  <Cell key={index} fill={colors[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
