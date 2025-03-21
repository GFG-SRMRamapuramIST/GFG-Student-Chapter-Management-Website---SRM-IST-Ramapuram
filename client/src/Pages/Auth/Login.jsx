import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

// Importing Icons
import { FaEnvelope, FaLock, FaSpinner } from "react-icons/fa";

import { AuthBackground, InputField } from "../../Components";
import { ToastMsg } from "../../Utilities";

// Importing APIs
import { AuthServices } from "../../Services";

import { storeUserToken } from "../../Actions";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // *********** Login Form Handle Starts here ***********
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await AuthServices.loginFunction(
        formData.email,
        formData.password
      );
      //console.log(response);
      if (response.status === 200) {
        ToastMsg(response.data.message, "success");

        dispatch(storeUserToken(response.data.token));
        navigate("/dashboard");
      } else {
        ToastMsg(response.response.data.message, "error");
      }
    } catch (error) {
      ToastMsg("Internal Server Error!", "error");
      console.error("Login Error:", error.message);
    } finally {
      setFormData({ email: "", password: "" });
      setLoading(false);
    }
  };
  // *********** Login Form Handle Ends here ***********

  return (
    <div className="w-full flex flex-col md:flex-row">
      {/* AuthBackground component on larger screens */}
      <AuthBackground isRight={true} />

      {/* Login Form Section */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full md:w-1/2 flex items-center justify-center py-24 px-4 sm:px-6 md:px-8 lg:px-12"
      >
        <div className="w-full max-w-md space-y-6 md:space-y-8">
          {/* Header Section */}
          <div className="text-center px-4">
            <h2 className="text-2xl sm:text-3xl font-bold">Welcome Back!</h2>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Please sign in to continue
            </p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 px-4">
            {/* Input Fields */}
            <div className="space-y-4">
              <InputField
                icon={<FaEnvelope className="text-gray-400" />}
                placeholder="Email address"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full"
              />

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full pl-10 pr-12 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-gfgsc-green focus:ring-2 focus:ring-gfgsc-green-200 transition-all duration-200"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FiEyeOff className="w-5 h-5" />
                  ) : (
                    <FiEye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex items-center justify-end text-xs sm:text-sm">
              <Link
                to="/auth/forgot-password"
                className="text-gfgsc-green hover:text-gfg-green transition-colors duration-200"
              >
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 sm:py-3 px-4 rounded-lg bg-gfgsc-green text-white hover:bg-gfg-green transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              {loading && (
                <FaSpinner className="animate-spin text-sm sm:text-base" />
              )}
              <span className="text-sm sm:text-base">Login</span>
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-xs sm:text-sm text-gray-600 px-4">
            Don&apos;t have an account?{" "}
            <Link
              to="/auth/register"
              className="text-gfgsc-green hover:text-gfg-green font-medium transition-colors duration-200"
            >
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
