import { FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export const ErrorPage = () => {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 text-center p-4">
      <FaExclamationTriangle className="text-6xl sm:text-8xl text-yellow-500 mb-6" />
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 mb-4">
        404 - Page Not Found
      </h1>
      <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-8">
        Oops! The page you're looking for doesn't exist.
      </p>
      <button
        onClick={() => navigate('/')}
        className="px-6 py-3 bg-main-orange text-white font-semibold rounded-lg hover:bg-orange-300 transition duration-300"
      >
        Go Back Home
      </button>
    </div>
  );
};