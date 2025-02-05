import { commonrequest } from "./APIConfig";
import { BACKEND_URL } from "./Helper";

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
    `${BACKEND_URL}/api/v1/register`,
    formData,
    {
      "Content-Type": "multipart/form-data",
    }
  );
};

// Exporting all the APIs under AuthServices
const AuthServices = {
  loginFunction,
  registerFunction,
};

export default AuthServices;
