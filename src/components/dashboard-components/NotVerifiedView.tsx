import React from "react";
import { FiClock, FiLogOut } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";

const NotVerifiedView: React.FC = () => {
  const { logout } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-orange-100 p-4 rounded-full">
            <FiClock className="w-12 h-12 text-main-orange" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Verification Pending
        </h2>

        <p className="text-gray-600 mb-8">
          Your account is currently undergoing verification. Please wait for an admin to review and approve your details. You will be notified once the process is complete.
        </p>

        <button
          onClick={logout}
          className="flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-main-orange hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-main-orange transition-colors"
        >
          <FiLogOut className="mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default NotVerifiedView;
