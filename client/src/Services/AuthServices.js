import { commonrequest } from "./APIConfig";
import { BACKEND_URL } from "./Helper";

// Verify Auth Token
const verifyAuthToken = async (token) => {
  return await commonrequest(
    "GET",
    `${BACKEND_URL}/api/v1/auth/verify-auth-token`,
    null,
    { Authorization: `Bearer ${token}` }
  );
}

// Login API
const loginFunction = async (email, password) => {
  return await commonrequest("POST", `${BACKEND_URL}/api/v1/auth/login`, {
    email,
    password,
  });
};

// Register API
const registerFunction = async (formData) => {
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/api/v1/auth/register`,
    formData,
    {
      "Content-Type": "multipart/form-data",
    }
  );
};

// Verify Email and send OTP
const verifyEmailAndSendOTP = async (email) => {
  return await commonrequest("POST", `${BACKEND_URL}/api/v1/auth/send-otp`, {
    email,
  });
};

// Verify OTP
const verifyOTP = async (email, otp) => {
  return await commonrequest("POST", `${BACKEND_URL}/api/v1/auth/verify-otp`, {
    email,
    otp,
  });
};

// Change password
const changePassword = async (email, password) => {
  return await commonrequest("POST", `${BACKEND_URL}/api/v1/auth/change-password`, {
    email,
    password,
  });
};

// Exporting all the APIs under AuthServices
const AuthServices = {
  verifyAuthToken,
  loginFunction,
  registerFunction,
  verifyEmailAndSendOTP,
  verifyOTP,
  changePassword,
};

export default AuthServices;
