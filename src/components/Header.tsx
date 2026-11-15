import { useState } from "react";
import { FaChevronDown, FaTimes } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import { NavLink } from "react-router-dom";
import { LogoSvg } from "../assets/svgs";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { label: "HOME", path: "/" },
    { label: "ABOUT US", path: "/about" },
    { label: "SERMONS & EVENTS", path: "/sermons" },
    { label: "BLOG", path: "/blog" },
    { label: "GALLERY", path: "/gallery" },
    { label: "CONTACT", path: "/contact" },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="w-full bg-main-black text-white sticky top-0 z-50">
      <nav className="max-w-[1300px] mx-auto flex items-center justify-between px-4 lg:px-6">
        {/* Left - Logo */}
        <NavLink className="flex items-center gap-2 py-4" to='/'>
          <img src={LogoSvg} alt="Lifeline Assembly" className="h-8" />
        </NavLink>

        {/* Middle - Menu */}
        <ul className="hidden md:flex items-center gap-8 text-sm font-medium py-4">
          {menuItems.map(({ label, path }) => (
            <li key={label}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `cursor-pointer transition-colors relative ${
                    isActive
                      ? "text-main-orange after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-1/2 after:bg-main-orange"
                      : "text-white hover:text-main-orange"
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right - Actions */}
        <div className="flex items-center gap-4 py-4">
          <NavLink to="/login">
            <button className="px-4 py-2 font-semibold rounded-md hover:bg-white hover:text-black transition hidden sm:block">
              LOGIN
            </button>
          </NavLink>
          <NavLink to="/register">
            <button className="px-4 py-2 bg-main-orange rounded-lg font-semibold hover:bg-orange-600 transition">
              REGISTER
            </button>
          </NavLink>

          {/* Language selector */}
          <div className="hidden md:flex items-center gap-1 cursor-pointer ml-2">
            <img
              src="https://flagcdn.com/w20/gb.png"
              srcSet="https://flagcdn.com/w40/gb.png 2x"
              alt="English"
              className="w-5 h-5 rounded-full"
            />
            <span>En</span>
            <FaChevronDown size={12} />
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden ml-2" onClick={toggleMenu}>
            {isMenuOpen ? <FaTimes size={24} /> : <RxHamburgerMenu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-main-black pb-4 px-4">
          <ul className="flex flex-col gap-4 text-sm font-medium">
            {menuItems.map(({ label, path }) => (
              <li key={label}>
                <NavLink
                  to={path}
                  className={({ isActive }) =>
                    `block py-2 px-4 rounded-lg transition-colors ${
                      isActive
                        ? "bg-main-orange text-white"
                        : "text-white hover:bg-gray-800"
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  {label}
                </NavLink>
              </li>
            ))}
            <li className="pt-4 border-t border-gray-700">
              <NavLink to="/login" onClick={() => setIsMenuOpen(false)}>
                <button className="w-full py-2 px-4 font-semibold rounded-md bg-gray-800 hover:bg-gray-700 transition mb-2">
                  LOGIN
                </button>
              </NavLink>
              <div className="flex items-center justify-center gap-1 cursor-pointer pt-2">
                <img
                  src="https://flagcdn.com/w20/gb.png"
                  srcSet="https://flagcdn.com/w40/gb.png 2x"
                  alt="English"
                  className="w-5 h-5 rounded-full"
                />
                <span>English</span>
                <FaChevronDown size={12} />
              </div>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
