import { useEffect, useState } from "react";

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

import { UserServices } from "../Services";

const Dashboard = () => {
  const { toggleSubscribeFunction, getProfilePageDataFunction } =
    UserServices();

  const [stats, setStats] = useState([
    { icon: MdTrendingUp, label: "Points", value: "0", change: 0 },
    { icon: MdEmojiEvents, label: "Current Rank", value: "#0", change: 0 },
    { icon: IoStatsChart, label: "Previous Rank", value: "#0", change: 0 },
  ]);
  const [firstName, setFirstName] = useState("User");

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

  // Get basic user data on page load
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getProfilePageDataFunction();
        if (response.status === 200) {
          const userData = response.data;

          // Extract first name correctly
          const extractFirstName = (fullName) => {
            const nameParts = fullName.replace(/\./g, "").split(" "); // Remove dots and split
            for (let part of nameParts) {
              if (part.length > 1) return part; // Return first element with more than 1 character
            }
            return "User"; // Default fallback
          };

          setFirstName(extractFirstName(userData.name));

          // Update notifications status
          setNotificationsEnabled(!userData.subscribed);

          // Update stats
          setStats([
            {
              icon: MdTrendingUp,
              label: "Points",
              value: userData.points || "0",
              change: 0,
            },
            {
              icon: MdEmojiEvents,
              label: "Current Rank",
              value: `#${userData.currentRank || "0"}`,
              change: 0,
            },
            {
              icon: IoStatsChart,
              label: "Previous Rank",
              value: `#${userData.previousRank || "0"}`,
              change: 0,
            },
          ]);
        } else {
          ToastMsg(response.response.data.message, "error");
        }
      } catch (error) {
        console.log("Error fetching user data:", error);
        ToastMsg("Failed to load user data", "error");
      }
    };

    fetchUserData();
  }, []);

  const handleToggleNotifications = () => {
    setShowConfirmation(true);
  };

  const confirmToggle = async () => {
    try {
      const response = await toggleSubscribeFunction();
      //console.log(response);
      if (response.status == 200) {
        setNotificationsEnabled(!notificationsEnabled);
        ToastMsg(response.data.message, "success");
      } else {
        console.log("Error: ", response.response.data.message);
        ToastMsg(response.response.data.message, "error");
      }
    } catch (error) {
      console.log("Internal server error: ", error);
      ToastMsg("Internal server error! Please try later", "error");
    }
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
        name={firstName}
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
