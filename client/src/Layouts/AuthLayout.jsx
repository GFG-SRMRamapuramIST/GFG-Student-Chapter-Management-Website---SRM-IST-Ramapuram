import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="relative min-h-screen bg-gray-50">
      <Outlet />
    </div>
  );
};

export default AuthLayout;