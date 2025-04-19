import { useSelector } from "react-redux";

import { commonrequest } from "./APIConfig";
import { BACKEND_URL } from "./Helper";

// Function to get user token inside a hook
const useAuthToken = () => useSelector((state) => state.auth?.userToken);

// Create a meeting API
const meetingCreationFunction = async (
  {
    title,
    description,
    meetingLink,
    meetingDate,
    meetingTime,
    compulsory,
    toSendEmail,
  },
  userToken
) => {
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/api/v1/core-member/create-meeting`,
    {
      title,
      description,
      meetingLink,
      meetingDate,
      meetingTime,
      compulsory,
      toSendEmail,
    },
    { Authorization: `Bearer ${userToken}` }
  );
};

// Delete a meeting API
const deleteMeetingFunction = async ({ dateId, noticeId }, userToken) => {
  return await commonrequest(
    "DELETE",
    `${BACKEND_URL}/api/v1/core-member/delete-meeting`,
    { dateId, noticeId },
    { Authorization: `Bearer ${userToken}` }
  );
};

// Create mom for a meeting API
const createMoMFunction = async ({ dateId, noticeId, MoMLink }, userToken) => {
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/api/v1/core-member/create-mom`,
    { dateId, noticeId, MoMLink },
    { Authorization: `Bearer ${userToken}` }
  );
};

// Delete mom for a meeting API
const deleteMoMFunction = async ({ dateId, noticeId }, userToken) => {
  return await commonrequest(
    "DELETE",
    `${BACKEND_URL}/api/v1/core-member/delete-mom`,
    { dateId, noticeId },
    { Authorization: `Bearer ${userToken}` }
  );
};

// Create a contest API
const contestCreationFunction = async (
  { contestName, contestLink, platform, startTime, endTime, date, toSendEmail },
  userToken
) => {
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/api/v1/core-member/create-contest`,
    {
      contestName,
      contestLink,
      platform,
      startTime,
      endTime,
      date,
      toSendEmail,
    },
    { Authorization: `Bearer ${userToken}` }
  );
};

// Delete a contest API
const deleteContestFunction = async ({dateId, contestId}, userToken) => {
  return await commonrequest(
    "DELETE",
    `${BACKEND_URL}/api/v1/core-member/delete-contest`,
    { dateId, contestId },
    { Authorization: `Bearer ${userToken}` }
  );
};

// Get dashboard calender data API
const getDashboardCalenderDataFunction = async (userToken) => {
  return await commonrequest(
    "GET",
    `${BACKEND_URL}/api/v1/core-member/get-dashboard-calender-data`,
    {},
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

// Create announcement API
const createAnnouncementFunction = async (
  { title, description, date, time, links = [] },
  userToken
) => {
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/api/v1/core-member/create-announcement`,
    { title, description, date, time, links },
    { Authorization: `Bearer ${userToken}` }
  );
};

// Delete announcement API
const deleteAnnouncementFunction = async ({ announcementId }, userToken) => {
  return await commonrequest(
    "DELETE",
    `${BACKEND_URL}/api/v1/core-member/delete-announcement`,
    { announcementId },
    { Authorization: `Bearer ${userToken}` }
  );
};

// Fetch all announcements API
const fetchAllAnnouncementFunction = async (userToken) => {
  return await commonrequest(
    "GET",
    `${BACKEND_URL}/api/v1/core-member/get-all-announcement`,
    {},
    { Authorization: `Bearer ${userToken}` }
  );
};

// Create a resource API
const createVideoResourceFunction = async ({ title, description }, userToken) => {
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/api/v1/core-member/create-video-resource`,
    { title, description },
    { Authorization: `Bearer ${userToken}` }
  );
};

// Add a question to a resource API
const addVideoToVideoResourceFunction = async (
  { vidoeResourceId, title, description, link },
  userToken
) => {
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/api/v1/core-member/add-video`,
    { vidoeResourceId, title, description, link },
    { Authorization: `Bearer ${userToken}` }
  );
};

