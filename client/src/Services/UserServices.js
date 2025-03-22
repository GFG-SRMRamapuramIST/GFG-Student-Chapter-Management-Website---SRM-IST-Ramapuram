import { useSelector } from "react-redux";

import { commonrequest } from "./APIConfig";
import { BACKEND_URL } from "./Helper";

// Function to get user token inside a hook
const useAuthToken = () => useSelector((state) => state.auth?.userToken);

// Get profile page data API
const getProfilePageDataFunction = async (params, token) => {
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/api/v1/user/get-profile-data`,
    params,
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

// Fetch top 5 users API
const fetchTop5UsersFunction = async (token) => {
  return await commonrequest(
    "GET",
    `${BACKEND_URL}/api/v1/user/get-top-5-users`,
    null,
    { Authorization: `Bearer ${token}` }
  );
};

// Fetch POTD API
const fetchPOTDFunction = async (token) => {
  return await commonrequest(
    "GET",
    `${BACKEND_URL}/api/v1/user/get-potd`,
    null,
    { Authorization: `Bearer ${token}` }
  );
}

// Report an Issue API
const reportAnIssueFunction = async (formData) => {
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/api/v1/user/report-an-issue`,
    formData,
    {
      "Content-Type": "multipart/form-data",
    }
  )
}

// Get all users with id and name
const getAllUsersWithIdAndNameFunction = async (token) => {
  return await commonrequest(
    "GET",
    `${BACKEND_URL}/api/v1/user/get-all-users-with-id-and-name`,
    null,
    { Authorization: `Bearer ${token}` }
  );
};

// Wrapper to use token inside React components
const UserService = () => {
  const userToken = useAuthToken();

  return {
    getProfilePageDataFunction: (params) =>
      getProfilePageDataFunction(params, userToken),
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
    fetchTop5UsersFunction: () => fetchTop5UsersFunction(userToken),
    fetchPOTDFunction: () => fetchPOTDFunction(userToken),
    reportAnIssueFunction: (formData) => reportAnIssueFunction(formData),
    getAllUsersWithIdAndNameFunction: () =>
      getAllUsersWithIdAndNameFunction(userToken),
  };
};

export default UserService;
