import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const userToken = useSelector((state) => state.storedUserData.userToken);

  if (!userToken) {
    // If the user is not logged in, redirect to the login page
    return <Navigate to="/login" />;
  }

  // If the user is logged in, render the child component
  return children;
};

export default ProtectedRoute;
