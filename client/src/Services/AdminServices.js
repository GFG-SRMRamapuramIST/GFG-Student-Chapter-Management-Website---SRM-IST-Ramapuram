import { useSelector } from "react-redux";
import { commonrequest } from "./APIConfig";
import { BACKEND_URL } from "./Helper";

// Function to get user token inside a hook
const useAuthToken = () => useSelector((state) => state.auth?.userToken);

// Add array of Emails to register API
const addAllowedEmails = async ({ emails }, userToken) => {
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/api/v1/admin/add-allowed-emails`,
    { emails },
    { Authorization: `Bearer ${userToken}` }
  );
};

// Fetch all allowed emails API
const fetchAllowedEmails = async (
  { page = 1, limit = 10, search = "", sortOrder = 1 },
  userToken
) => {
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/api/v1/admin/fetch-all-allowed-emails`,
    { page, limit, search, sortOrder },
    { Authorization: `Bearer ${userToken}` }
  );
};

// Delete emails from AllowedEmail schema API
const deleteAllowedEmail = async ({ userId }, userToken) => {
  return await commonrequest(
    "DELETE",
    `${BACKEND_URL}/api/v1/admin/delete-allowed-email`,
    { userId },
    { Authorization: `Bearer ${userToken}` }
  );
};

// Fetach all users API
const fetchAllUsers = async (
  { page = 1, limit = 10, search = "", sortOrder = 1 },
  userToken
) => {
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/api/v1/admin/fetch-all-users`,
    { page, limit, search, sortOrder },
    { Authorization: `Bearer ${userToken}` }
  );
};

// Promote user one rank above API
const promoteUser = async ({ userId }, userToken) => {
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/api/v1/admin/promote-user`,
    { userId },
    { Authorization: `Bearer ${userToken}` }
  );
};

// Demote user one rank below API
const demoteUser = async ({ userId }, userToken) => {
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/api/v1/admin/demote-user`,
    { userId },
    { Authorization: `Bearer ${userToken}` }
  );
};

// Delete a user from the website
const deleteUserAccount = async ({ userId }, userToken) => {
  return await commonrequest(
    "DELETE",
    `${BACKEND_URL}/api/v1/admin/delete-user-account`,
    { userId },
    { Authorization: `Bearer ${userToken}` }
  );
};

// Wrapper to use token inside React components
const AdminServices = () => {
  const userToken = useAuthToken();

  return {
    addAllowedEmails: (params) => addAllowedEmails(params, userToken),
    fetchAllowedEmails: (params) => fetchAllowedEmails(params, userToken),
    deleteAllowedEmail: (params) => deleteAllowedEmail(params, userToken),
    fetchAllUsers: (params) => fetchAllUsers(params, userToken),
    promoteUser: (params) => promoteUser(params, userToken),
    demoteUser: (params) => demoteUser(params, userToken),
    deleteUserAccount: (params) => deleteUserAccount(params, userToken),
  };
};

export default AdminServices;