import { RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";
import { LandingPage, Dashboard, Login, SignUp, ForgotPassword, Profile, EditProfile, Teams } from "./Pages";
import { AuthLayout, RootLayout } from "./Layouts";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/teams",
        element: <Teams />,
      },
      {
        path: "/profile",
        children: [
          {
            index: true,
            element: <Profile />
          },
          {
            path: "edit",
            element: <EditProfile />
          }
        ]
      },
      {
        path: "/auth",
        element: <AuthLayout />,
        children: [
          {
            path: "login",
            element: <Login />,
          },
          {
            path: "register",
            element: <SignUp />,
          },
          {
            path: "forgot-password",
            element: <ForgotPassword />,
          },
        ],
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;