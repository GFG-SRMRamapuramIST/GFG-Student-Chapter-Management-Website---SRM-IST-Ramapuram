import ReactGA from "react-ga4";
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
  PlatformPOTDs,
  StatsSection,
} from "../Components";
import { ConfirmationPopup, ToastMsg } from "../Utilities";

import { UserServices, CoreMemberServices } from "../Services";

const Dashboard = () => {
  // Google Analytics tracking
  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: "gfgsrm-tech.vercel.app/dashboard",
      title: "Dashboard Page",
    });
  }, []);

  const {
    toggleSubscribeFunction,
    getProfilePageDataFunction,
    fetchTop5UsersFunction,
    fetchPOTDFunction,
  } = UserServices();

  const { getDashboardCalenderDataFunction } = CoreMemberServices();

  const [stats, setStats] = useState([
    { icon: MdTrendingUp, label: "Points", value: "0", change: 0 },
    { icon: MdEmojiEvents, label: "Current Rank", value: "#0", change: 0 },
    { icon: IoStatsChart, label: "Previous Rank", value: "#0", change: 0 },
  ]);
  const [firstName, setFirstName] = useState(null);

  const [top5Users, setTop5Users] = useState([]);

  const [platformPOTDs, setPlatformPOTDs] = useState([]);

  const [events, setEvents] = useState([]);

  const [notificationsEnabled, setNotificationsEnabled] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // ================ Dashboard Handlers ================

  // Get dashboard calender data
  const fetchDashBoardCalenderData = async () => {
    try {
      const response = await getDashboardCalenderDataFunction();
      console.log(response.data);
      //console.log(response.data);
      if (response.status === 200) {
        const transformedEvents = [];

        // Transform contests data
        response.data.contests.forEach((contestDay) => {
          contestDay.contests.forEach((contest) => {
            transformedEvents.push({
              type: "contest",
              platform: contest.platform.toLowerCase(),
              name: contest.contestName,
              start_time:
                contest.startTime.endsWith("Z") ||
                contest.startTime.endsWith("z")
                  ? contest.startTime.slice(0, -1)
                  : contest.startTime,
              end_time:
                contest.endTime.endsWith("Z") || contest.endTime.endsWith("z")
                  ? contest.endTime.slice(0, -1)
                  : contest.endTime,
              link: contest.contestLink,
              eventId: contest._id, // Store contest ID
              dateId: contestDay._id, // Store date ID
            });
          });
        });

        // Transform meetings data
        response.data.meetings.forEach((meetingDay) => {
          meetingDay.notices.forEach((meeting) => {
            const formattedStartTime = `${
              meetingDay.meetingDate.split("T")[0]
            }T${meeting.meetingTime}.000`;

            transformedEvents.push({
              type: "meeting",
              platform: "meeting",
              name: meeting.title,
              description: meeting.description,
              start_time: formattedStartTime,
              link: meeting.meetingLink,
              compulsory: meeting.compulsory,
              mom: meeting.MoMLink,
              eventId: meeting._id, // Store meeting ID
              dateId: meetingDay._id, // Store date ID
            });
          });
        });

        setEvents(transformedEvents);
        //console.log(transformedEvents);
      } else {
        ToastMsg("Failed to load dashboard calendar data", "error");
      }
    } catch (error) {
      console.log("Error fetching dashboard calendar data:", error);
      ToastMsg("Failed to load dashboard calendar data", "error");
    }
  };

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
              value: userData.totalQuestionSolved || "0",
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
              value: `#${userData.prevMonthData.prevRank || "0"}`,
              change: 0,
            },
          ]);
        } else {
          setFirstName("User");
          ToastMsg(response.response.data.message, "error");
        }
      } catch (error) {
        console.log("Error fetching user data:", error);
        ToastMsg("Failed to load user data", "error");
      }
    };

    const fetchTop5Users = async () => {
      try {
        const response = await fetchTop5UsersFunction();
        if (response.status === 200) {
          setTop5Users(response.data.data);
        } else {
          ToastMsg(response.response.data.message, "error");
        }
      } catch (error) {
        console.log("Error fetching top 5 users:", error);
        ToastMsg("Failed to load top 5 users", "error");
      }
    };

    const fetchPOTD = async () => {
      try {
        const response = await fetchPOTDFunction();
        if (response.status === 200) {
          const data = response.data.data;
          const formattedPOTDs = [];

          if (data.leetcode) {
            formattedPOTDs.push({
              platform: "LeetCode",
              title: data.leetcode.problemName,
              difficulty: data.leetcode.difficulty,
              accuracy: data.leetcode.accuracy,
              tags: data.leetcode.topics,
              url: data.leetcode.problemLink,
            });
          }

          if (data.geeksforgeeks) {
            formattedPOTDs.push({
              platform: "GeeksForGeeks",
              title: data.geeksforgeeks.problemName,
              difficulty: data.geeksforgeeks.difficulty,
              accuracy: data.geeksforgeeks.accuracy,
              tags: data.geeksforgeeks.topics,
              url: data.geeksforgeeks.problemLink,
            });
          }

          setPlatformPOTDs(formattedPOTDs);
        } else {
          setPlatformPOTDs([]);
          ToastMsg(response.response.data.message, "error");
        }
      } catch (error) {
        console.log("Error fetching POTD:", error);
        ToastMsg("Failed to fetch POTD", "error");
      }
    };

    fetchUserData();
    fetchTop5Users();
    fetchPOTD();
    fetchDashBoardCalenderData();
  }, []);

  // Notifications toggle handler
  const handleToggleNotifications = () => {
    setShowConfirmation(true);
  };
  // Notifications toggle confirmation handler with API call
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
          <PlatformPOTDs problems={platformPOTDs} />
          <CustomCalendar
            events={events}
            fetchDashBoardCalenderData={fetchDashBoardCalenderData}
          />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <StatsSection stats={stats} />
          <LeaderboardSection top5Users={top5Users} />
          <NotificationsSection isCarousel={false} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
