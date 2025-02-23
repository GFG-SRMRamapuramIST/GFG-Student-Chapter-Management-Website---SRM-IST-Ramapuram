import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="relative bg-gray-50">
      <Outlet />
    </div>
  );
};

export default AuthLayout;