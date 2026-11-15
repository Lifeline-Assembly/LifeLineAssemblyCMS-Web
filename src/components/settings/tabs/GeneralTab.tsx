import React from "react";

interface GeneralTabProps {
  settings: {
    churchName: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    avatar: string;
    timezone: string;
    language: string;
    dateFormat: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const GeneralTab: React.FC<GeneralTabProps> = ({ settings, onChange, onAvatarChange }) => {
  return (
    <>
        <div className="bg-white rounded-md p-4">
            <h2 className="text-lg font-semibold mb-4">Church Information</h2>
            <p className="text-gray-600 mb-12">
                Basic church details and contact information.
            </p>

            {/* Avatar Section */}
            <div className="mb-12 flex items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                <img
                    src={settings.avatar || "/avatar.png"}
                    alt="Church Avatar"
                    className="w-full h-full object-cover"
                />
                </div>

                <div className="flex flex-col">
                <h3 className="text-lg font-semibold">
                    {settings.churchName || "Church Name"}
                </h3>
                <p className="text-gray-600">
                    {settings.email || "church@email.com"}
                </p>

                <label className="mt-3">
                    <input
                    type="file"
                    accept="image/*"
                    onChange={onAvatarChange}
                    className="hidden"
                    />
                    <span className="inline-block bg-main-orange text-white px-4 py-2 rounded-md text-sm font-medium cursor-pointer hover:bg-orange-300 transition">
                    Change Avatar
                    </span>
                </label>
                </div>
            </div>

            {/* Church Info Form */}
            <form className="space-y-4 mb-12">
                <div>
                <label className="block text-sm font-medium mb-1">Church Name</label>
                <input
                    type="text"
                    name="churchName"
                    value={settings.churchName}
                    onChange={onChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-main-orange"
                    placeholder="Enter church name"
                />
                </div>
                <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <input
                    type="text"
                    name="address"
                    value={settings.address}
                    onChange={onChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-main-orange"
                    placeholder="123 Church Street, City"
                />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <input
                    type="text"
                    name="phone"
                    value={settings.phone}
                    onChange={onChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-main-orange"
                    placeholder="+1 (555) 123-4567"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                    type="email"
                    name="email"
                    value={settings.email}
                    onChange={onChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-main-orange"
                    placeholder="contact@church.org"
                    />
                </div>
                </div>
                <div>
                <label className="block text-sm font-medium mb-1">Website</label>
                <input
                    type="url"
                    name="website"
                    value={settings.website}
                    onChange={onChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-main-orange"
                    placeholder="https://church.org"
                />
                </div>
            </form>            
        </div>
        
        <div className="bg-white rounded-md p-4">
            {/* System Preferences */}
            <h2 className="text-lg font-semibold mb-4">System Preferences</h2>
            <p className="text-gray-600 mb-6">
                Configure how the system behaves globally.
            </p>

            <form className="space-y-4">
                <div>
                <label className="block text-sm font-medium mb-1">Timezone</label>
                <select
                    name="timezone"
                    value={settings.timezone}
                    onChange={onChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-main-orange"
                >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">America/New_York</option>
                    <option value="Europe/London">Europe/London</option>
                    <option value="Africa/Lagos">Africa/Lagos</option>
                </select>
                </div>
                <div>
                <label className="block text-sm font-medium mb-1">Language</label>
                <select
                    name="language"
                    value={settings.language}
                    onChange={onChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-main-orange"
                >
                    <option value="en">English</option>
                    <option value="fr">French</option>
                    <option value="es">Spanish</option>
                </select>
                </div>
                <div>
                <label className="block text-sm font-medium mb-1">Date Format</label>
                <select
                    name="dateFormat"
                    value={settings.dateFormat}
                    onChange={onChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-main-orange"
                >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
                </div>
            </form>
        </div>
    </>
  );
};

export default GeneralTab;
