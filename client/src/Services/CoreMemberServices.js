import { useSelector } from "react-redux";

import { commonrequest } from "./APIConfig";
import { BACKEND_URL } from "./Helper";

// Function to get user token inside a hook
const useAuthToken = () => useSelector((state) => state.auth?.userToken);

// Create a meeting API
const meetingCreationFunction = async (
  { title, description, meetingLink, meetingDate, meetingTime, compulsory },
  userToken
) => {
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/api/v1/core-member/create-meeting`,
    { title, description, meetingLink, meetingDate, meetingTime, compulsory },
    { Authorization: `Bearer ${userToken}` }
  );
};

// Create a contest API
const contestCreationFunction = async (
  { contestName, contestLink, platform, startTime, endTime, date },
  userToken
) => {
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/api/v1/core-member/create-contest`,
    { contestName, contestLink, platform, startTime, endTime, date },
    { Authorization: `Bearer ${userToken}` }
  );
};

// Create a resource API
const createResourceFunction = async ({ title, description }, userToken) => {
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/api/v1/core-member/create-resource`,
    { title, description },
    { Authorization: `Bearer ${userToken}` }
  );
};

// Add a question to a resource API
const addQuestionToResourceFunction = async (
  { resourceId, title, link, difficulty, platform },
  userToken
) => {
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/api/v1/core-member/add-question`,
    { resourceId, title, link, difficulty, platform },
    { Authorization: `Bearer ${userToken}` }
  );
};

// Delete a question from a resource API
const deleteQuestionFromResourceFunction = async (
  { resourceId, questionId },
  userToken
) => {
  return await commonrequest(
    "DELETE",
    `${BACKEND_URL}/api/v1/core-member/delete-question`,
    { resourceId, questionId },
    { Authorization: `Bearer ${userToken}` }
  );
};

// Delete a resource API
const deleteResourceFunction = async ({ resourceId }, userToken) => {
  return await commonrequest(
    "DELETE",
    `${BACKEND_URL}/api/v1/core-member/delete-resource`,
    { resourceId },
    { Authorization: `Bearer ${userToken}` }
  );
};

// Edit a resource API
const editResourceFunction = async (
  { resourceId, title, description },
  userToken
) => {
  return await commonrequest(
    "PUT",
    `${BACKEND_URL}/api/v1/core-member/edit-resource`,
    { resourceId, title, description },
    { Authorization: `Bearer ${userToken}` }
  );
};

// Fetch all resources API
const fetchAllResourcesFunction = async (
  { page = 1, search = "" },
  userToken
) => {
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/api/v1/core-member/fetch-all-resources`,
    { page, search },
    { Authorization: `Bearer ${userToken}` }
  );
};

// Fetch all questions of a resource API
const fetchAllQuestionsOfResourceFunction = async (
  { resourceId, difficulty, platform },
  userToken
) => {
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/api/v1/core-member/fetch-all-questions`,
    { resourceId, difficulty, platform },
    { Authorization: `Bearer ${userToken}` }
  );
};

// Wrapper to use token inside React components
const CoreMemberServices = () => {
  const userToken = useAuthToken();

  return {
    meetingCreationFunction: (params) =>
      meetingCreationFunction(params, userToken),
    contestCreationFunction: (params) =>
      contestCreationFunction(params, userToken),
    createResourceFunction: (params) =>
      createResourceFunction(params, userToken),
    addQuestionToResourceFunction: (params) =>
      addQuestionToResourceFunction(params, userToken),
    deleteQuestionFromResourceFunction: (params) =>
      deleteQuestionFromResourceFunction(params, userToken),
    deleteResourceFunction: (params) =>
      deleteResourceFunction(params, userToken),
    editResourceFunction: (params) => editResourceFunction(params, userToken),
    fetchAllResourcesFunction: (params) =>
      fetchAllResourcesFunction(params, userToken),
    fetchAllQuestionsOfResourceFunction: (params) =>
      fetchAllQuestionsOfResourceFunction(params, userToken),
  };
};

export default CoreMemberServices;
