import React from "react";
import { IoCloseSharp } from "react-icons/io5";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  supportingText?: string;
  children: React.ReactNode;
}

const Popup: React.FC<PopupProps> = ({ isOpen, onClose, title, children, supportingText }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-end items-start z-50">
      {/* Modern backdrop with blur effect */}
      <div
        className="absolute inset-0 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal content */}
      <div
        className="bg-white p-6 rounded-xl shadow-lg w-[654px] relative z-10 h-screen overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-2.5 w-[80%]">
            <h2 className="text-4xl font-medium">{title}</h2>
            <p className="text-lg font-medium text-gray-main">{supportingText}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-main-orange bg-[#F7F9FB] rounded-full text-xl p-2.5"><IoCloseSharp /></button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
};

export default Popup;