import { commonrequest } from "./APIConfig";
import { BACKEND_URL } from "./Helper";

// login function
const loginFunction = async (email, password) => {
  return await commonrequest("POST", `${BACKEND_URL}/api/v1/auth/login`, {
    email,
    password,
  });
};

export default { loginFunction };
