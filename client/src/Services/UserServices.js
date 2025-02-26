import { useSelector } from "react-redux";

import { commonrequest } from "./APIConfig";
import { BACKEND_URL } from "./Helper";

// Function to get user token inside a hook
const useAuthToken = () => useSelector((state) => state.auth?.userToken);

// Get profile page data API
const getProfilePageDataFunction = async (token) => {
  return await commonrequest(
    "GET",
    `${BACKEND_URL}/api/v1/user/get-profile-data`,
    null,
    { Authorization: `Bearer ${token}` }
  );
};

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
  );
};

// Toggle Subscribe API
const toggleSubscribeFunction = async (userToken) => {
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/api/v1/user/toggle-subscribe-btn`,
    null,
    { Authorization: `Bearer ${userToken}` }
  );
};

// Fetch Leaderboard Data API
const fetchLeaderboardDataFunction = async (
  { page = 1, limit = 10 },
  token
) => {
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/api/v1/user/get-leaderboard-data`,
    { page, limit },
    { Authorization: `Bearer ${token}` }
  );
};

// Wrapper to use token inside React components
const UserService = () => {
  const userToken = useAuthToken();

  return {
    getProfilePageDataFunction: () => getProfilePageDataFunction(userToken),
    getEditProfilePageDataFuncion: () =>
      getEditProfilePageDataFuncion(userToken),
    editProfileFunction: (params) => editProfileFunction(params, userToken),
    changePasswordFunction: (params) =>
      changePasswordFunction(params, userToken),
    changeProfilePicFunction: (formData) =>
      changeProfilePicFunction(formData, userToken),
    toggleSubscribeFunction: () => toggleSubscribeFunction(userToken),
    fetchLeaderboardDataFunction: (params) =>
      fetchLeaderboardDataFunction(params, userToken),
  };
};

export default UserService;
