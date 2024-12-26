import { combineReducers } from "redux";

import storedUserData from "./storeUserData";

const rootReducers = combineReducers({
  storedUserData,
});
export default rootReducers;
