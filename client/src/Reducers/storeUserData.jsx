const initialState = {
  userToken: "",
};

export const storedUserData = (state = initialState, action) => {
  switch (action.type) {
    case "STORE_USER_DATA":
      return {
        ...state,
        userToken: action.payload.userToken,
      };

    case "REMOVE_USER_DATA":
      return {
        ...state,
        userToken: null,
      };

    default:
      return state;
  }
};

export default storedUserData;
