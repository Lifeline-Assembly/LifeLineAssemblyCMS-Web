import React, { useState } from "react";

const AdvancedTab: React.FC = () => {
  const [settings, setSettings] = useState({
    developerMode: false,
    maintenanceMode: false,
  });

  const handleChange = (name: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="bg-white rounded-md p-4">
      <h2 className="text-lg font-semibold mb-2">Advanced</h2>
      <p className="text-gray-600 mb-6">
        Advanced system settings for administrators.
      </p>

      <div className="space-y-4">
        <label className="flex items-center justify-between border border-gray-200 rounded-md px-4 py-2 cursor-pointer">
          <span>Developer Mode</span>
          <input
            type="checkbox"
            checked={settings.developerMode}
            onChange={() => handleChange("developerMode")}
            className="h-5 w-5 accent-main-orange"
          />
        </label>

        <label className="flex items-center justify-between border border-gray-200 rounded-md px-4 py-2 cursor-pointer">
          <span>Maintenance Mode</span>
          <input
            type="checkbox"
            checked={settings.maintenanceMode}
            onChange={() => handleChange("maintenanceMode")}
            className="h-5 w-5 accent-main-orange"
          />
        </label>
      </div>
    </div>
  );
};

export default AdvancedTab;
