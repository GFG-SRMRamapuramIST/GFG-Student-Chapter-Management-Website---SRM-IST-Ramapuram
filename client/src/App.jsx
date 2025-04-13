import ReactGA from "react-ga4";

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
  AllResources,
  Resource,
  UserManagement,
  AllowedEmails,
  SchedulerSettings,
} from "./Pages";
import {
  AuthLayout,
  RootLayout,
  AppLayout,
  PracticeLayout,
  ResourcesLayout,
  AdminLayout,
} from "./Layouts";

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
    { path: "dashboard", element: <Dashboard /> },
    { path: "leaderboard", element: <Leaderboard /> },
    // { path: "teams", element: <Teams /> },
    {
      path: "admin",
      element: <AdminLayout />,
      children: [
        { index: true, element: <AdminPanel /> },
        { path: "users", element: <UserManagement /> },
        { path: "emails", element: <AllowedEmails /> },
        { path: "scheduler", element: <SchedulerSettings /> },
      ],
    },
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
        { index: true, element: <AllResources /> },
        { path: ":id", element: <Resource /> },
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

// https://www.youtube.com/watch?v=AHSOdHIsYR0
// Follow the above YT tutorial to integrate Google Analytics with React
ReactGA.initialize("G-BQHHS79MLQ");

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
