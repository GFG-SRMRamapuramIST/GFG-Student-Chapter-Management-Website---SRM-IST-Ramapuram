import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { HeikiBackground, Footer, Navbar } from "../Components";

const RootLayout = () => {
  const userToken = useSelector((state) => state.auth?.userToken);
  const { pathname } = useLocation();

  const isAuthRoute = pathname.startsWith("/auth");
  const isLandingPage = pathname === "/";
  const isProtectedRoute = !isAuthRoute && !isLandingPage;

  // Redirect authenticated users away from public routes
  // if (userToken && (isAuthRoute || isLandingPage)) {
  //   return <Navigate to="/dashboard" />;
  // }

  // Redirect unauthenticated users from protected routes
  // if (!userToken && isProtectedRoute) {
  //   return <Navigate to="/auth/login" />;
  // }

  return (
    <div className="relative ">
      <HeikiBackground
        primaryColor="#00895e"
        secondaryColor="#2f8d46"
        pattern="blocks"
        opacity={0.2}
      />
      <div className="relative">
        <Navbar />
        <div className="relative min-h-[50vh]">
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default RootLayout;
