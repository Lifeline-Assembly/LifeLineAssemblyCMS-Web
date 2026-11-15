import React, { useState } from "react";

const IntegrationTab: React.FC = () => {
  const [integrations, setIntegrations] = useState({
    googleCalendar: false,
    stripe: true,
    mailchimp: false,
  });

  const handleToggle = (name: keyof typeof integrations) => {
    setIntegrations((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="bg-white rounded-md p-4">
      <h2 className="text-lg font-semibold mb-2">Integration</h2>
      <p className="text-gray-600 mb-6">
        Connect external services and integrations.
      </p>

      <div className="space-y-4">
        {Object.entries(integrations).map(([key, value]) => (
          <label
            key={key}
            className="flex items-center justify-between border border-gray-200 rounded-md px-4 py-2 cursor-pointer"
          >
            <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
            <input
              type="checkbox"
              checked={value}
              onChange={() => handleToggle(key as keyof typeof integrations)}
              className="h-5 w-5 accent-main-orange"
            />
          </label>
        ))}
      </div>
    </div>
  );
};

export default IntegrationTab;
