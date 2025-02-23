import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Importing icons
import { MdEmail, MdLock, MdKeyboardBackspace } from "react-icons/md";
import { HiKey } from "react-icons/hi";
import { FaSpinner } from "react-icons/fa";

import { AuthBackground } from "../../Components";
import { ToastMsg } from "../../Utilities";

// Importing APIs
import { AuthServices } from "../../Services";

const steps = [
  {
    title: "Email Verification",
    description: "Enter your email to receive a verification code",
  },
  {
    title: "OTP Verification",
    description: "Enter the 6-digit code sent to your email",
  },
  {
    title: "Reset Password",
    description: "Create a new password for your account",
  },
];

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState("");
  const [timer, setTimer] = useState(120); // 2 minutes in seconds
  const [isTimerActive, setIsTimerActive] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  // timer logic
  useEffect(() => {
    let interval;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
      setCurrentStep(0);
      ToastMsg("OTP expired! Please try again.", "error");
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  const slideVariants = {
    enter: { x: 20, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -20, opacity: 0 },
  };

  // *********** Verify Email and send OTP Starts Here ***********
  const verifyEmailAndSendOTP = async (email) => {
    setLoading(true);
    try {
      console.log("Sending OTP to:", email);
      const response = await AuthServices.verifyEmailAndSendOTP(email);

      // Start timer
      setTimer(120);
      setIsTimerActive(true);

      if (response.status === 200) {
        ToastMsg(response.data.message, "success");
        setCurrentStep(1);
      } else {
        ToastMsg(response.response.data.message, "error");
        console.log(
          "Error verifying email and sending OTP:",
          response.response.data.message
        );
      }
    } catch (error) {
      ToastMsg("Internal Server Error!", "error");
      console.error("Login Error:", error.message);
    } finally {
      setLoading(false);
      reset();
    }
  };
  // *********** Verify Email and send OTP Ends Here ***********

  // *********** Verify OTP Starts Here ***********
  const verifyOTP = async (email, otp) => {
    setLoading(true);
    try {
      console.log("Verifying OTP:", otp);
      const response = await AuthServices.verifyOTP(email, otp);

      if (response.status === 200) {
        ToastMsg(response.data.message, "success");
        setCurrentStep(2);
      } else {
        ToastMsg(response.response.data.message, "error");
        console.log("Error verifying OTP:", response.response.data.message);
      }
    } catch (error) {
      ToastMsg("Internal Server Error!", "error");
      console.error("Login Error:", error.message);
    } finally {
      setLoading(false);
      reset();
    }
  };
  // *********** Verify OTP Ends Here ***********

  // *********** Change Password Starts Here ***********
  const changePassword = async (email, password) => {
    setLoading(true);
    try {
      console.log("Changing password for:", email);
      const response = await AuthServices.changePassword(email, password);

      if (response.status === 200) {
        ToastMsg(response.data.message, "success");
        navigate("/auth/login");
      } else {
        ToastMsg(response.response.data.message, "error");
        console.log("Error changing password:", response.response.data.message);
      }
    } catch (error) {
      ToastMsg("Internal Server Error!", "error");
      console.error("Login Error:", error.message);
    } finally {
      setLoading(false);
      reset();
    }
  };
  // *********** Change Password Ends Here ***********

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      if (currentStep === 0) {
        setEmail(data.email);
        verifyEmailAndSendOTP(data.email);
      } else if (currentStep === 1) {
        verifyOTP(email, data.otp);
      } else {
        changePassword(email, data.newPassword);
      }
    } catch (error) {
      ToastMsg("Internal Server Error!", "error");
      console.error("Login Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <MdEmail className="text-xl" />
              </div>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-gfgsc-green focus:ring-2 focus:ring-gfgsc-green-200"
                placeholder="Enter your email"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
              We&apos;ve sent a verification code to{" "}
              <span className="font-medium text-gfgsc-green">{email}</span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <HiKey className="text-xl" />
              </div>
              <input
                type="text"
                {...register("otp", {
                  required: "OTP is required",
                  pattern: {
                    value: /^[0-9]{6}$/,
                    message: "Please enter a valid 6-digit code",
                  },
                })}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 
                     focus:border-gfgsc-green focus:ring-2 focus:ring-gfgsc-green-200
                     text-center tracking-[1em] font-mono text-xl"
                placeholder="000000"
                maxLength={6}
              />
            </div>
            {/* Timer Display */}
            <div className="flex justify-end items-center ">
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }}>
                <span className="text-red-600 font-medium">
                  {Math.floor(timer / 60)}:
                  {(timer % 60).toString().padStart(2, "0")}
                </span>
              </motion.div>
            </div>
            {errors.otp && (
              <p className="text-red-500 text-sm">{errors.otp.message}</p>
            )}
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <MdLock className="text-xl" />
              </div>
              <input
                type="password"
                {...register("newPassword", {
                  required: "New password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-gfgsc-green focus:ring-2 focus:ring-gfgsc-green-200"
                placeholder="New password"
              />
            </div>
            {errors.newPassword && (
              <p className="text-red-500 text-sm">
                {errors.newPassword.message}
              </p>
            )}

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <MdLock className="text-xl" />
              </div>
              <input
                type="password"
                {...register("confirmPassword", {
                  validate: (value) =>
                    value === watch("newPassword") || "Passwords do not match",
                })}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-gfgsc-green focus:ring-2 focus:ring-gfgsc-green-200"
                placeholder="Confirm new password"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col md:flex-row-reverse">
      {/* AuthBackground component - hidden on mobile */}
      <AuthBackground isRight={false} />

      {/* Main Content Area */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full md:w-1/2 flex items-center justify-center py-24 px-4 sm:px-6 md:px-8"
      >
        <div className="w-full max-w-md space-y-6 md:space-y-8 px-4">
          {/* Progress Steps */}
          <div className="flex justify-between mb-6 md:mb-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex-1 text-center ${
                  index === currentStep
                    ? "text-gfgsc-green"
                    : index < currentStep
                    ? "text-gray-500"
                    : "text-gray-300"
                }`}
              >
                <div className="relative">
                  <div
                    className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto rounded-full flex items-center justify-center border-2 text-xs sm:text-sm ${
                      index === currentStep
                        ? "border-gfgsc-green bg-white"
                        : index < currentStep
                        ? "border-gray-500 bg-gray-500 text-white"
                        : "border-gray-300"
                    }`}
                  >
                    {index + 1}
                  </div>
                </div>
                <div className="text-[10px] sm:text-xs mt-2 px-1">
                  {step.title}
                </div>
              </div>
            ))}
          </div>

          {/* Form Content with Animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 sm:space-y-6"
              >
                {/* Form Steps */}
                <div className="space-y-4">{renderStep()}</div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-3 sm:space-y-4 mt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 sm:py-3 px-4 rounded-lg bg-gfgsc-green text-white hover:bg-gfg-green transition-colors duration-200 text-sm sm:text-base flex items-center justify-center"
                  >
                    {loading && (
                      <FaSpinner className="animate-spin mr-2 w-4 h-4" />
                    )}
                    {currentStep === 2 ? "Reset Password" : "Continue"}
                  </button>

                  {currentStep > 0 && (
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => setCurrentStep((prev) => prev - 1)}
                      className="flex items-center justify-center space-x-2 w-full py-2.5 sm:py-3 px-4 rounded-lg border border-gfgsc-green text-gfgsc-green hover:bg-gfgsc-green-50 transition-colors duration-200 text-sm sm:text-base"
                    >
                      <MdKeyboardBackspace className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          </AnimatePresence>

          {/* Sign In Link */}
          <div className="text-center pt-4">
            <Link
              to="/auth/login"
              className="text-xs sm:text-sm text-gfgsc-green hover:text-gfg-green transition-colors duration-200"
            >
              Remember your password? Sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
