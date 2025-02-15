import { useSelector } from "react-redux";

import { commonrequest } from "./APIConfig";
import { BACKEND_URL } from "./Helper";

// Function to get user token inside a hook
const useAuthToken = () => useSelector((state) => state.auth?.userToken);

// Get edit profile page data API
const getEditProfilePageDataFuncion = async (token) => {
  return await commonrequest(
    "GET",
    `${BACKEND_URL}/api/v1/user/get-edit-profile-page-data`,
    null,
    { Authorization: `Bearer ${token}` }
  );
};

// Edit Profile API
const editProfileFunction = async (params, userToken) => {
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/api/v1/user/edit-profile`,
    params, // Pass user updates as request body
    { Authorization: `Bearer ${userToken}` }
  );
};

// Change Password API
const changePasswordFunction = async (
  { currentPassword, newPassword },
  userToken
) => {
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/api/v1/user/change-password`,
    { currentPassword, newPassword },
    { Authorization: `Bearer ${userToken}` }
  );
};

// Change Profile Pic API
const changeProfilePicFunction = async (formData, userToken) => {
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/api/v1/user/edit-profile-picture`,
    formData,
    { Authorization: `Bearer ${userToken}` }
  )
}

// Wrapper to use token inside React components
const UserService = () => {
  const userToken = useAuthToken();

  return {
    getEditProfilePageDataFuncion: () =>
      getEditProfilePageDataFuncion(userToken),
    editProfileFunction: (params) => editProfileFunction(params, userToken),
    changePasswordFunction: (params) =>
      changePasswordFunction(params, userToken),
    changeProfilePicFunction: (formData) => changeProfilePicFunction(formData,userToken)
  };
};

export default UserService;
