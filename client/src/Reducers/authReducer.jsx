const initialState = {
  userToken: "",
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "STORE_USER_TOKEN":
      return {
        ...state,
        userToken: action.payload.userToken,
      };

    case "REMOVE_USER_TOKEN":
      return {
        ...state,
        userToken: null,
      };

    default:
      return state;
  }
};

export default authReducer;
