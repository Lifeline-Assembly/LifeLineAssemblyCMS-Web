import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { OrangeLogo } from "../../assets/svgs";
import { LoginPlaceholder } from "../../assets/images";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import { adminLogin } from "../../api/auth-api";
import type { LoginResponse } from "../../constants/basic-types";
import { useToast } from "../../contexts/ToastContext";
import { useAuth } from "../../hooks/useAuth";

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate();
  const { saveUserData, login } = useAuth();

  const { showToast } = useToast();

  const handleApiError = (error: unknown) => {
    if (error && typeof error === "object" && "non_field_errors" in error) {
      const mainError = error as { non_field_errors: string };
      showToast(mainError.non_field_errors, "error");
    } else {
      // fallback for unexpected errors
      showToast("An unexpected error occurred.", "error");
    }
  }

  const [loading, setLoading] = useState(false);
  const handleApiLogin = async (data: { email: string, password: string }) => {
    setLoading(true);
    try {
      const res: LoginResponse = await adminLogin(data);
      login(res.tokens.access, res.tokens.refresh, res.user.id?.toString() || '');
      saveUserData(res.user);
      showToast(res.message, 'success')
    } catch (error) {
      console.log(error)
      // Handle both array or string responses
      handleApiError(error)
    } finally {
      setLoading(false)
    }
  }

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  })

  const formik = useFormik<{ email: string, password: string }>({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema,
    onSubmit(values) {
      handleApiLogin(values);
    },
  })

  const handleMainLoginEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    await formik.handleSubmit();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="bg-white shadow-lg rounded-lg flex flex-col lg:flex-row w-full max-w-[900px]">
        {/* Left Side - Form */}
        <form
          onSubmit={handleMainLoginEvent}
          className="w-full lg:w-1/2 p-6 md:p-8 lg:p-10 order-2 lg:order-1">
          {/* Logo */}
          <div className="mb-4">
            <img src={OrangeLogo} alt="Logo" className="h-8 lg:h-10" />
          </div>

          <h1 className="text-xl md:text-2xl font-bold text-gray-900">LOGIN</h1>
          <p className="text-gray-500 mb-4 md:mb-6 text-xs md:text-sm">
            LOGIN TO ACCESS YOUR LIFELINE ASSEMBLY ACCOUNT
          </p>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              EMAIL
            </label>
            <input
              type="email"
              name="email"
              placeholder="JOHN.DOE@GMAIL.COM"
              className="w-full px-3 py-2 md:py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <p className="text-sm text-red-500">{formik.errors.email}</p>

          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              PASSWORD
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="**********"
                className="w-full px-3 py-2 md:py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <p className="text-sm text-red-500">{formik.errors.password}</p>
          </div>

          {/* Remember Me + Forgot Password */}
          <div className="flex justify-between items-center mb-4 md:mb-6 text-xs md:text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input type="checkbox" className="accent-orange-500" />
              <span className="hidden xs:inline">REMEMBER ME</span>
              <span className="xs:hidden">REMEMBER</span>
            </label>
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-orange-500 hover:underline whitespace-nowrap"
            >
              FORGOT PASSWORD
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${loading ? 'bg-amber-50 text-gray-400' : 'bg-orange-500 hover:bg-orange-600 text-white'}  py-2 md:py-2 rounded-md font-semibold  transition text-sm md:text-base`}>
            {loading ? 'Loading...' : 'LOGIN'}
          </button>

          {/* Signup */}
          <p className="text-center text-xs md:text-sm mt-4 text-gray-600">
            DON'T HAVE AN ACCOUNT?{" "}
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="text-orange-500 font-medium hover:underline">
              SIGN UP
            </button>
          </p>

          {/* Divider */}
          <div className="flex items-center my-4 md:my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-2 text-xs text-gray-500">OR LOGIN WITH</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Social Login */}
          <div className="flex flex-col xs:flex-row gap-2 xs:gap-4">
            <button
              onClick={() => {
                console.log('Clicked')
              }}
              type="button"
              className="flex items-center justify-center w-full xs:w-1/2 border rounded-md py-2 hover:bg-gray-50 text-sm">
              <FcGoogle size={18} className="mr-2" /> Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center w-full xs:w-1/2 border rounded-md py-2 hover:bg-gray-50 text-sm">
              <FaApple size={18} className="mr-2" /> Apple
            </button>
          </div>
        </form>

        {/* Right Side - Image - Hidden on small screens, shown on medium and up */}
        <div className="w-full lg:w-1/2 order-1 lg:order-2 hidden md:block">
          <img
            src={LoginPlaceholder}
            alt="Login"
            className="w-full h-full object-cover rounded-t-lg lg:rounded-r-lg lg:rounded-t-none"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;