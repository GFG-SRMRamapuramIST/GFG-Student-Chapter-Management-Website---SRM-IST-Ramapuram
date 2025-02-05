export const storeUserToken = (userToken) => ({
  type: "STORE_USER_TOKEN",
  payload: { userToken },
});

export const removeUserToken = () => ({
  type: "REMOVE_USER_TOKEN",
});
