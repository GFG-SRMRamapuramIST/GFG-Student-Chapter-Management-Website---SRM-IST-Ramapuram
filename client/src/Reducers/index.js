/*import Logo from "./Logo.jsx";

export { Logo };*/

// This file will act as single source for importing all the modules/files of this folder and will hence be used as a single source for exporting
import { combineReducers } from "redux";

import storedUserData from "./storeUserData";
import dataFetching from "./dataFetching";

const rootReducers = combineReducers({
  storedUserData,
  dataFetching,
});
export default rootReducers;
