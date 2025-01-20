import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { AuthBackground, InputField } from "../../Components";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { motion } from "framer-motion";
import { setError, setLoading } from "../../Reducers/authReducer";
import { useState } from "react";
import { AuthService } from "../../Services";

const Login = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(setLoading(true));
      // Placeholder for API call
      console.log("Login Data:", formData);
      const response = await AuthService.register(formData);
      console.log("Response:", response);
      // dispatch(setAuth(response.token));
      // navigate('/dashboard');
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

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
              className="w-full py-3 px-4 rounded-lg bg-gfgsc-green text-white"
            >
              Login
            </button>
          </form>
          <p className="text-center text-gray-600">
            Don't have an account?{" "}
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
