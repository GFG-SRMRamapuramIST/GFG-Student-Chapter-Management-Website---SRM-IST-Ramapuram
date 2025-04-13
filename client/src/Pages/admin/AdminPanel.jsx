import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the user management panel by default
    navigate("/admin/users");
  }, [navigate]);
  
  return null;
};

export default AdminPanel;