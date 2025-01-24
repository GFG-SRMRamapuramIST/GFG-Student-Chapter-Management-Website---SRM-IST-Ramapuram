import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { setError, setLoading } from "../../Reducers/authReducer";
import { MdEmail, MdLock, MdKeyboardBackspace } from "react-icons/md";
import { HiKey } from "react-icons/hi";
import { AuthBackground } from '../../Components';

const steps = [
  {
    title: "Email Verification",
    description: "Enter your email to receive a verification code"
  },
  {
    title: "OTP Verification",
    description: "Enter the 6-digit code sent to your email"
  },
  {
    title: "Reset Password",
    description: "Create a new password for your account"
  }
];

const ForgotPassword = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { register, handleSubmit, watch, formState: { errors }, trigger } = useForm({
    mode: "onChange"
  });

  const slideVariants = {
    enter: { x: 20, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -20, opacity: 0 }
  };

  const onSubmit = async (data) => {
    try {
      dispatch(setLoading(true));
      
      if (currentStep === 0) {
        setEmail(data.email);
        // Add API call to send OTP
        console.log("Sending OTP to:", data.email);
        setCurrentStep(1);
      } 
      else if (currentStep === 1) {
        // Add API call to verify OTP
        console.log("Verifying OTP:", data.otp);
        setCurrentStep(2);
      }
      else {
        // Add API call to reset password
        console.log("Resetting password:", data.newPassword);
        navigate('/auth/login');
      }
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
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
                    message: "Invalid email address"
                  }
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
              We've sent a verification code to <span className="font-medium text-gfgsc-green">{email}</span>
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
                    message: "Please enter a valid 6-digit code"
                  }
                })}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-gfgsc-green focus:ring-2 focus:ring-gfgsc-green-200"
                placeholder="Enter 6-digit code"
                maxLength={6}
              />
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
                    message: "Password must be at least 6 characters"
                  }
                })}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-gfgsc-green focus:ring-2 focus:ring-gfgsc-green-200"
                placeholder="New password"
              />
            </div>
            {errors.newPassword && (
              <p className="text-red-500 text-sm">{errors.newPassword.message}</p>
            )}
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <MdLock className="text-xl" />
              </div>
              <input
                type="password"
                {...register("confirmPassword", {
                  validate: value => value === watch('newPassword') || "Passwords do not match"
                })}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-gfgsc-green focus:ring-2 focus:ring-gfgsc-green-200"
                placeholder="Confirm new password"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-row-reverse">
      <AuthBackground isRight={false} />

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 flex items-center justify-center p-8"
      >
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">
              {steps[currentStep].title}
            </h2>
            <p className="text-gray-600">
              {steps[currentStep].description}
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {renderStep()}

                <div className="flex flex-col space-y-4">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-lg bg-gfgsc-green text-white hover:bg-gfg-green transition-colors duration-200"
                  >
                    {currentStep === 2 ? "Reset Password" : "Continue"}
                  </button>

                  {currentStep > 0 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(prev => prev - 1)}
                      className="flex items-center justify-center space-x-2 w-full py-3 px-4 rounded-lg border border-gfgsc-green text-gfgsc-green hover:bg-gfgsc-green-200 transition-colors duration-200"
                    >
                      <MdKeyboardBackspace />
                      <span>Back</span>
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          </AnimatePresence>

          <div className="text-center">
            <Link
              to="/auth/login"
              className="text-sm text-gfgsc-green hover:text-gfg-green transition-colors duration-200"
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