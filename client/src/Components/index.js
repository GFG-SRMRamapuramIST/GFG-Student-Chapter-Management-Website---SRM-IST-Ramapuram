/*import Logo from "./Logo.jsx";

export { Logo };*/

// Single point of import for all components

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
import DashboardHero from "./Dashboard/DashboardHero";

export { DashboardHero };

// Profile Components
import ProfileHero from "./Profile/ProfileHero";
import OverviewSection from "./Profile/OverviewSection";
import UpcomingEvents from "./Profile/UpcomingEvents";
import PlatformProgress from "./Profile/PlatformProgress";  

export { ProfileHero, OverviewSection, UpcomingEvents, PlatformProgress };

// Calendar Components
import CustomCalendar from "./Calendar/CustomCalendar";

export { CustomCalendar };