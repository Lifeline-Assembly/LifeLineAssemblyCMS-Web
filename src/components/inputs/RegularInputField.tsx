import React, { useState, type HTMLInputTypeAttribute } from "react";
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";

interface InputProps {
  label: string;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: unknown) => void
  name?: string
  id?: string
  error?: string
}

const RegularInputField: React.FC<InputProps> = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  id,
  name,
  error
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col space-y-1">
      <div className="flex justify-between">
        <label className="font-normal text-base text-[#383838] ">{label}</label>
        {type === "password" && (
          <button
            type="button"
            className="inset-y-0 right-3 flex items-center"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <><FaRegEyeSlash /> <p className="px-2 font-medium text-sm">Hide Password</p></> : <><FaRegEye /><p className="px-2 font-medium text-sm">Show Password</p></>}
          </button>
        )}
      </div>
      <div className="relative">
        <input
          autoComplete="off"
          type={type === "password" && showPassword ? "text" : type}
          placeholder={placeholder}
          value={value}
          id={id}
          name={name}
          onChange={onChange}
          onBlur={onBlur}
          className="appearance-none w-full p-3 placeholder:text-[#7A7A7A] rounded-[5px] border-[1px] border-[#EAECF0] focus:outline-none focus:ring-2 focus:ring-main-orange font-normal"
        />
      </div>
      <p className="text-[12px] text-red-500">{error}</p>
    </div>
  );
};

export default RegularInputField;