// Delete a question from a resource API
const deleteVideoFromVideoResourceFunction = async (
  { videoResourceId, videoId } ,
  userToken
) => {
  return await commonrequest(
    "DELETE",
    `${BACKEND_URL}/api/v1/core-member/delete-video`,
    { videoResourceId, videoId } ,
    { Authorization: `Bearer ${userToken}` }
  );
};

// Delete a resource API
const deleteVideoResourceFunction = async ({ videoResourceId }, userToken) => {
  return await commonrequest(
    "DELETE",
    `${BACKEND_URL}/api/v1/core-member/delete-video-resource`,
    { videoResourceId },
    { Authorization: `Bearer ${userToken}` }
  );
};

// Edit a resource API
const editVideoResourceFunction = async (
  { videoResourceId, title, description },
  userToken
) => {
  return await commonrequest(
    "PUT",
    `${BACKEND_URL}/api/v1/core-member/edit-video-resource`,
    { videoResourceId, title, description },
    { Authorization: `Bearer ${userToken}` }
  );
};

// Fetch all resources API
const fetchAllVideoResourcesFunction = async (
  { page = 1, search = "" },
  userToken
) => {
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/api/v1/core-member/fetch-all-video-resource`,
    { page, search },
    { Authorization: `Bearer ${userToken}` }
  );
};

// Fetch all questions of a resource API
const fetchAllVideoOfVideoResourceFunction = async (
  { videoResourceId },
  userToken
) => {
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/api/v1/core-member/fetch-all-video`,
    { videoResourceId },
    { Authorization: `Bearer ${userToken}` }
  );
};

// Festival creation API
const createFestivalFunction = async (
  { title, date },
  userToken
) => {
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/api/v1/core-member/add-festival`,
    { title, date },
    { Authorization: `Bearer ${userToken}` }
  );
};

// Festival deletion API
const deleteFestivalFunction = async (
  { festivalId },
  userToken
) => {
  return await commonrequest(
    "DELETE",
    `${BACKEND_URL}/api/v1/core-member/delete-festival`,
    { festivalId },
    { Authorization: `Bearer ${userToken}` }
  );
};

// Wrapper to use token inside React components
const CoreMemberServices = () => {
  const userToken = useAuthToken();

  return {
    meetingCreationFunction: (params) =>
      meetingCreationFunction(params, userToken),
    deleteMeetingFunction: (params) => deleteMeetingFunction(params, userToken),
    createMoMFunction: (params) => createMoMFunction(params, userToken),
    deleteMoMFunction: (params) => deleteMoMFunction(params, userToken),
    contestCreationFunction: (params) =>
      contestCreationFunction(params, userToken),
    deleteContestFunction: (params) => deleteContestFunction(params, userToken),
    getDashboardCalenderDataFunction: () =>
      getDashboardCalenderDataFunction(userToken),
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
    createAnnouncementFunction: (params) =>
      createAnnouncementFunction(params, userToken),
    deleteAnnouncementFunction: (params) =>
      deleteAnnouncementFunction(params, userToken),
    fetchAllAnnouncementFunction: () => fetchAllAnnouncementFunction(userToken),
    createVideoResourceFunction: (params) =>
      createVideoResourceFunction(params, userToken),
    addVideoToVideoResourceFunction: (params) =>
      addVideoToVideoResourceFunction(params, userToken),
    deleteVideoFromVideoResourceFunction: (params) =>
      deleteVideoFromVideoResourceFunction(params, userToken),
    deleteVideoResourceFunction: (params) =>
      deleteVideoResourceFunction(params, userToken),
    editVideoResourceFunction: (params) =>
      editVideoResourceFunction(params, userToken),
    fetchAllVideoResourcesFunction: (params) =>
      fetchAllVideoResourcesFunction(params, userToken),
    fetchAllVideoOfVideoResourceFunction: (params) =>
      fetchAllVideoOfVideoResourceFunction(params, userToken),
    createFestivalFunction: (params) => createFestivalFunction(params, userToken),
    deleteFestivalFunction: (params) => deleteFestivalFunction(params, userToken),
  };
};

export default CoreMemberServices;
