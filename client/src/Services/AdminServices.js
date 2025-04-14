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

// Add csv file of emails to register API
const addAllowedEmailsCSV = async (formData, userToken) => {
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/api/v1/admin/upload-csv-allowed-emails`,
    formData,
    { Authorization: `Bearer ${userToken}` }
  );
}

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
  {
    page = 1,
    limit = 10,
    search = "",
    sortOrder = 1,
    roles = [],
    protected: isProtected,
  },
  userToken
) => {
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/api/v1/admin/fetch-all-users`,
    { page, limit, search, sortOrder, roles, protected: isProtected },
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

// Fetch Constant Values function
const fetchConstantValues = async (userToken) => {
  return await commonrequest(
    "GET",
    `${BACKEND_URL}/api/v1/admin/fetch-constant-values`,
    {},
    { Authorization: `Bearer ${userToken}` }
  );
};

// Edit Constant Values function
const editConstantValues = async (
  {
    achievementScheduler,
    backupDataScheduler,
    resetDataScheduler,
    autoKickScheduler,
    passingMarks,
  },
  userToken
) => {
  return await commonrequest(
    "PUT",
    `${BACKEND_URL}/api/v1/admin/edit-constant-values`,
    {
      achievementScheduler,
      backupDataScheduler,
      resetDataScheduler,
      autoKickScheduler,
      passingMarks,
    },
    { Authorization: `Bearer ${userToken}` }
  );
};

// Reset achievement function
const resetAchievement = async (userToken) => {
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/api/v1/admin/reset-achievement`,
    {},
    { Authorization: `Bearer ${userToken}` }
  );
};

// Toggle user's protected status
const toggleProtectedStatus = async ({userId},userToken) => {
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/api/v1/admin/toggle-protected-status`,
    {userId},
    { Authorization: `Bearer ${userToken}` }
  );
}

// Wrapper to use token inside React components
const AdminServices = () => {
  const userToken = useAuthToken();

  return {
    addAllowedEmails: (params) => addAllowedEmails(params, userToken),
    addAllowedEmailsCSV: (params) => addAllowedEmailsCSV(params, userToken),
    fetchAllowedEmails: (params) => fetchAllowedEmails(params, userToken),
    deleteAllowedEmail: (params) => deleteAllowedEmail(params, userToken),
    fetchAllUsers: (params) => fetchAllUsers(params, userToken),
    promoteUser: (params) => promoteUser(params, userToken),
    demoteUser: (params) => demoteUser(params, userToken),
    deleteUserAccount: (params) => deleteUserAccount(params, userToken),
    fetchConstantValues: () => fetchConstantValues(userToken),
    editConstantValues: (params) => editConstantValues(params, userToken),
    resetAchievement: () => resetAchievement(userToken),
    toggleProtectedStatus: (params) => toggleProtectedStatus(params,userToken),
  };
};

export default AdminServices;