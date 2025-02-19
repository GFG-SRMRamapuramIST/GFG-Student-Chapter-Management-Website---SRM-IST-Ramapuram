import { useEffect, useState } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { HeikiBackground, Footer, Navbar } from "../Components";
import { ScrollToTop, ToastMsg } from "../Utilities";

// Importing APIs
import { AuthServices } from "../Services";
import { removeUserToken } from "../Actions";

const RootLayout = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  // ************ Verify User Token Starts Here ************
  const [tokenVerified, setTokenVerified] = useState(false);
  const userToken = useSelector((state) => state.auth?.userToken);
  const verifyUserToken = async (userToken) => {
    try {
      const response = await AuthServices.verifyAuthToken(userToken);
      if (response.status == 200) {
        setTokenVerified(true);
      } else {
        ToastMsg("Session expired! Please login again.", "error");
        dispatch(removeUserToken());
      }
    } catch (error) {
      ToastMsg("Internal Server Error! Please login again.", "error");
      console.error("Login Error:", error.message);
    }
  };

  useEffect(() => {
    if (userToken) {
      verifyUserToken(userToken);
    }
  }, [userToken]);
  // ************ Verify User Token Ends Here ************

  // Public Routes
  const isAuthRoute = pathname.startsWith("/auth");
  const isUserManual = pathname === "/support/user-manual";
  const isSupportRoute = pathname.startsWith("/support") && !isUserManual;
  const isLandingRoutes = pathname === "/" || pathname=== "/about";

  const isProtectedRoute = !isAuthRoute && !isLandingRoutes && !isSupportRoute;

  //Redirect authenticated users away from public routes
  if (userToken && tokenVerified && (isAuthRoute || isLandingRoutes)) {
    return <Navigate to="/dashboard" />;
  }

  //Redirect unauthenticated users from protected routes
  if (!userToken && !tokenVerified && isProtectedRoute) {
    return <Navigate to="/auth/login" />;
  }

  return (
    <div className="relative ">
      <HeikiBackground
        primaryColor="#00895e"
        secondaryColor="#2f8d46"
        pattern="blocks"
        opacity={0.2}
      />

      <div className="relative">
        <ScrollToTop />
        <Navbar isLoggedIn={tokenVerified}/>
        <div className="relative min-h-[50vh]">
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default RootLayout;
