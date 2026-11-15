import React from "react";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";

const ContactForm: React.FC = () => {
  return (
    <div className="w-full bg-[#F5F2F0] py-10 px-5 md:px-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left - Form */}
        <div>
          <h2 className="text-lg font-bold text-main-black mb-5">CONTACT FORM:</h2>
          <form className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Your full Name"
              className="w-full bg-white rounded-sm p-3 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full bg-white rounded-sm p-3 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
            <input
              type="text"
              placeholder="Query Related"
              className="w-full bg-white rounded-sm p-3 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
            <textarea
              placeholder="Message"
              rows={4}
              className="w-full bg-white rounded-sm p-3 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
            <button
              type="submit"
              className="bg-main-orange text-white font-semibold py-3 rounded-md hover:bg-orange-600 transition"
            >
              SEND MESSAGE
            </button>
          </form>
        </div>

        {/* Right - Contact Info */}
        <div className="flex flex-col justify-center md:pl-10">
          <div className="mb-6">
            <p className="text-sm text-[#1E1B1B]">Address</p>
            <p className="font-bold text-main-black">UMUAHIA, ABIA STATE</p>
          </div>

          <div className="mb-6">
            <p className="text-sm text-[#1E1B1B]">Contact Details</p>
            <p className="font-bold text-main-black">(234) 8102973837</p>
            <p className="font-bold text-main-black">LIFELINEASSEMBLY@GMAIL.COM</p>
          </div>

          <div>
            <p className="text-sm text-[#1E1B1B] mb-2">Find us here</p>
            <div className="flex gap-4 text-2xl text-main-black">
              <a href="#" className="hover:text-main-orange">
                <FaFacebook />
              </a>
              <a href="#" className="hover:text-main-orange">
                <FaTwitter />
              </a>
              <a href="#" className="hover:text-main-orange">
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
