import { combineReducers } from "redux";

import authReducer from "./authReducer";

const rootReducers = combineReducers({
  authReducer,
});
export default rootReducers;
