import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { OrangeLogo } from "../assets/svgs";

const Footer = () => {
  return (
    <footer className="bg-main-black text-gray-300 py-10 px-6 md:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & About */}
        <div>
          <img src={OrangeLogo} alt="Logo" className="h-10 mb-4" />
          <p className="text-xs font-normal leading-relaxed">
            © Copyright lIFELINE ASSEMBLY 2025
          </p>
          <div className="flex flex-col gap-2 mt-4">
            <p className="text-sm">(234) 8102938283</p>
            <p className="text-sm">Umuahia, abia state</p>
            <p className="text-sm">LIFELINEASSEMBLY.COM</p>
          </div>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-base font-semibold text-white mb-4">Quicklinks</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white text-xs">About Us</a></li>
            <li><a href="#" className="hover:text-white text-xs">Sermons</a></li>
            <li><a href="#" className="hover:text-white text-xs">Events</a></li>
            <li><a href="#" className="hover:text-white text-xs">Blog</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-base font-semibold text-white mb-4">Connect</h3>
          <div className="flex gap-4 mb-4">
            <a href="#" className="hover:text-white text-main-orange"><FaFacebookF /></a>
            <a href="#" className="hover:text-white text-main-orange"><FaTwitter /></a>
            <a href="#" className="hover:text-white text-main-orange"><FaLinkedinIn /></a>
            <a href="#" className="hover:text-white text-main-orange"><FaInstagram /></a>
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <p className="text-sm mb-4 text-[32px] font-bold">Subscribe to get Latest Updates and News.</p>
          <form className="flex items-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 rounded-l-lg bg-gray-800 text-gray-200 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-main-orange px-4 py-2 rounded-lg text-white hover:bg-orange-200"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
