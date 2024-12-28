import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import ProtectedRoute from "./Components/ProtectedRoute";
import { 
  Home, 
  LoginPage,
  SignUp,
  VerifyEmail,
  VerifyOtp,
  ResetPassword,
} from "./Pages";
import { Navbar } from "./Components";

const App = () => {
  const userToken = useSelector((state) => state.storedUserData.userToken);
  
  // const emailVerified = useSelector(
  //   (state) => state.resetPasswordState.emailVerified
  // );
  // const otpVerified = useSelector(
  //   (state) => state.resetPasswordState.otpVerified
  // );

  // Simulated states for email verification and OTP verification
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      if (userToken) {
        try {
          // Simulate token verification
          console.log("Token verified");
        } catch (error) {
          console.error("Token verification error:", error);
          localStorage.clear(); // Clear storage if there's an error
          window.location.reload();
        }
      }
    };

    checkToken();
  }, [userToken]);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Protected Home Route */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Login Route */}
        <Route
          path="/login"
          element={
            userToken ? (
              <Navigate to="/" />
            ) : emailVerified && !otpVerified ? (
              <VerifyOtp />
            ) : emailVerified && otpVerified ? (
              <ResetPassword />
            ) : (
              <LoginPage />
            )
          }
        />

        {/* Signup Route */}
        <Route 
          path="/sign-up"
          element={
            userToken ? (
              <Navigate to="/" />
            ) : emailVerified && !otpVerified ? (
              <VerifyOtp />
            ) : emailVerified && otpVerified ? (
              <ResetPassword />
            ) : (
              <SignUp />
            )
          }
        />

        {/* Email Verification Route */}
        <Route 
          path="/forgot-password"
          element={
            userToken ? (
              <Navigate to="/" />
            ) : emailVerified && !otpVerified ? (
              <VerifyOtp />
            ) : emailVerified && otpVerified ? (
              <ResetPassword />
            ) : (
              <VerifyEmail />
            )
          }
        />

        {/* OTP Verification Route */}
        <Route
          path="/verify-otp"
          element={
            userToken ? (
              <Navigate to="/" />
            ) : !emailVerified && !otpVerified ? (
              <VerifyEmail />
            ) : emailVerified && otpVerified ? (
              <ResetPassword />
            ) : (
              <VerifyOtp />
            )
          }
        />

        {/* Reset Password Route */}
        <Route
          path="/reset-password"
          element={
            userToken ? (
              <Navigate to="/" />
            ) : !emailVerified ? (
              <VerifyEmail />
            ) : !otpVerified ? (
              <VerifyOtp />
            ) : (
              <ResetPassword />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
