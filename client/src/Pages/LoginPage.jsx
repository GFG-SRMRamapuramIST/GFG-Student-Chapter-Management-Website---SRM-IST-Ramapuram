import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { FaAsterisk, FaSpinner } from "react-icons/fa";

import "../Styles/Login&SignUp/Login.css";
import ToastMsg from "../Constants/ToastMsg";

// Redux actions
import { storeUserData } from "../Actions";

// Mock user data
const mockUsers = [
  {
    registrationNo: "22BCE1411",
    password: "123456",
    userToken: "mockUserToken_22BCE1411",
  },
  {
    registrationNo: "21BCE5678",
    password: "mypassword",
    userToken: "mockUserToken_21BCE5678",
  },
  {
    registrationNo: "21BCE9101",
    password: "securepassword",
    userToken: "mockUserToken_21BCE9101",
  },
];

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formLoading, setFormLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm();

  // User Login Function
  const handleLogin = async (formData) => {
    setFormLoading(true);
    try {
      const { registrationNo, password } = formData;
  
      // Simulated API response
      const response = await new Promise((resolve) =>
        setTimeout(() => {
          // Find the user in the mock data
          const user = mockUsers.find(
            (u) =>
              u.registrationNo === registrationNo.toUpperCase() &&
              u.password === password
          );
  
          if (user) {
            resolve({
              status: 200,
              data: { userToken: user.userToken },
            });
          } else {
            resolve({ status: 401, message: "Invalid credentials" });
          }
        }, 1000)
      );
  
      if (response.status === 200) {
        const userToken = response.data.userToken;
  
        // Dispatch the token to Redux store
        dispatch(storeUserData(userToken));
  
        console.log("User logged in successfully with token:", userToken);
        ToastMsg("Login Successful!", "success");
  
        // Navigate to the home page
        navigate("/");
      } else {
        console.error("Login failed:", response.message);
        ToastMsg(response.message, "error");
      }
    } catch (error) {
      ToastMsg("Server error! Please try later", "error");
      console.error("Error during login:", error);
    } finally {
      setFormLoading(false);
      reset();
    }
  };

  // Capitalize the registration number
  const registrationNo = watch("registrationNo");
  useEffect(() => {
    setValue("registrationNo", registrationNo?.toUpperCase());
  }, [registrationNo, setValue]);

  return (
    <div className="login-area w-full flex justify-center items-center pt-[80px] sm:pt-[50px] pb-[50px]">
      {/* Login box */}
      <div className="box sm:w-full md:max-w-[480px] mx-auto sm:py-[50px]">
        <h2 className="text-gray-700 outline-none block text-[40px] xl:text-[44px] font-bold mx-auto mb-3 w-full text-center">
          Login
        </h2>
        <form
          name="login-form"
          className="w-full"
          onSubmit={handleSubmit(handleLogin)}
          noValidate
        >
          {/* Registration number */}
          <div className="mb-3 w-full px-2">
            <label
              className="text-sm font-medium text-gray-700 flex items-center"
              htmlFor="registrationNo"
            >
              Registration No:{" "}
              <FaAsterisk className="text-red-500 ml-[2px] text-[6px]" />
            </label>
            <input
              className={`form-control ${
                errors.registrationNo ? "border-red-500" : ""
              }`}
              name="registrationNo"
              type="text"
              id="registrationNo"
              placeholder="Registration No"
              {...register("registrationNo", {
                required: "Registration number is required",
              })}
            />
            {errors.registrationNo && (
              <div className="invalid-feedback">
                {errors.registrationNo.message}
              </div>
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
