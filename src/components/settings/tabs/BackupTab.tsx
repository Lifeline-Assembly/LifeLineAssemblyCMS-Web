import React from "react";

const BackupTab: React.FC = () => {
  const handleBackupNow = () => {
    console.log("Backup started...");
    alert("Backup started!");
  };

  return (
    <div className="bg-white rounded-md p-4">
      <h2 className="text-lg font-semibold mb-2">Backup</h2>
      <p className="text-gray-600 mb-6">
        Configure backup and recovery options.
      </p>

      <div className="space-y-6">
        <button
          onClick={handleBackupNow}
          className="bg-main-orange text-white px-4 py-2 rounded-md hover:bg-orange-300 transition"
        >
          Backup Now
        </button>

        <div>
          <label className="block text-sm font-medium mb-1">Automatic Backup Frequency</label>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-main-orange"
            defaultValue="daily"
          >
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default BackupTab;
