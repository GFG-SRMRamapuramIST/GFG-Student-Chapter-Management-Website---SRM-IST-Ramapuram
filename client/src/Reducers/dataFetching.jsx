const initialState = {
  fetchData: false,
};

export const dataFetching = (state = initialState, action) => {
  switch (action.type) {
    case "TRY_FETCHING":
      return {
        ...state,
        fetchData: true,
      };

    case "DONE_FETCHING":
      return {
        ...state,
        fetchData: false,
      };

    default:
      return state;
  }
};

export default dataFetching;
