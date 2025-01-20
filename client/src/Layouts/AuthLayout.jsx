import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AuthLayout = () => {
  const userToken = useSelector((state) => state.auth?.userToken);

  if (userToken) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="relative min-h-screen bg-gray-50">
      <Outlet />
    </div>
  );
};

export default AuthLayout;