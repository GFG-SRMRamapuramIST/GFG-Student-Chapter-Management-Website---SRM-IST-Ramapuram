import { createContext, useContext, useState } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  // "USER",
  //   "MEMBER",
  //   "COREMEMBER",
  //   "VICEPRESIDENT",
  //   "PRESIDENT",
  //   "ADMIN",

  const [userState, setUserState] = useState({
    userRole: "USER",
    tokenVerified: false,
    isLoading: false,
  });

  const updateUserState = (newState) => {
    setUserState((prev) => ({
      ...prev,
      ...newState,
    }));
  };

  return (
    <UserContext.Provider
      value={{
        ...userState,
        updateUserState,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within an UserProvider");
  }
  return context;
};
