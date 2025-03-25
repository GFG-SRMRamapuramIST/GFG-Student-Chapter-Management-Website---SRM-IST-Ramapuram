import { Outlet } from "react-router-dom";

const AppLayout = () => {

  return (
    <div className=" relative pt-20 md:pt-24 pb-16 px-6 sm:px-12 md:px-16 lg:px-20 xl:px-24 min-h-screen">
      <Outlet />
    </div>
  );
};

export default AppLayout;