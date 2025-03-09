import { createRoot } from "react-dom/client";

import store, { persistor } from "./store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { ToastContainer } from "react-toastify";

import "./index.css";
import App from "./App.jsx";
import { UserProvider } from "./Context/UserContext.jsx";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <UserProvider>
        <ToastContainer />
        <App />
      </UserProvider>
    </PersistGate>
  </Provider>
);
