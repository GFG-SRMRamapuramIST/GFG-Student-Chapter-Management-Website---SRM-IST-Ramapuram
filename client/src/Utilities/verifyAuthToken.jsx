import { removeUserToken } from "../Actions";
import { AuthServices } from "../Services";

import ToastMsg from "./ToastMsg";

const verifyUserToken = async (userToken, dispatch, navigate) => {
  try {
    const response = await AuthServices.verifyAuthToken(userToken);
    console.log(response);
    if (response.status === 200 && response.data.message === "Token is valid") {
      return { userId: response.data.userId, role: response.data.role }; // Do nothing if the token is valid
    }

    // Handle invalid token case
    if (
      response.status === 400 &&
      response.data.message === "Token is not valid"
    ) {
      ToastMsg("Session expired! Please login again.", "error");
      dispatch(removeUserToken()); // Remove token from Redux
      navigate("/"); // Redirect to login
    }
  } catch (error) {
    console.log(error);
    ToastMsg("Session expired! Please login again.", "error");
    dispatch(removeUserToken()); // Remove token from Redux
    navigate("/"); // Redirect to login
  }
};

export default verifyUserToken;