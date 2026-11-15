import { LogoSvg } from "../assets/svgs";

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="relative w-32 h-32 flex justify-center items-center">
        {/* Spinning border */}
        <div className="absolute w-full h-full border-4 border-transparent border-t-blue-500 border-r-purple-600 rounded-full animate-spin"></div>
        {/* Static logo */}
        <div className="w-20 h-20 flex justify-center items-center">
          <img src={LogoSvg} alt="Loading..." />
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;