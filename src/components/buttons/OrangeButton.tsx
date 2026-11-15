import type React from "react";

interface OrangeButtonProps {
  text: string;
  onClick: () => void;
  className?: string;
}
const OrangeButton: React.FC<OrangeButtonProps> = ({ text, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-main-orange py-6 px-16 rounded-xl text-white font-semibold hover:bg-orange-600 transition-all ${className}`}
    >{text}</button>
  )
}

export default OrangeButton