import { useEffect } from "react";
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastMsg, verifyUserToken } from "../Utilities";

const AdminLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userToken = useSelector((state) => state.auth?.userToken);

  useEffect(() => {
    const checkAdminAccess = async () => {
      const response = await verifyUserToken(userToken, dispatch, navigate);

      if (response?.role !== "ADMIN") {
        ToastMsg("Unauthorized access! Only admins allowed.", "error");
        navigate("/dashboard");
      }
    };

    checkAdminAccess();
  }, [userToken, dispatch, navigate]);

  const isActiveClass = ({ isActive }) => 
    isActive 
      ? "text-green-600 border-b-2 border-green-600" 
      : "text-gray-500 hover:text-green-600";

  return (
    <div className="mx-auto p-6 space-y-6">
      <div className="border-b">
        <div className="flex space-x-4">
          <NavLink 
            to="/admin/users" 
            className={({ isActive }) => `px-6 py-3 font-medium transition-colors duration-200 ${isActiveClass({ isActive })}`}
          >
            User Management
          </NavLink>
          <NavLink 
            to="/admin/emails" 
            className={({ isActive }) => `px-6 py-3 font-medium transition-colors duration-200 ${isActiveClass({ isActive })}`}
          >
            Allowed Emails
          </NavLink>
          <NavLink 
            to="/admin/scheduler" 
            className={({ isActive }) => `px-6 py-3 font-medium transition-colors duration-200 ${isActiveClass({ isActive })}`}
          >
            Scheduler Controls
          </NavLink>
        </div>
      </div>
      
      <Outlet />
    </div>
  );
};

export default AdminLayout;