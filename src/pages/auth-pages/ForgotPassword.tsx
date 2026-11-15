import { IoChevronBackOutline } from "react-icons/io5"
import { ResetPasswordImage } from "../../assets/images"
import { useCallback, useState } from "react"
import { useNavigate } from "react-router-dom";
import * as Yup from 'yup'
import { useFormik } from "formik";
import { useToast } from "../../contexts/ToastContext";
import { requestResetPassword } from "../../api/auth-api";
import LoadingModal from "../../components/LoadingModal";


const ForgotPassword = () => {
  const { showToast } = useToast();

  const [stepper, setStepper] = useState({
    email: true,
    code: false
  });
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
    } else if (error && typeof error === "object" && "email" in error) {
      const mainError = error as { email: string };
      showToast(mainError.email, "error");
    } else {
      // fallback for unexpected errors
      showToast("An unexpected error occurred.", "error");
    }
  }, [showToast]);

  const emailSchama = Yup.object({
    email: Yup.string().email("Invalid email address").required("Email is required"),
  });

  const emailFormik = useFormik<{ email: string }>({
    initialValues: {
      email: ''
    },
    validationSchema: emailSchama,
    onSubmit: async (values) => {
      setLoading(true)
      try {
        const res: {message: string} = await requestResetPassword({ email: values.email });
        console.log(res)
        showToast(res.message, 'success')
        // setStepper({ email: false, code: true })
      } catch (error) {
        handleApiError(error)
      } finally {
        setLoading(false)
      }
    }
  })

  return (
    <div className="min-h-screen flex items-center text-[#313131]">
      <LoadingModal isLoading={loading} />
      {
        stepper.email
        &&
        <div className="flex flex-col gap-11 md:w-1/2 lg:p-24 p-8">
          <div
            onClick={() => navigate('/login')}
            className="cursor-pointer flex gap-2 items-center w-fit"
          >
            <IoChevronBackOutline size={24} />
            <p className="text-sm font-medium">Back to login</p>
          </div>

          <div className="flex flex-col gap-4">
            <h1 className="text-[40px] font-bold">Forgot your password?</h1>
            <p className="text-base font-normal">Don’t worry, happens to all of us. Enter your email below to recover your password</p>
          </div>

          <form action="">
            <div className="col-span-2">
              <input
                type="email"
                name="email"
                placeholder="JOHN.DOE@GMAIL.COM"
                value={emailFormik.values.email}
                onChange={emailFormik.handleChange}
                onBlur={emailFormik.handleBlur}
                className="border p-3 rounded-md w-full text-sm sm:text-base"
              />
              {emailFormik.touched.email && emailFormik.errors.email ? (
                <span className="text-red-500 text-xs sm:text-sm mt-1 block">{emailFormik.errors.email}</span>
              ) : null}
            </div>
          </form>

          <button
            onClick={() => emailFormik.handleSubmit()}
            className="col-span-2 bg-main-orange hover:bg-orange-600 text-white font-semibold py-3 rounded-md text-sm sm:text-base"
          >
            Request Reset
          </button>

        </div>
      }
      {
        stepper.code
        &&
        <div className="flex flex-col gap-11 md:w-1/2 lg:p-24 p-8">
          <div
            onClick={() => navigate('/login')}
            className="cursor-pointer flex gap-2 items-center w-fit"
          >
            <IoChevronBackOutline size={24} />
            <p className="text-sm font-medium">Back to login</p>
          </div>

          <div className="flex flex-col gap-4">
            <h1 className="text-[40px] font-bold">Verify code</h1>
            <p className="text-base font-normal">An authentication code has been sent to your email.</p>
          </div>
          <button
            onClick={() => setStepper({ email: true, code: false })}
            className="col-span-2 bg-main-orange hover:bg-orange-600 text-white font-semibold py-3 rounded-md text-sm sm:text-base"
          >
            Change Password
          </button>
        </div>
      }
      <div className="hidden md:flex w-full md:w-1/2 items-center justify-center lg:p-24 p-8">
        <img
          src={ResetPasswordImage}
          alt="Register"
          className="object-cover h-[610px] w-full rounded-2xl"
        />
      </div>
    </div>
  )
}

export default ForgotPassword