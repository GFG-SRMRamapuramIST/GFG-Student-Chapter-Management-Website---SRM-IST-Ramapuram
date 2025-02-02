import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { setAuth, setError, setLoading } from "../../Reducers/authReducer";
import {
  MdEmail,
  MdLock,
  MdPerson,
  MdPhone,
  MdCode,
  MdAddAPhoto,
} from "react-icons/md";
import { AuthBackground } from "../../Components";
import { FaLinkedin } from "react-icons/fa";
import { SiCodechef, SiCodeforces, SiLeetcode } from "react-icons/si";
import { AuthService } from "../../Services";
import { ToastMsg } from "../../Utilities";
import { CgEditMarkup } from "react-icons/cg";
// import { Alert, AlertDescription } from "@/components/ui/alert";

const steps = [
  {
    title: "Basic Information",
    fields: ["profilePicture", "name", "email", "password", "confirmPassword"],
  },
  {
    title: "Contact Details",
    fields: [
      "phoneNumber",
      "registrationNumber",
      "academicYear",
      "linkedinUsername",
    ],
  },
  {
    title: "Coding Profiles",
    fields: [
      "leetcodeUsername",
      "codechefUsername",
      "codeforcesUsername",
      "codolioUsername",
    ],
  },
  // {
  //   title: "Profile Picture",
  //   fields: ["profilePicture"],
  // },
  {
    title: "Verify Email",
    fields: ["otp"],
  },
];

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [profilePreview, setProfilePreview] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
    setValue,
    getValues,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      registrationNumber: "",
      academicYear: "",
      phoneNumber: "",
      linkedinUsername: "",
      leetcodeUsername: "",
      codechefUsername: "",
      codeforcesUsername: "",
      codolioUsername: "",
      profilePicture: null,
      otp: "",
    },
  });

  const fieldDetails = {
    name: {
      icon: <MdPerson />,
      placeholder: "Full Name",
      validation: { required: "Name is required" },
    },
    email: {
      icon: <MdEmail />,
      placeholder: "Email Address",
      validation: {
        required: "Email is required",
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: "Invalid email address",
        },
      },
    },
    password: {
      icon: <MdLock />,
      placeholder: "Password",
      validation: {
        required: "Password is required",
        minLength: {
          value: 6,
          message: "Password must be at least 6 characters",
        },
      },
    },
    confirmPassword: {
      icon: <MdLock />,
      placeholder: "Confirm Password",
      validation: {
        validate: (value) =>
          value === watch("password") || "Passwords do not match",
      },
    },
    phoneNumber: {
      icon: <MdPhone />,
      placeholder: "Phone Number",
      validation: { required: "Phone number is required" },
    },
    registrationNumber: {
      icon: <MdCode />,
      placeholder: "Registration Number",
      validation: { required: "Registration number is required" },
    },
    academicYear: {
      icon: <MdCode />,
      placeholder: "Academic Year",
      validation: { required: "Academic year is required" },
    },
    linkedinUsername: {
      icon: <FaLinkedin />,
      placeholder: "LinkedIn Username",
      validation: { required: "Linkedin is required" },
    },
    leetcodeUsername: {
      icon: <SiLeetcode />,
      placeholder: "LeetCode Username",
      validation: { required: "LeetCode is required" },
    },
    codechefUsername: {
      icon: <SiCodechef />,
      placeholder: "CodeChef Username",
      validation: { required: "CodeChef is required" },
    },
    codeforcesUsername: {
      icon: <SiCodeforces />,
      placeholder: "Codeforces Username",
      validation: { required: "Codeforces is required" },
    },
    codolioUsername: {
      icon: <MdCode />,
      placeholder: "Codolio Username",
      validation: { required: "Codolio is required" },
    },
    profilePicture: {
      icon: <MdAddAPhoto />,
      placeholder: "Upload Profile Picture",
      validation: {
        required: "Profile picture is required",
        validate: {
          lessThan2MB: (files) =>
            !files[0] ||
            files[0].size <= 2000000 ||
            "Profile picture must be less than 2MB",
          acceptedFormats: (files) =>
            !files[0] ||
            ["image/jpeg", "image/png", "image/gif"].includes(files[0]?.type) ||
            "Only JPG, PNG and GIF files are allowed",
        },
      },
    },
    otp: {
      icon: <MdLock />,
      placeholder: "Enter OTP",
      validation: {
        required: "OTP is required",
        pattern: {
          value: /^[0-9]{6}$/,
          message: "OTP must be 6 digits",
        },
      },
    },
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setValue("profilePicture", event.target.files);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const sendOTP = async () => {
    try {
      dispatch(setLoading(true));
      // Simulate OTP sending - replace with actual API call
      await AuthService.sendOTP(getValues("email"));
      setOtpSent(true);
      setOtpError("");
      ToastMsg("OTP has been sent to your email address", "success");
    } catch (err) {
      setOtpError(err.message);
      ToastMsg(err.message, "error");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const onSubmit = async (data) => {
    try {
      dispatch(setLoading(true));
      const formData = new FormData();

      // Append all form fields except confirmPassword
      Object.keys(data).forEach((key) => {
        if (key !== "confirmPassword") {
          if (key === "profilePicture") {
            formData.append(key, data[key][0]);
          } else {
            formData.append(key, data[key]);
          }
        }
      });

      const response = await AuthService.register(formData);
      dispatch(setAuth(response.token));
      navigate("/dashboard");
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const nextStep = async () => {
    const fields = steps[currentStep].fields;
    const isValid = await trigger(fields);

    if (isValid) {
      if (currentStep === 3) {
        // Send OTP before moving to final step
        await sendOTP();
      }
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const renderField = (name) => {
    const { icon, placeholder, validation } = fieldDetails[name];

    if (name === "profilePicture") {
      return (
        <div className="space-y-4">
          <motion.div layout className="relative flex justify-center">
            <motion.div
              layout
              className={`relative ${profilePreview ? "w-32 h-32" : "w-full"}`}
            >
              {profilePreview ? (
                <motion.div
                  initial={{ borderRadius: "0.5rem", scale: 0.9 }}
                  animate={{
                    borderRadius: "50%",
                    scale: 1,
                    transition: { duration: 0.3 },
                  }}
                  className="relative w-32 h-32 group"
                >
                  <div className="w-full h-full overflow-hidden border-2 border-gfgsc-green rounded-full">
                    <motion.img
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                      src={profilePreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Hover Overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center transition-all"
                  >
                    <motion.label
                      whileHover={{ scale: 1.1 }}
                      className="cursor-pointer flex items-center justify-center gap-2 text-white"
                    >
                      <CgEditMarkup className="w-5 h-5" />
                      <span className="text-sm">Change</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfilePictureChange}
                        {...register(name, validation)}
                      />
                    </motion.label>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.label
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-2 cursor-pointer px-4 py-3 rounded-lg bg-gray-50 border-2 border-dashed border-gray-200 hover:border-gfgsc-green transition-all w-full justify-center group"
                >
                  <MdAddAPhoto className="text-gray-400 group-hover:text-gfgsc-green transition-colors" />
                  <span className="text-gray-500 group-hover:text-gfgsc-green transition-colors">
                    Upload Profile Picture
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePictureChange}
                    {...register(name, validation)}
                  />
                </motion.label>
              )}
            </motion.div>
          </motion.div>
          {errors[name] && (
            <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>
          )}
        </div>
      );
    }

    if (name === "otp") {
      return (
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              {icon}
            </div>
            <input
              type="text"
              maxLength={6}
              {...register(name, validation)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-gfgsc-green focus:ring-2 focus:ring-gfgsc-green-200 transition-all duration-200 text-center tracking-widest"
              placeholder="000000"
            />
          </div>
          {errors[name] && (
            <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>
          )}
          <button
            type="button"
            onClick={sendOTP}
            className="w-full mt-2 py-2 px-4 text-sm text-gfgsc-green hover:text-gfg-green transition-colors"
          >
            Resend OTP
          </button>
        </div>
      );
    }

    if (name === "academicYear") {
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Academic Year
          </label>
          <select
            {...register(name, validation)}
            className="w-full pl-4 pr-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-gfgsc-green focus:ring-2 focus:ring-gfgsc-green-200"
          >
            <option value="">Select Year</option>
            {[1, 2, 3, 4].map((year) => (
              <option key={year} value={year}>
                Year {year}
              </option>
            ))}
          </select>
          {errors[name] && (
            <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
          <input
            type={name.includes("password") ? "password" : "text"}
            {...register(name, validation)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-gfgsc-green focus:ring-2 focus:ring-gfgsc-green-200 transition-all duration-200"
            placeholder={placeholder}
          />
        </div>
        {errors[name] && (
          <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-row-reverse">
      <AuthBackground />

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 flex items-center justify-center p-8"
      >
        <div className="w-full max-w-xl space-y-8 pt-8">
          <div className="flex justify-between mb-8">
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
                    className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center border-2 ${
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
                <div className="text-xs mt-2">{step.title}</div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-6">
              {steps[currentStep].fields.map((field) => (
                <React.Fragment key={field}>
                  {renderField(field)}
                </React.Fragment>
              ))}
            </div>

            <div className="flex justify-between gap-4">
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={() =>
                    setCurrentStep((prev) => Math.max(prev - 1, 0))
                  }
                  className="flex-1 py-3 px-4 rounded-lg border border-gfgsc-green text-gfgsc-green hover:bg-gfgsc-green hover:text-white transition-colors"
                >
                  Previous
                </button>
              )}
              {currentStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex-1 py-3 px-4 rounded-lg bg-gfgsc-green text-white hover:bg-gfg-green transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-lg bg-gfgsc-green text-white hover:bg-gfg-green transition-colors"
                >
                  Create Account
                </button>
              )}
            </div>
          </form>

          <p className="text-center text-gray-600">
            Already have an account?{" "}
            <Link
              to="/auth/login"
              className="text-gfgsc-green hover:text-gfg-green font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
