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

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // *********** Login Form Handle Starts here ***********
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const response = await AuthServices.loginFunction(
        formData.email,
        formData.password
      );

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
      setFormLoading(false);
    }
  };
  // *********** Login Form Handle Ends here ***********

  return (
    <div className="min-h-screen flex">
      <AuthBackground isRight={true} />

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 flex items-center justify-center p-8"
      >
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Welcome Back!</h2>
            <p className="mt-2 text-gray-600">Please sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              icon={<FaEnvelope />}
              placeholder="Email address"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />

            <InputField
              icon={<FaLock />}
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />

            <div className="flex items-center justify-end text-sm">
              {/* <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-gfgsc-green focus:ring-gfgsc-green"
                />
                <span className="ml-2">Remember me</span>
              </label> */}
              <Link
                to="/auth/forgot-password"
                className="text-gfgsc-green hover:text-gfg-green"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={formLoading}
              className="w-full py-3 px-4 rounded-lg bg-gfgsc-green text-white"
            >
              {formLoading ? (
                <FaSpinner className="animate-spin inline-block" />
              ) : null}{" "}
              Login
            </button>
          </form>
          <p className="text-center text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              to="/auth/register"
              className="text-gfgsc-green hover:text-gfg-green font-medium"
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
