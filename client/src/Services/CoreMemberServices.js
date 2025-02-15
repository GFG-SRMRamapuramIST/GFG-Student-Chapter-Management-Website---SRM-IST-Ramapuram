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

// Wrapper to use token inside React components
const CoreMemberServices = () => {
  const userToken = useAuthToken();

  return {
    meetingCreationFunction: (params) =>
      meetingCreationFunction(params, userToken),
  };
};

export default CoreMemberServices;
