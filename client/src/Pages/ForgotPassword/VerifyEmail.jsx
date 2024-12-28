import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { FaAsterisk, FaSpinner } from "react-icons/fa";
import { ToastMsg } from "../../Utilities";

// import { verifyEmailFunction } from "../../services/API";
import { useDispatch } from "react-redux";
// import { emailVerificationDone } from "../../actions";

// Mock API function
const mockVerifyEmailFunction = async (email) => {
  // Simulating API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // Simulated response
  if (email.includes("@vitstudent.ac.in")) {
    return {
      status: 200,
      data: { message: "Verification email sent successfully!" },
    };
  }
  return {
    status: 400,
    response: { data: { message: "Invalid email address" } },
  };
};

// Mock Redux action
const mockEmailVerificationDone = (email) => {
  console.log(`Email verification completed for: ${email}`);
};

const VerifyEmail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formLoading, setFormLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    //setValue,
    //watch,
    reset,
  } = useForm();

  const handleVerifyEmail = async (formData) => {
    setFormLoading(true);
    try {
      const { email } = formData;

      const response = await mockVerifyEmailFunction(email);
      if (response.status === 200) {
        ToastMsg(response.data.message, "success");
        mockEmailVerificationDone(email);
        navigate("/verify-otp");
      } else {
        ToastMsg(response.response.data.message, "error");
      }
    } catch (error) {
      ToastMsg("Server error! Please try later", "error");
      console.error("Internal Server Error: ", error);
    } finally {
      setFormLoading(false);
      reset();
    }
  };

  return (
    <div className="login-area w-full flex justify-center items-center pt-[80px] sm:pt-[50px] pb-[50px]">
      {/* Login box */}
      <div className="box sm:w-full md:w-[550px] mx-auto sm:py-[50px]">
        <h2 className="text-gray-700 outline-none block text-[40px] xl:text-[44px] font-bold mx-auto mb-3 w-full text-center">
          Verify Email
        </h2>
        <p className="text-sm font-normal text-gray-500 text-center mb-5">
          To proceed with resetting your password, kindly provide your
          email address. This step is necessary to verify your identity and
          ensure the security of your account.
        </p>
        <form
          name="login-form"
          className="w-full"
          onSubmit={handleSubmit(handleVerifyEmail)}
          noValidate
        >
          {/* Email */}
          <div className="mb-3 w-full px-2">
            <label
              className="text-sm font-medium text-gray-700 flex items-center"
              htmlFor="email"
            >
              Email:{" "}
              <FaAsterisk className="text-red-500 ml-[2px] text-[6px]" />
            </label>
            <input
              className={`form-control ${errors.email ? "border-red-500" : ""}`}
              name="Email"
              type="text"
              id="email"
              placeholder="Ex: shashanksharma0402.official@gmail.com"
              {...register("email", {
                required: "College Email is required",
                pattern: {
                  value:/^[^@ ]+@[^@ ]+\.[^@ ]+$/,
                  message: "Invalid email",
                },
              })}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email.message}</div>
            )}
          </div>

          {/* Login button */}
          <div className="mt-5 text-center">
            <button
              type="submit"
              disabled={formLoading}
              className={`btnSubmit ${
                formLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {formLoading ? (
                <>
                  <FaSpinner className="mr-3 animate-spin" />
                  Loading...
                </>
              ) : (
                "Send OTP"
              )}
            </button>
          </div>

          {/* Signup */}
          <div className="mt-3 text-center">
            <p className="text-sm">
              Don&apos;t have an account?{" "}
              <Link
                to="/sign-up"
                className="text-primary font-medium hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;
