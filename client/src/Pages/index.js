import LandingPage from "./LandingPage";
import AdminPanel from "./AdminPanel";

// Auth Routes
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";
import ForgotPassword from "./Auth/ForgotPassword";

import Dashboard from "./Dashboard";
import Teams from "./Teams";
import Leaderboard from "./Leaderboard";

// Resources Route
import AllResources from "./Resources/AllResources";
import Resource from "./Resources/Resource";

// User Profile Routes
import Profile from "./UserProfile/Profile";
import EditProfile from "./UserProfile/EditProfile";

// User Support Routes
import TermsAndConditions from "./UserSupport/TermsAndConditions";
import PrivacyPolicy from "./UserSupport/PrivacyPolicy";
import UserManual from "./UserSupport/UserManual";
import ReportAnIssue from "./UserSupport/ReportAnIssue";

// Errors
import NotFound from "./Errors/NotFound";

export { 
  LandingPage,
  AdminPanel,
  Dashboard,
  Login,
  SignUp,
  ForgotPassword,
  Profile,
  EditProfile,
  Teams,
  Leaderboard,
  TermsAndConditions,
  PrivacyPolicy,
  UserManual,
  ReportAnIssue,
  NotFound,
  AllResources,
  Resource
};