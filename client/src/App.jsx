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
  Leaderboard,
  TermsAndConditions,
  UserManual,
  AdminPanel,
  NotFound,
  Practice,
  PracticeSet,
  ReportAnIssue,
  AboutUs,
  ProfileComparison,
} from "./Pages";
import { AuthLayout, RootLayout, AppLayout, PracticeLayout, ResourcesLayout } from "./Layouts";

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
      path: "practice",
      element: <PracticeLayout />,
      children: [
        { index: true, element: <Practice /> },
        { path: ":id", element: <PracticeSet /> },
      ],
    },
    {
      path: "resources",
      element: <ResourcesLayout />,
      children: [
        { index: true, element: <Practice /> },
        { path: ":id", element: <PracticeSet /> },
      ],
    },
    {
      path: "profile",
      children: [
        { index: true, element: <Profile /> },
        { path: "edit", element: <EditProfile /> },
        { path: "compare", element: <ProfileComparison /> },
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
