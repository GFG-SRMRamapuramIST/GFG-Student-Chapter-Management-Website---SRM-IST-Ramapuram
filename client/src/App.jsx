import { RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";

import {
  LandingPage,
  Dashboard,
  Login,
  SignUp,
  ForgotPassword,
  Profile,
  EditProfile,
  Teams,
  Leaderboard,
  TermsAndConditions,
  UserManual,
  PrivacyPolicy,
  AdminPanel,
  NotFound,
  AllResources,
  Resource,
  ReportAnIssue,
  AboutUs,
} from "./Pages";
import { AuthLayout, RootLayout, AppLayout, ResourceLayout } from "./Layouts";

// Auth routes (public)
const authRoutes = {
  path: "auth",
  element: <AuthLayout />,
  children: [
    { path: "login", element: <Login /> },
    { path: "register", element: <SignUp /> },
    { path: "forgot-password", element: <ForgotPassword /> },
  ],
};

// App routes (protected)
const appRoutes = {
  element: <AppLayout />,
  children: [
    { path: "admin", element: <AdminPanel /> },
    { path: "dashboard", element: <Dashboard /> },
    { path: "leaderboard", element: <Leaderboard /> },
    // { path: "teams", element: <Teams /> },
    {
      path: "resources",
      element: <ResourceLayout />,
      children: [
        { index: true, element: <AllResources /> },
        { path: ":id", element: <Resource /> },
      ],
    },
    {
      path: "profile",
      children: [
        { index: true, element: <Profile /> },
        { path: "edit", element: <EditProfile /> },
        { path: ":id", element: <Profile /> },
      ],
    },
    {
      path: "support",
      children: [
        { path: "terms", element: <TermsAndConditions /> },
        // { path: "privacy", element: <PrivacyPolicy /> },
        { path: "report-issue", element: <ReportAnIssue /> },
        { path: "user-manual", element: <UserManual /> },
      ],
    },
  ],
};

// Root router configuration
const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/about", element: <AboutUs /> },
      authRoutes,
      appRoutes,
      { path: "*", element: <NotFound /> },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
