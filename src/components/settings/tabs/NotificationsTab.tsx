import React, { useState } from "react";

const NotificationsTab: React.FC = () => {
  const [preferences, setPreferences] = useState({
    email: true,
    sms: false,
    push: true,
  });

  const handleChange = (name: keyof typeof preferences) => {
    setPreferences((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="bg-white rounded-md p-4">
      <h2 className="text-lg font-semibold mb-2">Notifications</h2>
      <p className="text-gray-600 mb-6">
        Manage notification preferences and alerts.
      </p>

      <div className="space-y-4">
        {Object.entries(preferences).map(([key, value]) => (
          <label
            key={key}
            className="flex items-center justify-between border border-gray-200 rounded-md px-4 py-2 cursor-pointer"
          >
            <span className="capitalize">{key} Notifications</span>
            <input
              type="checkbox"
              checked={value}
              onChange={() => handleChange(key as keyof typeof preferences)}
              className="h-5 w-5 accent-main-orange"
            />
          </label>
        ))}
      </div>
    </div>
  );
};

export default NotificationsTab;
