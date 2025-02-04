import { RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";
import { LandingPage, Dashboard, Login, SignUp, ForgotPassword, Profile, EditProfile, Teams, Leaderboard } from "./Pages";
import { AuthLayout, RootLayout, AppLayout } from "./Layouts";

// Auth routes (public)
const authRoutes = {
  path: "auth",
  element: <AuthLayout />,
  children: [
    { path: "login", element: <Login /> },
    { path: "register", element: <SignUp /> },
    { path: "forgot-password", element: <ForgotPassword /> }
  ]
};

// App routes (protected)
const appRoutes = {
  element: <AppLayout />,
  children: [
    { path: "dashboard", element: <Dashboard /> },
    { path: "leaderboard", element: <Leaderboard /> },
    { path: "teams", element: <Teams /> },
    {
      path: "profile",
      children: [
        { index: true, element: <Profile /> },
        { path: "edit", element: <EditProfile /> }
      ]
    }
  ]
};

// Root router configuration
const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <LandingPage /> },
      authRoutes,
      appRoutes
    ]
  }
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;