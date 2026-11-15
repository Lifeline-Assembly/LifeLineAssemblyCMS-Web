import React from "react";

interface LoadingModalProps {
  isLoading: boolean;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[90] flex justify-center items-center">
      <div 
        className="absolute inset-0 bg-black opacity-50" 
      />
      <div className="relative flex flex-col items-center">
        <div className="animate-spin w-32 h-32 border-4 border-t-blue-500 border-r-purple-600 rounded-full"></div>
      </div>
    </div>
  );
};

export default LoadingModal;
