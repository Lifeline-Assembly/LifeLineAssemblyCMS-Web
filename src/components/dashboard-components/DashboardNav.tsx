import { NavLink } from "react-router-dom";
import {
  TbLayoutDashboard,
  TbUsers,
  TbChartBar,
  TbUserCheck,
  TbUser,
  TbCalendarEvent,
  TbCurrencyDollar,
  TbMessageCircle,
  TbSettings,
  TbDatabase,
  TbShieldLock,
  TbLogout,
  TbChevronDown,
  TbChevronUp,
  TbFileText,
  TbSpeakerphone,
  TbX,
} from "react-icons/tb";
import { useState } from "react";
import type { IconType } from "react-icons";
import { useAuth } from "../../hooks/useAuth";

interface DashboardNavProps {
  onClose?: () => void;
}

const navItems = [
  {
    section: "General",
    links: [
      { name: "Dashboard", to: ".", icon: TbLayoutDashboard },
      { name: "User Access", to: "user-access", icon: TbUserCheck },
      { name: "Analytics", to: "analytics", icon: TbChartBar },
    ],
  },
  {
    section: "Management",
    links: [
      { name: "Members", to: "members", icon: TbUsers },
      { name: "Pastors", to: "pastors", icon: TbUser },
      { name: "Staff", to: "staff", icon: TbUser },
      {
        name: "Appointments",
        to: "appointments",
        icon: TbUser,
        subItems: [
          { name: "Appointments", to: "appointments", icon: TbCalendarEvent },
          { name: "Prayer Requests", to: "prayer-requests", icon: TbFileText },
        ]
      },
      {
        name: "Publish",
        to: "publish",
        icon: TbSpeakerphone,
        subItems: [
          { name: "Events", to: "events", icon: TbCalendarEvent },
          { name: "Sermons", to: "sermons", icon: TbFileText },
          { name: "Blogs", to: "blogs", icon: TbFileText },
        ]
      },
      { name: "Financials", to: "financials", icon: TbCurrencyDollar },
      { name: "Communication", to: "communication", icon: TbMessageCircle },
    ],
  },
  {
    section: "System",
    links: [
      { name: "Settings", to: "settings", icon: TbSettings },
      { name: "Data Management", to: "data-management", icon: TbDatabase },
      { name: "Security", to: "security", icon: TbShieldLock },
    ],
  },
];

const pastorsNavItem = [
  {
    section: "General",
    links: [
      { name: "Dashboard", to: ".", icon: TbLayoutDashboard },
      { name: "User Access", to: "user-access", icon: TbUserCheck },
      { name: "Analytics", to: "analytics", icon: TbChartBar },
    ],
  },
  {
    section: "Management",
    links: [
      { name: "Pastors", to: "pastors", icon: TbUser },
      {
        name: "Appointments",
        to: "appointments",
        icon: TbUser,
        subItems: [
          { name: "Appointments", to: "appointments", icon: TbCalendarEvent },
          { name: "Prayer Requests", to: "prayer-requests", icon: TbFileText },
        ]
      },
      {
        name: "Publish",
        to: "publish",
        icon: TbSpeakerphone,
        subItems: [
          { name: "Events", to: "events", icon: TbCalendarEvent },
          { name: "Sermons", to: "sermons", icon: TbFileText },
          { name: "Blogs", to: "blogs", icon: TbFileText },
        ]
      },
      { name: "Financials", to: "financials", icon: TbCurrencyDollar },
      { name: "Communication", to: "communication", icon: TbMessageCircle },
    ],
  },
  {
    section: "System",
    links: [
      { name: "Settings", to: "settings", icon: TbSettings },
      { name: "Data Management", to: "data-management", icon: TbDatabase },
      { name: "Security", to: "security", icon: TbShieldLock },
    ],
  },
];

