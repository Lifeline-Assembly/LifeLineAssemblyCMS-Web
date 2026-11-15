import React, { useState } from "react";

const ModulesTab: React.FC = () => {
  const [modules, setModules] = useState({
    attendance: true,
    giving: true,
    events: false,
    messaging: false,
  });

  const handleToggle = (name: keyof typeof modules) => {
    setModules((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="bg-white rounded-md p-4">
      <h2 className="text-lg font-semibold mb-2">Modules</h2>
      <p className="text-gray-600 mb-6">
        Enable or disable system modules.
      </p>

      <div className="space-y-4">
        {Object.entries(modules).map(([key, value]) => (
          <label
            key={key}
            className="flex items-center justify-between border border-gray-200 rounded-md px-4 py-2 cursor-pointer"
          >
            <span className="capitalize">{key}</span>
            <input
              type="checkbox"
              checked={value}
              onChange={() => handleToggle(key as keyof typeof modules)}
              className="h-5 w-5 accent-main-orange"
            />
          </label>
        ))}
      </div>
    </div>
  );
};

export default ModulesTab;
