/*import Logo from "./Logo.jsx";

export { Logo };*/

// Single point of import for all components

//UI components
import NotificationItem from "./ui/NotificationItem";
import HeikiBackground from "./ui/HeikiBackground";
import Medal from "./ui/Medal";
import CustomDialog from "./ui/CustomDialog";

export { NotificationItem, HeikiBackground, Medal, CustomDialog };

// Navigation Components
import Navbar from "./Navigation/Navbar";
import Footer from "./Navigation/Footer";

export { Navbar, Footer };

// Auth Components
import AuthBackground from "./Auth/AuthBackground";
import InputField from "./Auth/InputField";

export { AuthBackground, InputField };

// Landing Page components
import HeroSection from "./Landing/HeroSection";
import AboutSection from "./Landing/AboutSection";
import TestimonialsSection from "./Landing/Testimonials";
import VideoFeatureSection from "./Landing/VideoFeatureSection";

export { HeroSection, AboutSection, TestimonialsSection, VideoFeatureSection };

// Dashboard Components
import DashboardHeader from "./Dashboard/DashboardHeader";
import StatsSection from "./Dashboard/StatsSection";
import NotificationsSection from "./Dashboard/NotificationsSection";
import LeaderboardSection from "./Dashboard/LeaderboardSection";

export {
  DashboardHeader,
  StatsSection,
  NotificationsSection,
  LeaderboardSection,
};

// Team Components
import TeamHero from "./Teams/TeamsHero";
import TeamCard from "./Teams/TeamCard";
import TeamDetailsModal from "./Teams/TeamDetailsModal";

export { TeamHero, TeamCard, TeamDetailsModal };

// Profile Components
import ProfileHero from "./Profile/ProfileHero";
import ProfileSecondary from "./Profile/ProfileSecondary";
import PlatformPOTDs from "./Profile/PlatformPOTDs";
import PasswordChangeModal from "./Profile/PasswordChangeModal";
import ProfilePictureEditor from "./Profile/ProfilePictureEditor";
import PlatformLinkPlaceholder from "./Profile/PlatformLinkPlaceholder";
import MonthlyActivityHeatmap from "./Profile/MonthlyActivityHeatmap";
import VerificationPopup from "./Profile/VerificationPopup";
import EditPlatformCard from "./Profile/EditPlatformCard";

export {
  ProfileHero,
  PlatformPOTDs,
  ProfileSecondary,
  PasswordChangeModal,
  ProfilePictureEditor,
  PlatformLinkPlaceholder,
  MonthlyActivityHeatmap,
  EditPlatformCard,
  VerificationPopup,
};

// Leaderboard Components
import LeaderboardHero from "./Leaderboard/LeaderboardHero";
import LeaderboardTable from "./Leaderboard/LeaderboardTable";

export { LeaderboardHero, LeaderboardTable };

// Calendar Components
import CustomCalendar from "./Calendar/CustomCalendar";

export { CustomCalendar };

// Admin Panel Components
import UserTable from "./Admin/UserTable";
import AllowedEmailsForm from "./Admin/AllowedEmailsForm";
import AllowedEmailsTable from "./Admin/AllowedEmailsTable";
import SchedulerControls from "./Admin/SchedulerControls";

export { UserTable, AllowedEmailsForm, AllowedEmailsTable, SchedulerControls };

// Practice Page Components
import AddProblemModal from "./Practice/AddProblemModal";
import CreatePracticeSetModal from "./Practice/CreatePracticeSetModal";
import PracticeSetCard from "./Practice/PracticeSetCard";
import EditPracticeSetModal from "./Practice/EditPracticeSetModal";

export {
  AddProblemModal,
  CreatePracticeSetModal,
  PracticeSetCard,
  EditPracticeSetModal,
};

// Resources Page Components
import ResourceCard from "./Resources/ResourceCard";
import AddResourceModal from "./Resources/AddResourceModal";
import EditResourceModal from "./Resources/EditResourceModal";
import CreateResourceSetModal from "./Resources/CreateResourceSetModal";

export {
  ResourceCard,
  AddResourceModal,
  EditResourceModal,
  CreateResourceSetModal,
};