import { type JSX } from "react";
import { FiUserPlus, FiUsers, FiUserX } from "react-icons/fi";
import StatCard from "../../components/StatCard";

interface Stat {
  id: number;
  title: string;
  value: string | number;
  icon: JSX.Element;
}

const UserAccessPage: React.FC = () => {
  const stats: Stat[] = [
    { id: 1, title: "Active Users", value: 245, icon: <FiUsers className="w-6 h-6 text-main-orange" /> },
    { id: 2, title: "Inactive Users", value: 12, icon: <FiUserX className="w-6 h-6 text-main-orange" /> },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">User Access</h1>
          <p className="text-gray-500 mt-1">Manage church staff accounts</p>
        </div>

        {/* Add User Button */}
        <button className="flex items-center bg-main-orange text-white rounded-md px-4 py-2 hover:bg-orange-300 transition">
          <FiUserPlus className="mr-2" /> Add New User
        </button>
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

export default UserAccessPage;
