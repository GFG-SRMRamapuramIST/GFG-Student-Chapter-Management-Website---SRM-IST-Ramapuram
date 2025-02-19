import { useState } from "react";

// Icons
import { MdEmojiEvents, MdTrendingUp } from "react-icons/md";
import { IoStatsChart } from "react-icons/io5";

// Components & Utilities
import {
  CustomCalendar,
  DashboardHeader,
  LeaderboardSection,
  NotificationsSection,
  StatsSection,
} from "../Components";
import { ConfirmationPopup, ToastMsg } from "../Utilities";

const Dashboard = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // ================ DUMMY DATA ================

  const notifications = [
    "Team 'CodeCrusaders' achieved 2nd place in last contest",
    "New resource shared: Advanced DP Techniques",
    "Upcoming Contest: LeetCode Weekly on Sunday",
  ];

  const events = [
    {
      type: "contest",
      platform: "leetcode",
      name: "Weekly Contest 123",
      time: "2025-02-06T14:30:00",
      link: "https://leetcode.com/contest/123",
    },
  ];

  const stats = [
    { icon: MdTrendingUp, label: "Points", value: "324", change: 12 },
    { icon: MdEmojiEvents, label: "Current Rank", value: "#42", change: 5 },
    { icon: IoStatsChart, label: "Previous Rank", value: "#88", change: 2 },
  ];

  const top5Users = [
    {
      id: 1,
      name: "Aakash Kumar",
      points: 892,
      avatar: "https://placehold.co/32x32",
    },
    {
      id: 2,
      name: "Sanjana Jaldu",
      points: 845,
      avatar: "https://placehold.co/32x32",
    },
    {
      id: 3,
      name: "Rachit Dhaka",
      points: 812,
      avatar: "https://placehold.co/32x32",
    },
    {
      id: 4,
      name: "Shamirul",
      points: 798,
      avatar: "https://placehold.co/32x32",
    },
    {
      id: 5,
      name: "Jeyasurya",
      points: 756,
      avatar: "https://placehold.co/32x32",
    },
  ];

  // ================ Dashboard Handlers ================
  const handleToggleNotifications = () => {
    setShowConfirmation(true);
  };

  const confirmToggle = () => {
    setNotificationsEnabled(!notificationsEnabled);
    ToastMsg(
      `Notifications ${!notificationsEnabled ? "enabled" : "disabled"}!`,
      !notificationsEnabled ? "success" : "info"
    );
  };
  //================ Dashboard Handlers END ================

  return (
    <div className="min-h-screen pb-8">
      <ConfirmationPopup
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={confirmToggle}
        type={notificationsEnabled ? "info" : "success"}
        title={
          notificationsEnabled
            ? "Disable Notifications?"
            : "Enable Notifications?"
        }
        message={
          notificationsEnabled
            ? "You won't receive any notifications about updates and events. Are you sure?"
            : "You'll start receiving notifications about updates and events. Continue?"
        }
        confirmText={notificationsEnabled ? "Disable" : "Enable"}
      />

      <DashboardHeader
        name="Surya"
        notificationsEnabled={notificationsEnabled}
        onToggleNotifications={handleToggleNotifications}
      />

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-6">
          <StatsSection stats={stats} />
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <CustomCalendar events={events} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <LeaderboardSection top5Users={top5Users} />
          <NotificationsSection
            title="Recent Updates"
            notifications={notifications}
          />
          <NotificationsSection
            title="Announcements"
            notifications={notifications}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
