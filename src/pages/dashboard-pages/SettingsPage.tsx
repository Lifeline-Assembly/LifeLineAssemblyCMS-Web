import { useState } from "react";
import { FiSave } from "react-icons/fi";

import Tabs from "../../components/Tabs";
import GeneralTab from "../../components/settings/tabs/GeneralTab";
import ModulesTab from "../../components/settings/tabs/ModulesTab";
import NotificationsTab from "../../components/settings/tabs/NotificationsTab";
import IntegrationTab from "../../components/settings/tabs/IntegrationTab";
import BackupTab from "../../components/settings/tabs/BackupTab";
import AdvancedTab from "../../components/settings/tabs/AdvancedTab";

const tabs = [
  "General",
  "Modules",
  "Notifications",
  "Integration",
  "Backup",
  "Advanced",
];

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("General");

  const [generalSettings, setGeneralSettings] = useState({
    churchName: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    avatar: "",
    timezone: "UTC",
    language: "en",
    dateFormat: "MM/DD/YYYY",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setGeneralSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setGeneralSettings((prev) => ({
          ...prev,
          avatar: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    console.log("Saving settings:", { generalSettings });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
        <div>
          <h1 className="text-2xl font-medium">System Settings</h1>
          <p className="text-gray-500 mt-1">
            Configure system preferences and global settings
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center bg-main-orange text-white rounded-md px-4 py-2 hover:bg-orange-300 transition"
        >
          <FiSave className="mr-2" />
          Save Changes
        </button>
      </div>

      {/* Tab Navigation */}
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      {activeTab === "General" && (
        <GeneralTab
          settings={generalSettings}
          onChange={handleChange}
          onAvatarChange={handleAvatarChange}
        />
      )}
      {activeTab === "Modules" && <ModulesTab />}
      {activeTab === "Notifications" && <NotificationsTab />}
      {activeTab === "Integration" && <IntegrationTab />}
      {activeTab === "Backup" && <BackupTab />}
      {activeTab === "Advanced" && <AdvancedTab />}
    </div>
  );
};

export default SettingsPage;
