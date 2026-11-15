// components/Toast.tsx
import { useEffect, useState } from "react";
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from "react-icons/fa";

type ToastProps = {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
  duration?: number; // Optional duration in milliseconds
};

const Toast = ({ message, type, onClose, duration = 3000 }: ToastProps) => {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = 50; // Update progress every 50ms for smooth animation
    const totalSteps = duration / interval;
    const stepDecrement = 100 / totalSteps;

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(progressTimer);
          return 0;
        }
        return prev - stepDecrement;
      });
    }, interval);

    const dismissTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 200); // Wait for fade-out animation
    }, duration);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(dismissTimer);
    };
  }, [onClose, duration, isPaused]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 200);
  };

  if (!visible) return null;

  // Toast configuration
  const toastConfig = {
    success: {
      bgColor: "bg-green-50 border-green-200",
      textColor: "text-green-800",
      iconColor: "text-green-500",
      progressColor: "bg-green-500",
      icon: FaCheckCircle,
    },
    error: {
      bgColor: "bg-red-50 border-red-200",
      textColor: "text-red-800",
      iconColor: "text-red-500",
      progressColor: "bg-red-500",
      icon: FaExclamationCircle,
    },
    info: {
      bgColor: "bg-blue-50 border-blue-200",
      textColor: "text-blue-800",
      iconColor: "text-blue-500",
      progressColor: "bg-blue-500",
      icon: FaInfoCircle,
    },
  };

  const config = toastConfig[type];
  const IconComponent = config.icon;

  return (
    <div
      className={`fixed top-5 right-5 min-w-80 max-w-md p-4 rounded-lg border shadow-lg z-50 transform transition-all duration-200 ${
        visible ? "animate-in slide-in-from-right-full" : "opacity-0 scale-95"
      } ${config.bgColor}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-1 mb-3 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-50 ${config.progressColor}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Content */}
      <div className="flex items-start gap-3">
        <IconComponent className={`w-5 h-5 mt-0.5 flex-shrink-0 ${config.iconColor}`} />
        
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${config.textColor}`}>{message}</p>
        </div>

        <button
          onClick={handleClose}
          className={`flex-shrink-0 p-1 rounded-full hover:bg-black hover:bg-opacity-10 transition-colors ${config.textColor}`}
        >
          <FaTimes className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;