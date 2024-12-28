import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaAsterisk, FaSpinner } from "react-icons/fa";

import "../../Styles/Login&SignUp/SignUp.css";

import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [formLoading, setFormLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm();

  const handleSignUp = async (formData) => {
    setFormLoading(true);

    if (formData.password !== formData.confirm_password) {
      console.error("Passwords & Confirm Password do not match!");
      setFormLoading(false);
      return;
    }

    try {
      // Log form data to the console
      console.log({
        ...formData,
        profilePicture: formData.profilePicture[0],});
      
      // Navigate to login page
      navigate("/login");
    } catch (error) {
      console.error("Error during signup:", error);
    } finally {
      setFormLoading(false);
      reset();
    }
  };

  // Capitalize the registration number
  const RegNo = watch("registrationNumber");
  useEffect(() => {
    setValue("registrationNumber", RegNo?.toUpperCase());
  }, [RegNo, setValue]);

  // Making the email lower cased
  const Email = watch("email");
  useEffect(() => {
    setValue("email", Email?.toLowerCase());
  }, [Email, setValue]);

  const formatLabel = (name) => {
    return name
      .replace(/([A-Z])/g, " $1") // Add a space before uppercase letters
      .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter
  };

  return (
    <div className="signup-area flex justify-center items-center pt-[80px] sm:pt-[50px] pb-[50px]">
      <div className="box sm:w-full md:max-w-[740px] mx-auto md:py-[50px]">
        <h2 className="text-gray-700 outline-none block text-[34px] sm:text-[40px] xl:text-[44px] font-bold mx-auto mb-3 w-full text-center">
          Registration Form
        </h2>
        <form
          name="signup-form"
          className="w-full"
          onSubmit={handleSubmit(handleSignUp)}
          noValidate
        >
          <div className="flex flex-wrap -mx-2 px-2">
            {/* Name */}
            <div className="mb-3 w-full md:w-1/2 px-2">
              <label
                className="text-sm font-medium text-gray-700 flex items-center"
                htmlFor="name"
              >
                Name:{" "}
                <FaAsterisk className="text-red-500 ml-[2px] text-[6px]" />
              </label>
              <input
                className={`form-control ${
                  errors.name ? "border-red-500" : ""
                }`}
                name="name"
                type="text"
                id="name"
                placeholder="Ex: Shashank Sharma"
                {...register("name", {
                  required: "Name is required",
                  pattern: {
                    value: /^[A-Za-z ]+$/,
                    message: "Invalid name",
                  },
                })}
              />
              {errors.name && (
                <div className="invalid-feedback">{errors.name.message}</div>
              )}
            </div>

            {/* Registration Number */}
            <div className="mb-3 w-full md:w-1/2 px-2">
              <label
                className="text-sm font-medium text-gray-700 flex items-center"
                htmlFor="registrationNumber"
              >
                Registration Number:{" "}
                <FaAsterisk className="text-red-500 ml-[2px] text-[6px]" />
              </label>
              <input
                className={`form-control ${
                  errors.registrationNumber ? "border-red-500" : ""
                }`}
                name="registrationNumber"
                type="text"
                id="registrationNumber"
                placeholder="Ex: 22BCE1411"
                {...register("registrationNumber", {
                  required: "Registration number is required",
                  pattern: {
                    value: /^(1|2)[0-9](B|M)[A-Z]{2}[0-9]{4}$/,
                    message: "Invalid registration number",
                  },
                })}
              />
              {errors.registrationNumber && (
                <div className="invalid-feedback">
                  {errors.registrationNumber.message}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap -mx-2 px-2">
            {/* Academic Year */}
            <div className="mb-3 w-full md:w-1/2 px-2">
              <label
                className="text-sm font-medium text-gray-700 flex items-center"
                htmlFor="academicYear"
              >
                Academic Year:{" "}
                <FaAsterisk className="text-red-500 ml-[2px] text-[6px]" />
              </label>
              <input
                className={`form-control ${
                  errors.academicYear ? "border-red-500" : ""
                }`}
                name="academicYear"
                type="text"
                id="academicYear"
                placeholder="Ex: 2022"
                {...register("academicYear", {
                  required: "Academic year is required",
                  pattern: {
                    value: /^202\d$/,
                    message: "Invalid Academic Year",
                  },
                })}
              />
              {errors.academicYear && (
                <div className="invalid-feedback">{errors.academicYear.message}</div>
              )}
            </div>

            {/* Phone Number */}
            <div className="mb-3 w-full md:w-1/2 px-2">
              <label
                className="text-sm font-medium text-gray-700 flex items-center"
                htmlFor="phoneNumber"
              >
                Phone Number:{" "}
                <FaAsterisk className="text-red-500 ml-[2px] text-[6px]" />
              </label>
              <input
                className={`form-control ${
                  errors.phoneNumber ? "border-red-500" : ""
                }`}
                name="phoneNumber"
                type="text"
                id="phoneNumber"
                placeholder="Ex: 70221*****"
                {...register("phoneNumber", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[1-9]\d{9}$/,
                    message: "Invalid phone number",
                  },
                })}
              />
              {errors.phoneNumber && (
                <div className="invalid-feedback">
                  {errors.phoneNumber.message}
                </div>
              )}
            </div>
          </div>

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
              name="email"
              type="email"
              id="email"
              placeholder="Ex: shashanksharma0402.official@gmail.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^@ ]+@[^@ ]+\.[^@ ]+$/,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email.message}</div>
            )}
          </div>

          {/* Profile Links */}
          {[
            { name: "linkedinProfileLink", placeholder: "LinkedIn Profile URL" },
            { name: "leetcodeProfileLink", placeholder: "Leetcode Profile URL" },
            { name: "codolioProfileLink", placeholder: "Codolio Profile URL" },
            { name: "codechefProfileLink", placeholder: "CodeChef Profile URL" },
            { name: "codeforcesProfileLink", placeholder: "Codeforces Profile URL" },
          ].map(({ name, placeholder }) => (
            <div key={name} className="mb-3 w-full px-2">
              <label
                className="text-sm font-medium text-gray-700 flex items-center"
                htmlFor={name}
              >
                {formatLabel(name)}{" "}
                <FaAsterisk className="text-red-500 ml-[2px] text-[6px]" />
              </label>
              <input
                className={`form-control ${errors[name] ? "border-red-500" : ""}`}
                name={name}
                type="text"
                id={name}
                placeholder={placeholder}
                {...register(name, { required: `${name} is required` })}
              />
              {errors[name] && (
                <div className="invalid-feedback">{errors[name].message}</div>
              )}
            </div>
          ))}

          <div className="flex flex-wrap md:items-center -mx-2 px-2">
            {/* Profile Picture */}
            <div className="mb-3 w-full md:w-1/2 px-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="profilePicture">
                Profile Picture (Optional):
              </label>
              <input
                className="form-control"
                type="file"
                id="profilePicture"
                {...register("profilePicture")}
              />
            </div>

            {/* OTP */}
            <div className="mb-3 w-full md:w-1/2 px-2">
              <label
                className="text-sm font-medium text-gray-700 flex items-center"
                htmlFor="otp"
              >
                OTP:{" "}
                <FaAsterisk className="text-red-500 ml-[2px] text-[6px]" />
              </label>
              <input
                className={`form-control ${
                  errors.otp ? "border-red-500" : ""
                }`}
                name="otp"
                type="text"
                id="otp"
                placeholder="Check your email for OTP"
                {...register("otp", {
                  required: "OTP is required",
                  pattern: {
                    value: /^\d{6}$/,
                    message: "Invalid OTP",
                  },
                })}
              />
              {errors.otp && (
                <div className="invalid-feedback">{errors.otp.message}</div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap -mx-2 px-2">
            {/* Password */}
            <div className="mb-3 w-full md:w-1/2 px-2">
              <label
                className="text-sm font-medium text-gray-700 flex items-center"
                htmlFor="password"
              >
                Password:{" "}
                <FaAsterisk className="text-red-500 ml-[2px] text-[6px]" />
              </label>
              <input
                className={`form-control ${
                  errors.password ? "border-red-500" : ""
                }`}
                name="password"
                type="password"
                id="password"
                placeholder="Ex: Password@123"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters long",
                  },
                })}
              />
              {errors.password && (
                <div className="invalid-feedback">{errors.password.message}</div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="mb-3 w-full md:w-1/2 px-2">
              <label
                className="text-sm font-medium text-gray-700 flex items-center"
                htmlFor="confirm_password"
              >
                Confirm Password:{" "}
                <FaAsterisk className="text-red-500 ml-[2px] text-[6px]" />
              </label>
              <input
                className={`form-control ${
                  errors.confirm_password ? "border-red-500" : ""
                }`}
                name="confirm_password"
                type="password"
                id="confirm_password"
                placeholder="Check your email for OTP"
                {...register("confirm_password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters long",
                  },
                })}
              />
              {errors.confirm_password && (
                <div className="invalid-feedback">{errors.confirm_password.message}</div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-3 text-center">
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
                "Sign Up"
              )}
            </button>
          </div>

          {/* Login */}
          <div className="mt-3 text-center">
            <p className="text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary font-medium hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
