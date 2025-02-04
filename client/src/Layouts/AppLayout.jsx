import { Outlet } from "react-router-dom";

const AppLayout = () => {

  return (
    <div className="relative pt-24 pb-16 px-16 md:px-32 min-h-screen">
      <Outlet />
    </div>
  );
};

export default AppLayout;