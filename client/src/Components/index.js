/*import Logo from "./Logo.jsx";

export { Logo };*/

// Single point of import for all components

//UI components
import NotificationItem from "./ui/NotificationItem";
import HeikiBackground from "./ui/HeikiBackground";

export { NotificationItem, HeikiBackground };

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

export { HeroSection, AboutSection };

// Dashboard Components
import DashboardHeader from "./Dashboard/DashboardHeader";
import StatsSection from "./Dashboard/StatsSection";
import NotificationsSection from "./Dashboard/NotificationsSection";
import LeaderboardSection from "./Dashboard/LeaderboardSection";

export { DashboardHeader, StatsSection, NotificationsSection, LeaderboardSection };

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

export { ProfileHero, PlatformPOTDs, ProfileSecondary, PasswordChangeModal, ProfilePictureEditor, PlatformLinkPlaceholder };

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

export { UserTable, AllowedEmailsForm, AllowedEmailsTable };

// Resource Page Components
import AddProblemModal from "./Resources/AddProblemModal";
import CreateResourceModal from "./Resources/CreateResourceModa";
import ResourceCard from "./Resources/ResourceCard";
import EditResourceModal from "./Resources/EditResourcemodal";

export { AddProblemModal, CreateResourceModal, ResourceCard, EditResourceModal };