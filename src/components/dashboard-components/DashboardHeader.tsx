import { useState, useRef, useEffect } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoChevronDown } from "react-icons/io5";
import { TbMenu2 } from "react-icons/tb";
import InputSearch from "../inputs/InputSearch";
import { useAuth } from "../../hooks/useAuth";
import { convertToSpacedText } from "../../constants/app-logic";

interface DashboardHeaderProps {
  onMenuClick?: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onMenuClick }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { user, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex gap-2 items-center">
      <div className="flex flex-1 items-center justify-between bg-white rounded-md h-16 px-4">
        {/* Mobile hamburger menu button */}
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors mr-2"
            aria-label="Open menu"
          >
            <TbMenu2 size={24} className="text-gray-700" />
          </button>
        )}

        <div className="flex-1 max-w-md">
          <InputSearch />
        </div>

        <button className="ml-4 relative p-2 rounded-full hover:bg-gray-100 transition">
          <IoMdNotificationsOutline size={22} className="text-gray-700" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
        </button>
      </div>

      <div className="relative w-48 hidden md:block" ref={dropdownRef}>
        <button
          onClick={() => setOpen(!open)}
          className="w-full bg-white rounded-md h-16 flex items-center px-4 gap-2 hover:bg-gray-50 transition"
          aria-haspopup="true"
          aria-expanded={open}
        >
          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
            <img
              src="/avatar.png"
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col truncate text-left">
            <p className="text-gray-700 font-medium leading-tight truncate">{user?.firstname || 'User Name'}</p>
            <p className="text-xs text-gray-500 truncate">{convertToSpacedText(user?.role as string || '')}</p>
          </div>

          <IoChevronDown
            className={`ml-auto text-gray-600 transform transition-transform duration-200 ${open ? "rotate-180" : ""
              }`}
            size={18}
          />
        </button>

        <div
          className={`absolute right-0 mt-2 w-full bg-white rounded-md shadow-md py-2 z-50 transform transition-all duration-200 origin-top ${open ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
            }`}
        >
          {["Profile", "Settings"].map((item) => (
            <button
              onClick={() => { }}
              key={item}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
            >
              {item}
            </button>
          ))}
          <button
            onClick={() => logout()}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
