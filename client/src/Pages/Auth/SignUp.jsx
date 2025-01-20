import React from 'react';
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { setAuth, setError, setLoading } from "../../Reducers/authReducer";
import { MdEmail, MdLock, MdPerson, MdPhone, MdCode } from "react-icons/md";
import { AuthBackground } from '../../Components';
import { FaLinkedin } from 'react-icons/fa';
import { SiCodechef, SiCodeforces, SiLeetcode } from 'react-icons/si';
import { AuthService } from '../../Services';

const steps = [
  {
    title: "Basic Information",
    fields: ["name", "email", "password", "confirmPassword"]
  },
  {
    title: "Contact Details",
    fields: ["phoneNumber", "registrationNumber", "academicYear", "linkedinUsername"]
  },
  {
    title: "Coding Profiles",
    fields: ["leetcodeUsername", "codechefUsername", "codeforcesUsername", "codolioUsername"]
  }
];

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = React.useState(0);
  
  const { register, handleSubmit, watch, formState: { errors }, trigger } = useForm({
    mode: "onChange",
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      registrationNumber: '',
      academicYear: '',
      phoneNumber: '',
      linkedinUsername: '',
      leetcodeUsername: '',
      codechefUsername: '',
      codeforcesUsername: '',
      codolioUsername: ''
    }
  });

  const fieldDetails = {
    name: { icon: <MdPerson />, placeholder: "Full Name", validation: { required: "Name is required" } },
    email: { 
      icon: <MdEmail />, 
      placeholder: "Email Address", 
      validation: { 
        required: "Email is required",
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: "Invalid email address"
        }
      }
    },
    password: { 
      icon: <MdLock />, 
      placeholder: "Password", 
      validation: { 
        required: "Password is required",
        minLength: {
          value: 6,
          message: "Password must be at least 6 characters"
        }
      }
    },
    confirmPassword: { 
      icon: <MdLock />, 
      placeholder: "Confirm Password", 
      validation: { 
        validate: value => value === watch('password') || "Passwords do not match"
      }
    },
    phoneNumber: { icon: <MdPhone />, placeholder: "Phone Number", validation: { required: "Phone number is required" } },
    registrationNumber: { icon: <MdCode />, placeholder: "Registration Number", validation: { required: "Registration number is required" } },
    academicYear: { icon: <MdCode />, placeholder: "Academic Year", validation: { required: "Academic year is required" } },
    linkedinUsername: { icon: <FaLinkedin />, placeholder: "LinkedIn Username", validation: {required: "Linkedin is required"} },
    leetcodeUsername: { icon: <SiLeetcode />, placeholder: "LeetCode Username", validation: {required: "LeetCode is required"} },
    codechefUsername: { icon: <SiCodechef />, placeholder: "CodeChef Username", validation: {required: "CodeChef is required"} },
    codeforcesUsername: { icon: <SiCodeforces />, placeholder: "Codeforces Username", validation: {required: "Codeforces is required"} },
    codolioUsername: { icon: <MdCode />, placeholder: "Codolio Username", validation: {required: "Codolio is required"} }
  };

  const onSubmit = async (data) => {
    try {
      dispatch(setLoading(true));
      // Remove confirmPassword from final data
      const { ...submitData } = data;
      console.log("Register Data:", submitData);
      const response = await AuthService.register(submitData);
      dispatch(setAuth(response.token));
      navigate('/dashboard');
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const nextStep = async () => {
    const fields = steps[currentStep].fields;
    const isValid = await trigger(fields);
    if (isValid) setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const renderField = (name) => {
    const { icon, placeholder, validation } = fieldDetails[name];

    if (name === "academicYear") {
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Academic Year</label>
          <select
            {...register(name, validation)}
            className="w-full pl-4 pr-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-gfgsc-green focus:ring-2 focus:ring-gfgsc-green-200"
          >
            <option value="">Select Year</option>
            {[1, 2, 3, 4].map(year => (
              <option key={year} value={year}>Year {year}</option>
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
            type={name.includes('password') ? 'password' : 'text'}
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
                    ? 'text-gfgsc-green'
                    : index < currentStep
                    ? 'text-gray-500'
                    : 'text-gray-300'
                }`}
              >
                <div className="relative">
                  <div
                    className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center border-2 ${
                      index === currentStep
                        ? 'border-gfgsc-green bg-white'
                        : index < currentStep
                        ? 'border-gray-500 bg-gray-500 text-white'
                        : 'border-gray-300'
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
              {steps[currentStep].fields.map(field => (
                <React.Fragment key={field}>
                  {renderField(field)}
                </React.Fragment>
              ))}
            </div>

            <div className="flex justify-between gap-4">
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={prevStep}
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
            Already have an account?{' '}
            <Link to="/auth/login" className="text-gfgsc-green hover:text-gfg-green font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;