import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

// Importing Icons
import {
  MdEmail,
  MdLock,
  MdPerson,
  MdPhone,
  MdCode,
  MdAddAPhoto,
  MdDescription,
} from "react-icons/md";
import { FaLinkedin, FaSpinner } from "react-icons/fa";
import { SiCodechef, SiCodeforces, SiLeetcode } from "react-icons/si";
import { CgEditMarkup } from "react-icons/cg";

import { AuthBackground } from "../../Components";
import { ToastMsg } from "../../Utilities";

// Importing APIs
import { AuthServices } from "../../Services";
import { FiEye, FiEyeOff } from "react-icons/fi";

const steps = [
  {
    title: "Basic Information",
    fields: [
      "profilePicture",
      "name",
      "bio",
      "email",
      "password",
      "confirmPassword",
    ],
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
  {
    title: "Verify Email",
    fields: ["otp"],
  },
];

const SignUp = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [currentStep, setCurrentStep] = useState(0);
  const [profilePreview, setProfilePreview] = useState(null);
  const fileInputRef = useRef(null);

  // ********** Sign Up Form Configuration Starts Here **********
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      bio: "",
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
      profilePicture: [],
      otp: "",
    },
  });

  // Password Hidden States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Declaring/defining all our input fields
  const fieldDetails = {
    name: {
      icon: <MdPerson />,
      placeholder: "Full Name",
      validation: { required: "Name is required" },
    },
    bio: {
      icon: <MdDescription />,
      placeholder: "Tell us about yourself",
      validation: {
        required: "Bio is required",
        maxLength: {
          value: 100,
          message: "Bio must be less than 100 characters",
        },
      },
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
      validation: {
        required: "Phone number is required",
        pattern: {
          value: /^[6-9]\d{9}$/,
          message: "Enter valid 10-digit phone number"
        }
      },
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
        required: false,
        validate: {
          lessThan2MB: (files) =>
            (files && files[0] && files[0].size <= 2000000) ||
            "Profile picture must be less than 2MB",
          acceptedFormats: (files) =>
            (files &&
              files[0] &&
              ["image/jpeg", "image/png", "image/gif"].includes(
                files[0].type
              )) ||
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

  // Function to render our fields
  const renderField = (name) => {
    const { icon, placeholder, validation } = fieldDetails[name];

    if (name === "profilePicture") {
      return renderProfilePictureField();
    }

    if (name === "phoneNumber") {
      return (
        <div className="space-y-2">
          <div className="relative flex items-center">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              {icon}
            </div>
            <div className="absolute inset-y-0 left-8 pl-3 flex items-center pointer-events-none text-gray-700 font-medium">
              +91
            </div>
            <input
              type="text"
              maxLength={10}
              {...register(name, validation)}
              className="w-full pl-20 pr-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-gfgsc-green focus:ring-2 focus:ring-gfgsc-green-200 transition-all duration-200"
              placeholder="Enter 10 digit number"
              onKeyPress={(e) => {
                // Allow only numbers
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
            />
          </div>
          {errors[name] && (
            <div className="space-y-1">
              <p className="text-red-500 text-xs">{errors[name].message}</p>
              <p className="text-gray-500 text-xs">
                • Number should be 10 digits without spaces or country code
                <br />
                • Should start with 6, 7, 8, or 9
              </p>
            </div>
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

    // Special handling for password fields
    if (name.toLowerCase().includes('password')) {
      return (
        <div className="space-y-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              {icon}
            </div>
            <input
              type={
                (name === 'password' && showPassword) || 
                (name === 'confirmPassword' && showConfirmPassword) 
                  ? 'text' 
                  : 'password'
              }
              {...register(name, validation)}
              className="w-full pl-10 pr-12 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-gfgsc-green focus:ring-2 focus:ring-gfgsc-green-200 transition-all duration-200"
              placeholder={placeholder}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              onClick={() => {
                if (name === 'password') {
                  setShowPassword(!showPassword);
                } else if (name === 'confirmPassword') {
                  setShowConfirmPassword(!showConfirmPassword);
                }
              }}
            >
              {(name === 'password' && showPassword) || 
               (name === 'confirmPassword' && showConfirmPassword) ? (
                <FiEyeOff className="w-5 h-5" />
              ) : (
                <FiEye className="w-5 h-5" />
              )}
            </button>
          </div>
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

  // Function to handle our From submission
  const onSubmit = async (data) => {
    setLoading(true);

    // Append all fields in a FormData object
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key !== "confirmPassword") {
        if (key === "profilePicture") {
          formData.append(key, data[key][0]);
        } else {
          formData.append(key, data[key]);
        }
      }
    });

    try {
      const response = await AuthServices.registerFunction(formData);

      if (response.status === 200) {
        ToastMsg(response.data.message, "success");
      } else {
        ToastMsg(response.response.data.message, "error");
        console.log("Sign-Up Error:", response.response.data.message);
      }

      navigate("/auth/login");
    } catch (error) {
      ToastMsg("Internal Server Error!", "error");
      console.error("Sign-Up Error:", error.message);
    } finally {
      setLoading(false);
      reset();
    }
  };
  // ********** Sign Up Form Configuration Ends Here **********

  // ********** Profile Picture Handler Starts Here **********
  const handleProfilePictureChange = (event) => {
    try {
      const file = event.target.files[0];

      if (file) {
        // Set form value as an array to match react-hook-form's file input expectation
        setValue("profilePicture", [file], { shouldValidate: true });

        // Create FileReader instance
        const reader = new FileReader();

        reader.onerror = () => {
          console.error("FileReader error:", reader.error);
          setValue("profilePicture", null);
        };

        reader.onloadend = () => {
          setProfilePreview(reader.result);
        };

        // Start reading the file
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error("Profile picture change error:", error);
      setValue("profilePicture", null);
    }
  };

  const renderProfilePictureField = () => {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        {/* Hidden File Input */}
        <input
          type="file"
          id="profilePicture"
          accept="image/*"
          ref={fileInputRef}
          {...register(
            "profilePicture",
            fieldDetails["profilePicture"].validation
          )}
          onChange={handleProfilePictureChange}
          className="hidden"
        />

        {/* Image Preview or Upload Button */}
        <label
          htmlFor="profilePicture"
          className="cursor-pointer"
          onClick={(e) => {
            console.log("Label clicked");
            e.currentTarget.querySelector('input[type="file"]')?.click();
          }}
        >
          {profilePreview ? (
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gfgsc-green">
                <img
                  src={profilePreview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 bg-black/40 transition-opacity">
                <span className="text-white flex items-center gap-2">
                  <CgEditMarkup className="w-5 h-5" />
                  Change
                </span>
              </div>
            </div>
          ) : (
            <div className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 hover:border-gfgsc-green transition-colors flex flex-col items-center justify-center gap-2">
              <MdAddAPhoto className="w-8 h-8 text-gray-400" />
              <span className="text-sm text-gray-500">Upload Picture</span>
            </div>
          )}
        </label>
      </div>
    );
  };
  // ********** Profile Picture Handler Ends Here ************

  // Function to move to the next section in the form
  const nextStep = async () => {
    /*const fields = steps[currentStep].fields;
    const isValid = await trigger(fields);
  
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }*/
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  return (
    <div className="min-h-screen flex flex-row-reverse">
      <AuthBackground />

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 flex items-center justify-center p-8"
      >
        <div
          className={`w-full max-w-xl space-y-8 pt-8 ${
            currentStep === 0 && "mt-8"
          }`}
        >
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
            <div className={`space-y-6 `}>
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
                  disabled={loading}
                  className="flex-1 py-3 px-4 rounded-lg bg-gfgsc-green text-white hover:bg-gfg-green transition-colors"
                >
                  {loading ? (
                    <FaSpinner className="animate-spin inline-block" />
                  ) : null}{" "}
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
