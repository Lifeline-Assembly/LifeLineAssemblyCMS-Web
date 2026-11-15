import { useCallback, useState } from "react";
import { FaApple, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { SignupImage } from "../../assets/images";
import { FcGoogle } from "react-icons/fc";
import { useFormik } from "formik";
import * as Yup from "yup";
import { signUpApi } from "../../api/auth-api";
import LoadingModal from "../../components/LoadingModal";
import { useToast } from "../../contexts/ToastContext";

export type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  gender: "Male" | "Female";
  maritalStatus: "Single" | "Married" | "Divorced" | "Widowed";
  dateOfBirth?: string;
  address?: string;
  occupation?: string;
  agree: boolean;
};

const Register = () => {
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleApiError = useCallback((error: unknown) => {
    if (error && typeof error === "object" && "non_field_errors" in error) {
      const mainError = error as { non_field_errors: string };
      showToast(mainError.non_field_errors, "error");
    } else if (error && typeof error === "object" && "detail" in error) {
      const mainError = error as { detail: string };
      showToast(mainError.detail, "error");
    } else if (error && typeof error === "object" && "date_of_birth" in error) {
      const mainError = error as { date_of_birth: string };
      showToast(mainError.date_of_birth, "error");
    }else if (error && typeof error === "object" && "email" in error) {
      const mainError = error as { email: string };
      showToast(mainError.email, "error");
    } else {
      // fallback for unexpected errors
      showToast("An unexpected error occurred.", "error");
    }
  }, [showToast]);

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    phone: Yup.string().required("Phone number is required"),
    gender: Yup.mixed<RegisterFormData["gender"]>()
      .oneOf(["Male", "Female"], "Select a valid gender")
      .required("Gender is required"),
    maritalStatus: Yup.mixed<RegisterFormData["maritalStatus"]>()
      .oneOf(["Single", "Married", "Divorced", "Widowed"], "Select a valid status")
      .required("Marital status is required"),
    dateOfBirth: Yup.string().optional(),
    address: Yup.string().max(255, "Address must be at most 255 characters").optional(),
    occupation: Yup.string().optional(),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Please confirm your password"),
    agree: Yup.boolean().oneOf([true], "You must accept the terms"),
  });

  // date logic
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const dateJoined = `${year}-${month}-${day}`;

  const formik = useFormik<RegisterFormData>({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      gender: "Male",
      maritalStatus: "Single",
      dateOfBirth: "",
      address: "",
      occupation: "",
      agree: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      // console.log(values);
      setLoading(true)
      try {
        const res: { message: string } = await signUpApi({
          firstname: values.firstName,
          lastname: values.lastName,
          gender: values.gender,
          email: values.email,
          address: values.address,
          marital_status: values.maritalStatus,
          occupation: values.occupation,
          date_of_birth: values.dateOfBirth,
          phone_number: values.phone,
          password: values.password,
          date_joined: dateJoined,
        });
        console.log(res);
        showToast(res.message, 'success');
        formik.resetForm();
        navigate('/login');
      } catch (error) {
        // const axiosError = error as { email: string };
        console.log('Error here:', error)
        // showToast(axiosError.email, 'error');
        handleApiError(error)
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <LoadingModal isLoading={loading} />

      {/* Left Image - Hidden on mobile, shown on md and up */}
      <div className="hidden md:flex w-full md:w-1/2 items-center justify-center lg:p-24 p-8">
        <img
          src={SignupImage}
          alt="Register"
          className="object-cover h-full w-full rounded-2xl"
        />
      </div>

      {/* Right Form - Full width on mobile, half on desktop */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-lg">
          <h2 className="text-xl sm:text-2xl font-bold mb-2 text-center">REGISTER</h2>
          <p className="text-gray-500 text-center mb-4 sm:mb-6 text-sm sm:text-base">
            Let's get you all set up so you can access your personal account.
          </p>

          <form
            onSubmit={formik.handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4"
          >
            {/* First Name */}
            <div className="md:col-span-1">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border p-3 rounded-md w-full text-sm sm:text-base"
              />
              {formik.touched.firstName && formik.errors.firstName ? (
                <span className="text-red-500 text-xs sm:text-sm mt-1 block">{formik.errors.firstName}</span>
              ) : null}
            </div>

            {/* Last Name */}
            <div className="md:col-span-1">
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border p-3 rounded-md w-full text-sm sm:text-base"
              />
              {formik.touched.lastName && formik.errors.lastName ? (
                <span className="text-red-500 text-xs sm:text-sm mt-1 block">{formik.errors.lastName}</span>
              ) : null}
            </div>

            {/* Email */}
            <div className="md:col-span-1">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border p-3 rounded-md w-full text-sm sm:text-base"
              />
              {formik.touched.email && formik.errors.email ? (
                <span className="text-red-500 text-xs sm:text-sm mt-1 block">{formik.errors.email}</span>
              ) : null}
            </div>

            {/* Phone */}
            <div className="md:col-span-1">
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border p-3 rounded-md w-full text-sm sm:text-base"
              />
              {formik.touched.phone && formik.errors.phone ? (
                <span className="text-red-500 text-xs sm:text-sm mt-1 block">{formik.errors.phone}</span>
              ) : null}
            </div>

            {/* Gender */}
            <div className="md:col-span-1">
              <select
                name="gender"
                value={formik.values.gender}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border p-3 rounded-md w-full text-sm sm:text-base"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {formik.touched.gender && formik.errors.gender ? (
                <span className="text-red-500 text-xs sm:text-sm mt-1 block">{formik.errors.gender}</span>
              ) : null}
            </div>

            {/* Marital Status */}
            <div className="md:col-span-1">
              <select
                name="maritalStatus"
                value={formik.values.maritalStatus}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border p-3 rounded-md w-full text-sm sm:text-base"
              >
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
              {formik.touched.maritalStatus && formik.errors.maritalStatus ? (
                <span className="text-red-500 text-xs sm:text-sm mt-1 block">{formik.errors.maritalStatus}</span>
              ) : null}
            </div>

            {/* Date of Birth */}
            <div className="md:col-span-1">
              <label className="block text-xs sm:text-sm text-gray-600 mb-1">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formik.values.dateOfBirth}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border p-3 rounded-md w-full text-sm sm:text-base"
              />
              {formik.touched.dateOfBirth && formik.errors.dateOfBirth ? (
                <span className="text-red-500 text-xs sm:text-sm mt-1 block">{formik.errors.dateOfBirth}</span>
              ) : null}
            </div>

            {/* Address */}
            <div className="col-span-2">
              <input
                type="text"
                name="address"
                placeholder="Address (Optional)"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border p-3 rounded-md w-full text-sm sm:text-base"
                minLength={1}
                maxLength={255}
              />
              {formik.touched.address && formik.errors.address ? (
                <span className="text-red-500 text-xs sm:text-sm mt-1 block">{formik.errors.address}</span>
              ) : null}
            </div>

            {/* Occupation */}
            <div className="col-span-2">
              <input
                type="text"
                name="occupation"
                placeholder="Occupation (Optional)"
                value={formik.values.occupation}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border p-3 rounded-md w-full text-sm sm:text-base"
              />
              {formik.touched.occupation && formik.errors.occupation ? (
                <span className="text-red-500 text-xs sm:text-sm mt-1 block">{formik.errors.occupation}</span>
              ) : null}
            </div>

            {/* Password */}
            <div className="md:col-span-1">
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="border p-3 rounded-md w-full pr-10 text-sm sm:text-base"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password ? (
                <span className="text-red-500 text-xs sm:text-sm mt-1 block">{formik.errors.password}</span>
              ) : null}
            </div>

            {/* Confirm Password */}
            <div className="md:col-span-1">
              <div className="relative w-full">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="border p-3 rounded-md w-full pr-10 text-sm sm:text-base"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
              {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                <span className="text-red-500 text-xs sm:text-sm mt-1 block">{formik.errors.confirmPassword}</span>
              ) : null}
            </div>

            {/* Terms */}
            <div className="col-span-2">
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  name="agree"
                  checked={formik.values.agree}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="h-4 w-4 mt-1 flex-shrink-0"
                />
                <span className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                  I agree to all the{" "}
                  <a href="#" className="text-main-orange font-semibold">
                    Terms and Privacy Policies
                  </a>
                </span>
              </div>
              {formik.touched.agree && formik.errors.agree ? (
                <span className="text-red-500 text-xs sm:text-sm mt-1 block">{formik.errors.agree}</span>
              ) : null}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="col-span-2 bg-main-orange hover:bg-orange-600 text-white font-semibold py-3 rounded-md text-sm sm:text-base"
            >
              Create Account
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-xs sm:text-sm text-gray-500 mt-4">
            Already have an account?{" "}
            <button
              onClick={() => navigate('/login')}
              className="text-main-orange font-semibold"
            >
              Login
            </button>
          </p>

          {/* Social Logins */}
          <div className="flex items-center my-4 sm:my-6">
            <hr className="flex-1 border-gray-300" />
            <span className="px-2 text-gray-400 text-xs sm:text-sm">OR SIGN UP WITH</span>
            <hr className="flex-1 border-gray-300" />
          </div>

          <div className="flex space-x-3 sm:space-x-4 justify-center">
            <button className="border p-2 sm:p-3 rounded-md flex-1 flex items-center justify-center text-sm sm:text-base">
              <FcGoogle size={20} className="sm:w-6 sm:h-6" />
            </button>
            <button className="border p-2 sm:p-3 rounded-md flex-1 flex items-center justify-center text-sm sm:text-base">
              <FaApple size={20} className="sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;