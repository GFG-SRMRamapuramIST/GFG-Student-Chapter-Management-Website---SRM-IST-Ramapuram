// Will be used for handling react-reducers
export const storeUserData = (userToken) => ({
  type: "STORE_USER_DATA",
  payload: { userToken },
});

export const removeUserData = () => ({
  type: "REMOVE_USER_DATA",
});