const membersNavItem = [
  {
    section: "General",
    links: [
      { name: "Dashboard", to: ".", icon: TbLayoutDashboard },
      { name: "User Access", to: "user-access", icon: TbUserCheck },
      { name: "Analytics", to: "analytics", icon: TbChartBar },
    ],
  },
  {
    section: "Management",
    links: [
      {
        name: "Appointments",
        to: "appointments",
        icon: TbUser,
        subItems: [
          { name: "Appointments", to: "appointments", icon: TbCalendarEvent },
          { name: "Prayer Requests", to: "prayer-requests", icon: TbFileText },
        ]
      },
      {
        name: "Publish",
        to: "publish",
        icon: TbSpeakerphone,
        subItems: [
          { name: "Events", to: "events", icon: TbCalendarEvent },
          { name: "Sermons", to: "sermons", icon: TbFileText },
          { name: "Blogs", to: "blogs", icon: TbFileText },
        ]
      },
      { name: "Financials", to: "financials", icon: TbCurrencyDollar },
      { name: "Communication", to: "communication", icon: TbMessageCircle },
    ],
  },
  {
    section: "System",
    links: [
      { name: "Settings", to: "settings", icon: TbSettings },
      { name: "Data Management", to: "data-management", icon: TbDatabase },
      { name: "Security", to: "security", icon: TbShieldLock },
    ],
  },
];

const DashboardNav = ({ onClose }: DashboardNavProps) => {
  const { user } = useAuth();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const isActiveParent = (subItems: Array<{
    name: string;
    to: string;
    icon: IconType;
  }>) => {
    return subItems.some(item =>
      window.location.pathname.includes(item.to)
    );
  };

  const handleNavClick = () => {
    // Close mobile menu when a nav item is clicked
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="flex flex-col h-full space-y-2">
      <div className="py-2.5 px-4 bg-white rounded-md h-16 flex items-center justify-between shrink-0">
        <h3 className="text-xl font-bold">Lifeline Assembly</h3>
        {/* Mobile close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <TbX className="text-xl text-gray-700" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {(user?.role === "pastor" ? pastorsNavItem : user?.role === "super_admin" ? navItems : membersNavItem).map(({ section, links }) => (
          <div key={section} className="bg-white rounded-md p-4">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">
              {section}
            </h4>
            <ul className="space-y-1">
              {links.map(({ name, to, icon: Icon, subItems }) => (
                <li key={name}>
                  {subItems ? (
                    // Dropdown menu item
                    <div>
                      <button
                        onClick={() => toggleDropdown(name)}
                        className={`flex items-center justify-between w-full px-3 py-2 rounded-md transition-colors ${isActiveParent(subItems)
                          ? "bg-orange-50 border-l-4 border-main-orange text-main-orange"
                          : "text-gray-700 hover:bg-gray-100 hover:text-main-orange"
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon
                            className={`text-lg ${isActiveParent(subItems) ? "text-main-orange" : ""
                              }`}
                          />
                          <span>{name}</span>
                        </div>
                        {openDropdown === name ? (
                          <TbChevronUp className="text-lg" />
                        ) : (
                          <TbChevronDown className="text-lg" />
                        )}
                      </button>

                      {/* Submenu items */}
                      {openDropdown === name && (
                        <ul className="ml-6 mt-1 space-y-1 border-l-2 border-gray-200 pl-3">
                          {subItems.map((subItem) => (
                            <li key={subItem.name}>
                              <NavLink
                                to={subItem.to}
                                end
                                onClick={handleNavClick}
                                className={({ isActive }) =>
                                  `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${isActive
                                    ? "bg-orange-50 text-main-orange"
                                    : "text-gray-700 hover:bg-gray-100 hover:text-main-orange"
                                  }`
                                }
                              >
                                {({ isActive }) => (
                                  <>
                                    <subItem.icon
                                      className={`text-lg ${isActive ? "text-main-orange" : ""
                                        }`}
                                    />
                                    <span>{subItem.name}</span>
                                  </>
                                )}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    // Regular menu item
                    <NavLink
                      to={to}
                      end
                      onClick={handleNavClick}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${isActive
                          ? "bg-orange-50 border-l-4 border-main-orange"
                          : "text-gray-700 hover:bg-gray-100 hover:text-main-orange"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <Icon
                            className={`text-lg ${isActive ? "text-main-orange" : ""
                              }`}
                          />
                          <span>{name}</span>
                        </>
                      )}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="py-2.5 px-4 bg-white rounded-md">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 w-full rounded-md text-gray-700 hover:bg-red-100 hover:text-red-600 transition-colors"
        >
          <TbLogout className="text-lg" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardNav;