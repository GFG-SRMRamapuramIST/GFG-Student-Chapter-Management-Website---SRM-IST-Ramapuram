import { useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import ProtectedRoute from "./Components/ProtectedRoute";
import { 
  Home, 
  LoginPage,
} from "./Pages";
import { Navbar } from "./Components";

import { ToastMsg } from "./Constants";

const App = () => {
  const userToken = useSelector((state) => state.storedUserData.userToken);

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
            userToken ? <Navigate to="/" /> : <LoginPage />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
