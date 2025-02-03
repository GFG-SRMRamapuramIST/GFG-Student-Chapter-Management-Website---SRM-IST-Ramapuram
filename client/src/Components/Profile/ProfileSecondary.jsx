import React, { useState } from "react";
import { FaTimes, FaChevronRight, FaExternalLinkAlt } from "react-icons/fa";
import { platformIcons } from "../../Constants";
import { CgBell, CgCode, CgTrophy } from "react-icons/cg";
import NotificationItem from "../ui/NotificationItem";

const CustomDialog = ({ open, onClose, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-lg max-w-3xl w-full m-4 max-h-[80vh] overflow-y-auto">
        <div className="absolute right-4 top-4">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
};

const Badge = ({ type, name }) => (
  <div className="relative group">
    <div
      className={`
      w-20 h-20 rounded-full flex items-center justify-center
      ${
        type === "gold"
          ? "bg-gradient-to-br from-yellow-200 to-yellow-500"
          : type === "silver"
          ? "bg-gradient-to-br from-gray-200 to-gray-400"
          : "bg-gradient-to-br from-amber-200 to-amber-600"
      }
      shadow-lg group-hover:scale-105 transform transition-all duration-300
    `}
    >
      <div
        className={`
        w-16 h-16 rounded-full flex items-center justify-center
        ${
          type === "gold"
            ? "bg-yellow-100"
            : type === "silver"
            ? "bg-gray-100"
            : "bg-amber-100"
        }
        shadow-inner
      `}
      >
        <div
          className={`
          text-2xl font-bold
          ${
            type === "gold"
              ? "text-yellow-600"
              : type === "silver"
              ? "text-gray-600"
              : "text-amber-700"
          }
        `}
        >
          {name.slice(0, 2).toUpperCase()}
        </div>
      </div>
    </div>
    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-gradient-to-t from-white via-white to-transparent z-10" />
  </div>
);

const ProfileSecondary = ({ userProfile, updatesAndAnnouncements }) => {
  const [showBadges, setShowBadges] = useState(false);

  return (
    <div className="p-6 font-sans antialiased">
      <div className="grid grid-cols-3 gap-6">
        {/* Platform Profiles */}
        <PlatformProfiles userProfile={userProfile} />

        {/* Achievements */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="pt-4 px-4">
            <h2 className="flex justify-between text-lg font-semibold text-gfgsc-green items-center space-x-2">
              <span>Acheivements</span>
              <CgTrophy className="w-5 h-5" />
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-6 mb-6">
              {userProfile.badges.slice(0, 4).map((badge) => (
                <div key={badge.id} className="flex flex-col items-center">
                  <Badge type={badge.type} name={badge.name} />
                  <div className="mt-2 text-sm font-medium text-center">
                    {badge.name}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowBadges(true)}
              className="w-full py-2 px-4 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors text-sm font-medium flex items-center justify-center space-x-1"
            >
              <span>View all achievements</span>
              <FaChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Updates & Announcements */}
        <div className="space-y-6">
          {/* Recent Updates */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="pt-4 px-4">
              <h2 className="flex justify-between text-lg font-semibold text-gfgsc-green items-center space-x-2">
                <span>Recent Updates</span>
                <CgBell className="w-5 h-5" />
              </h2>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                {updatesAndAnnouncements.updates.map((update) => (
                  <NotificationItem key={update.id} message={update.message} />
                ))}
              </div>
            </div>
          </div>

          {/* Announcements */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="pt-4 px-4">
              <h2 className="flex justify-between text-lg font-semibold text-gfgsc-green items-center space-x-2">
                <span>Announcements</span>
                <CgBell className="w-5 h-5" />
              </h2>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                {updatesAndAnnouncements.announcements.map((announcement) => (
                  <NotificationItem
                    key={announcement.id}
                    message={announcement.title}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <CustomDialog open={showBadges} onClose={() => setShowBadges(false)}>
        <h2 className="text-2xl font-semibold mb-8">All Achievements</h2>
        <div className="grid grid-cols-3 gap-8">
          {userProfile.badges.map((badge) => (
            <div
              key={badge.id}
              className="flex flex-col items-center text-center"
            >
              <Badge type={badge.type} name={badge.name} />
              <div className="mt-4 space-y-1">
                <div className="font-medium">{badge.name}</div>
                <div className="text-sm text-gray-500">{badge.date}</div>
                <p className="text-sm text-gray-600 mt-2">
                  {badge.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CustomDialog>
    </div>
  );
};

const PlatformProfiles = ({ userProfile }) => {
  // Platform-specific color schemes
  const platformStyles = {
    leetcode: {
      iconColor: "text-[#FFA116]",
      borderHover: "hover:border-[#FFA116]",
      shadow: "hover:shadow-[#FFA116]/10",
      statsBg: "bg-[#FFA116]/5",
      link: "text-[#FFA116]",
    },
    codechef: {
      iconColor: "text-[#5B4638]",
      borderHover: "hover:border-[#5B4638]",
      shadow: "hover:shadow-[#5B4638]/10",
      statsBg: "bg-[#5B4638]/5",
      link: "text-[#5B4638]",
    },
    codeforces: {
      iconColor: "text-[#318CE7]",
      borderHover: "hover:border-[#318CE7]",
      shadow: "hover:shadow-[#318CE7]/10",
      statsBg: "bg-[#318CE7]/5",
      link: "text-[#318CE7]",
    },
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="pt-4 px-4">
        <h2 className="flex justify-between text-lg font-semibold text-gfgsc-green items-center space-x-2">
          <span>Platform Activity</span>
          <CgCode className="w-5 h-5" />
        </h2>
      </div>
      <div className="p-6 space-y-6">
        {Object.entries(userProfile.profiles).map(([platform, stats]) => {
          const style = platformStyles[platform] || {};

          return (
            <div
              key={platform}
              className={`group bg-white border-2 p-4 rounded-lg transition-all duration-300 
                ${style.borderHover} ${style.shadow} hover:shadow-lg`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium capitalize flex items-center space-x-2">
                  {React.createElement(platformIcons[platform], {
                    className: `w-5 h-5 ${style.iconColor}`,
                  })}
                  <span>{platform}</span>
                  <span className="text-xs text-gray-500 lowercase">
                    @{stats.handle}
                  </span>
                </span>
                <a
                  href="#"
                  className={`${style.link} opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110`}
                >
                  <FaExternalLinkAlt className="w-3 h-3" />
                </a>
              </div>
              <div className="flex gap-2 text-sm">
                <div
                  className={`flex items-center border rounded-md ${style.statsBg} p-2 transition-colors duration-300`}
                >
                  <div className="font-semibold">{stats.contests}</div>
                  <div className="text-gray-500 text-xs ml-1">Contests</div>
                </div>
                <div
                  className={`flex items-center border rounded-md ${style.statsBg} p-2 transition-colors duration-300`}
                >
                  <div className="font-semibold">{stats.questions}</div>
                  <div className="text-gray-500 text-xs ml-1">Questions</div>
                </div>
                {stats.rating && (
                  <div
                    className={`flex items-center border rounded-md ${style.statsBg} p-2 transition-colors duration-300`}
                  >
                    <div className="font-semibold">{stats.rating}</div>
                    <div className="text-gray-500 text-xs ml-1">Rating</div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileSecondary;
