import LandingPage from "./LandingPage";
import AboutUs from "./AboutUs";
import AdminPanel from "./AdminPanel";

// Auth Routes
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";
import ForgotPassword from "./Auth/ForgotPassword";

import Dashboard from "./Dashboard";
import Teams from "./Teams";
import Leaderboard from "./Leaderboard";

// Practice Route
import Practice from "./Practice/Practice";
import PracticeSet from "./Practice/PracticeSet";

// User Profile Routes
import Profile from "./UserProfile/Profile";
import EditProfile from "./UserProfile/EditProfile";
import ProfileComparison from "./UserProfile/ProfileComparison";

// User Support Routes
import TermsAndConditions from "./UserSupport/TermsAndConditions";
import PrivacyPolicy from "./UserSupport/PrivacyPolicy";
import UserManual from "./UserSupport/UserManual";
import ReportAnIssue from "./UserSupport/ReportAnIssue";

// Errors
import NotFound from "./Errors/NotFound";

export { 
  LandingPage,
  AboutUs,
  AdminPanel,
  Dashboard,
  Login,
  SignUp,
  ForgotPassword,
  Profile,
  EditProfile,
  ProfileComparison,
  Teams,
  Leaderboard,
  TermsAndConditions,
  PrivacyPolicy,
  UserManual,
  ReportAnIssue,
  NotFound,
  Practice,
  PracticeSet
};