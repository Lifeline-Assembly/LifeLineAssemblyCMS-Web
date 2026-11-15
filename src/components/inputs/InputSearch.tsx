import type React from "react";
import { IoSearch } from "react-icons/io5";

interface InputSearchProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const InputSearch: React.FC<InputSearchProps> = ({ placeholder = "Search...", value, onChange, className }) => {
  return (
    <div
      className={`flex items-center gap-2.5 w-full rounded-md bg-gray-50 ${className || ""}`}
    >
      <IoSearch className="text-gray-400 w-5 h-5 ml-2.5" aria-hidden="true" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="flex-1 border border-gray-300 rounded-md px-3 py-2 placeholder:text-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-main-orange transition"
        aria-label={placeholder}
      />
    </div>
  );
};

export default InputSearch;
