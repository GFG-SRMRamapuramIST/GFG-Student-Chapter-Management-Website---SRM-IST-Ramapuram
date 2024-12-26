import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { FaAsterisk, FaSpinner } from "react-icons/fa";

import "../Styles/Login&SignUp/Login.css";
import ToastMsg from "../Constants/ToastMsg";

// API
import { AuthAPIs } from "../Services";

// Redux actions
import { storeUserData } from "../Actions";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formLoading, setFormLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // User Login Function
  const handleLogin = async (formData) => {
    setFormLoading(true);
    try {
      const { email, password } = formData;
      const response = await AuthAPIs.loginFunction(email, password);
      console.log(response);
      if (response.status === 200) {
        const userToken = response.data.token;

        ToastMsg(response.data.message, "success");

        // Store userToken in local/redux storage
        dispatch(storeUserData({ userToken }));

        // Navigate to dashboard/home page
        navigate("/");
      } else {
        ToastMsg(response.response.data.message, "error");
      }
    } catch (error) {
      ToastMsg("Server error! Please try later", "error");
      console.error("Error during login:", error);
    } finally {
      setFormLoading(false);
      reset();
    }
  };

  return (
    <div className="login-area w-full flex justify-center items-center pt-[80px] sm:pt-[50px] pb-[50px]">
      {/* Login box */}
      <div className="box sm:w-full md:w-[480px] mx-auto sm:py-[50px]">
        <h2 className="text-gray-700 outline-none block text-[40px] xl:text-[44px] font-bold mx-auto mb-3 w-full text-center">
          Login
        </h2>
        <form
          name="login-form"
          className="w-full"
          onSubmit={handleSubmit(handleLogin)}
          noValidate
        >
          {/* Email */}
          <div className="mb-3 w-full px-2">
            <label
              className="text-sm font-medium text-gray-700 flex items-center"
              htmlFor="registrationNo"
            >
              Email: <FaAsterisk className="text-red-500 ml-[2px] text-[6px]" />
            </label>
            <input
              className={`form-control ${errors.email ? "border-red-500" : ""}`}
              name="registrationNo"
              type="text"
              id="email"
              placeholder="abcd@gmail.com"
              {...register("email", {
                required: "Email is required",
              })}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email.message}</div>
            )}
          </div>

          {/* Password */}
          <div className="mb-3 w-full px-2">
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
              placeholder="Password"
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

          {/* Forgot Password */}
          <div className="mb-3 w-full px-2 text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login button */}
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
                "Login"
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
}

export default Login;
