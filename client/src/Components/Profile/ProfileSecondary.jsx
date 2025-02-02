import React, { useState } from "react";
import { FaTimes, FaChevronRight, FaExternalLinkAlt } from "react-icons/fa";
import { platformIcons } from "../../Constants";
import { CgBell, CgCode, CgTrophy } from "react-icons/cg";

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
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-4">
            <h2 className="text-lg font-semibold text-white flex items-center space-x-2">
              <CgCode className="w-5 h-5" />
              <span>Platform Activity</span>
            </h2>
          </div>
          <div className="p-6 space-y-6">
            {Object.entries(userProfile.profiles).map(([platform, stats]) => (
              <div
                key={platform}
                className="group bg-white shadow-md border-2 p-4 rounded-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium capitalize flex items-center space-x-2">
                    {React.createElement(platformIcons[platform], {
                      className: "w-5 h-5 text-emerald-600",
                    })}
                    <span>{platform}</span>
                    <span className="text-xs text-gray-500 lowercase">
                      @{stats.handle}
                    </span>
                  </span>
                  <a
                    href="#"
                    className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FaExternalLinkAlt className="w-3 h-3" />
                  </a>
                </div>
                <div className="flex gap-2 text-sm">
                  <div className="flex items-center border-2 space-x-1 bg-gray-50 p-2 rounded-md shadow-sm">
                    <div className="font-semibold">{stats.contests}</div>
                    <div className="text-gray-500 text-xs">Contests</div>
                  </div>
                  <div className="flex items-center border-2 space-x-1 bg-gray-50 p-2 rounded-md shadow-sm">
                    <div className="font-semibold">{stats.questions}</div>
                    <div className="text-gray-500 text-xs">Questions</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-4">
            <h2 className="text-lg font-semibold text-white flex items-center space-x-2">
              <CgTrophy className="w-5 h-5" />
              <span>Acheivements</span>
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
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-4">
              <h2 className="text-lg font-semibold text-white flex items-center space-x-2">
                <CgBell className="w-5 h-5" />
                <span>Recent Updates</span>
              </h2>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                {updatesAndAnnouncements.updates.map((update) => (
                  <div
                    key={update.id}
                    className="group hover:bg-gray-50 px-3 py-2 rounded-xl transition-colors"
                  >
                    <p className="text-sm text-gray-600">{update.message}</p>
                    <span className="text-xs text-emerald-400 font-medium">
                      {update.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Announcements */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-4">
              <h2 className="text-lg font-semibold text-white flex items-center space-x-2">
                <CgBell className="w-5 h-5" />
                <span>Announcements</span>
              </h2>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                {updatesAndAnnouncements.announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="group hover:bg-gray-50 px-3 py-2 rounded-xl transition-colors"
                  >
                    <p className="text-sm font-medium text-gray-900 transition-colors">
                      {announcement.title}
                    </p>
                    <p className="text-xs text-emerald-400 font-medium mt-1">
                      {announcement.date}
                    </p>
                  </div>
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

export default ProfileSecondary;
