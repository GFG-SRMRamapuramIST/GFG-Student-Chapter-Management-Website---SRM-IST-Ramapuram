import React, { useState } from "react";
import { FaChevronRight, FaExternalLinkAlt } from "react-icons/fa";
import { CgCode, CgTrophy } from "react-icons/cg";
import { BiError } from "react-icons/bi";
import { MdCalendarMonth } from "react-icons/md";

import { platformIcons } from "../../Constants";
import { RotatingCloseButton } from "../../Utilities";
import NotificationsSection from "../Dashboard/NotificationsSection";

const CustomDialog = ({ open, onClose, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-lg w-full max-w-3xl mx-4 my-6 max-h-[80vh] overflow-y-auto">
        <div className="absolute right-3 sm:right-4 top-3 sm:top-4">
          <RotatingCloseButton onClick={onClose} />
        </div>
        <div className="p-4 sm:p-6 md:p-8">{children}</div>
      </div>
    </div>
  );
};

const Badge = ({ type, name }) => (
  <div className="relative group">
    <div
      className={`
      w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center
      ${
        type === "gold"
          ? "bg-gradient-to-br from-yellow-200 to-yellow-500"
          : type === "silver"
          ? "bg-gradient-to-br from-gray-200 to-gray-400"
          : "bg-gradient-to-br from-amber-400 to-amber-800"
      }
      shadow-lg group-hover:scale-105 transform transition-all duration-300
    `}
    >
      <div
        className={`
        w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
        ${
          type === "gold"
            ? "bg-yellow-100"
            : type === "silver"
            ? "bg-gray-100"
            : "bg-amber-200"
        }
        shadow-inner
      `}
      >
        <div
          className={`
          text-xs sm:text-sm font-bold
          ${
            type === "gold"
              ? "text-yellow-600"
              : type === "silver"
              ? "text-gray-600"
              : "text-amber-900"
          }
        `}
        >
          {name.slice(0, 2).toUpperCase()}
        </div>
      </div>
    </div>
    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-10 sm:w-12 h-2 bg-gradient-to-t from-white via-white to-transparent z-10" />
  </div>
);

const ProfileSecondary = ({ userProfile }) => {
  const [showBadges, setShowBadges] = useState(false);

  return (
    <div className="p-3 sm:p-4 md:p-6 font-sans antialiased">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Platform Profiles - Takes up full width on mobile, 50% on md, 33% on lg */}
        <div className="lg:col-span-1">
          <PlatformProfiles userProfile={userProfile} />
        </div>

        {/* Middle column for Heatmap and small Achievements on lg screens */}
        <div className="lg:col-span-1">
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            {/* Heatmap */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="pt-3 sm:pt-4 px-3 sm:px-4">
                <h2 className="flex justify-between text-base sm:text-lg font-semibold text-gfgsc-green items-center">
                  <span>Contribution Activity</span>
                  <MdCalendarMonth className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </h2>
              </div>
              <div className="p-3 sm:p-4">
                {/* <ProfileHeatmap /> */}
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi in non alias natus. Placeat minus vitae exercitationem consequatur similique. Sapiente.
                
              </div>
            </div>

            {/* Compact Achievements */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="pt-3 px-3 sm:pt-4 sm:px-4">
                <h2 className="flex justify-between text-base sm:text-lg font-semibold text-gfgsc-green items-center">
                  <span>Achievements</span>
                  <CgTrophy className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </h2>
              </div>

              <div className="p-3 sm:p-4">
                {userProfile.badges.length === 0 ? (
                  <div className="flex flex-col text-center items-center justify-center p-2 sm:p-4">
                    <BiError className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                    <p className="mt-2 text-xs sm:text-sm text-gray-500">
                      No achievements yet. Keep trying harder!
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-center gap-2 sm:gap-3">
                      {userProfile.badges.slice(0, 3).map((badge) => (
                        <div key={badge.id} className="flex flex-col items-center">
                          <Badge type={badge.type} name={badge.name} />
                          <div className="mt-1 text-xxxs sm:text-xxs font-medium text-center truncate w-full">
                            {badge.name}
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => setShowBadges(true)}
                      className="w-full mt-2 py-1 sm:py-1.5 px-2 sm:px-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors text-xxs sm:text-xs font-medium flex items-center justify-center"
                    >
                      <span>View all</span>
                      <FaChevronRight className="w-2 h-2 sm:w-2.5 sm:h-2.5 ml-1" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Announcements - 33% on large screens */}
        <div className="lg:col-span-1">
          <NotificationsSection />
        </div>
      </div>

      <CustomDialog open={showBadges} onClose={() => setShowBadges(false)}>
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-8">
          All Achievements
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {userProfile.badges.map((badge) => (
            <div
              key={badge.id}
              className="flex flex-col items-center text-center"
            >
              <Badge type={badge.type} name={badge.name} />
              <div className="mt-3 sm:mt-4 space-y-1">
                <div className="font-medium text-sm sm:text-base">
                  {badge.name}
                </div>
                <div className="text-xs sm:text-sm text-gray-500">
                  {badge.date}
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
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
      url: (handle) => `https://leetcode.com/${handle}`,
    },
    codechef: {
      iconColor: "text-[#5B4638]",
      borderHover: "hover:border-[#5B4638]",
      shadow: "hover:shadow-[#5B4638]/10",
      statsBg: "bg-[#5B4638]/5",
      link: "text-[#5B4638]",
      url: (handle) => `https://www.codechef.com/users/${handle}`,
    },
    codeforces: {
      iconColor: "text-[#318CE7]",
      borderHover: "hover:border-[#318CE7]",
      shadow: "hover:shadow-[#318CE7]/10",
      statsBg: "bg-[#318CE7]/5",
      link: "text-[#318CE7]",
      url: (handle) => `https://codeforces.com/profile/${handle}`,
    },
    geeksforgeeks: {
      iconColor: "text-[#2F8D46]",
      borderHover: "hover:border-[#2F8D46]",
      shadow: "hover:shadow-[#2F8D46]/10",
      statsBg: "bg-[#2F8D46]/5",
      link: "text-[#2F8D46]",
      url: (handle) => `https://geeksforgeeks.org/user/${handle}`,
    },
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden h-full">
      <div className="pt-3 sm:pt-4 px-3 sm:px-4">
        <h2 className="flex justify-between text-base sm:text-lg font-semibold text-gfgsc-green items-center">
          <span>Platform Activity</span>
          <CgCode className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
        </h2>
      </div>
      <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
        {Object.entries(userProfile.profiles).map(([platform, stats]) => {
          const style = platformStyles[platform];

          return (
            <div
              key={platform}
              className={`group relative bg-white border-2 p-2 sm:p-3 rounded-lg transition-all duration-300 
                ${style.borderHover} ${style.shadow} hover:shadow-lg`}
            >
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <span className="text-xs sm:text-sm font-medium capitalize flex items-center gap-1 sm:gap-2 flex-wrap">
                  {React.createElement(platformIcons[platform], {
                    className: `w-4 h-4 sm:w-5 sm:h-5 ${style.iconColor}`,
                  })}
                  <span>{platform}</span>
                  <span className="text-xxs sm:text-xs text-gray-500 lowercase">
                    @{stats.handle || "N/A"}
                  </span>
                </span>
                <a
                  href={style.url(stats.handle)}
                  target="_blank"
                  className={`${style.link} opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110`}
                >
                  <FaExternalLinkAlt className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                </a>
              </div>
              <div className="flex flex-wrap gap-1 sm:gap-2 text-xxs sm:text-xs">
                {/* LeetCode specific fields */}
                {platform === "leetcode" && (
                  <>
                    <div
                      className={`flex items-center border rounded-md ${style.statsBg} p-1 sm:p-1.5 transition-colors duration-300`}
                    >
                      <div className="font-semibold">{stats.badgesCount}</div>
                      <div className="text-gray-500 text-xxxs sm:text-xxs ml-1">
                        Badges
                      </div>
                    </div>
                    <div
                      className={`flex items-center border rounded-md ${style.statsBg} p-1 sm:p-1.5 transition-colors duration-300`}
                    >
                      <div className="font-semibold">{stats.ranking}</div>
                      <div className="text-gray-500 text-xxxs sm:text-xxs ml-1">
                        Ranking
                      </div>
                    </div>
                    <div
                      className={`flex items-center border rounded-md ${style.statsBg} p-1 sm:p-1.5 transition-colors duration-300`}
                    >
                      <div className="font-semibold">
                        {stats.totalProblemSolved}
                      </div>
                      <div className="text-gray-500 text-xxxs sm:text-xxs ml-1">
                        Problems
                      </div>
                    </div>
                  </>
                )}

                {/* CodeChef specific fields */}
                {platform === "codechef" && (
                  <>
                    <div
                      className={`flex items-center border rounded-md ${style.statsBg} p-1 sm:p-1.5 transition-colors duration-300`}
                    >
                      <div className="font-semibold">{stats.rating}</div>
                      <div className="text-gray-500 text-xxxs sm:text-xxs ml-1">
                        Rating
                      </div>
                    </div>
                    <div
                      className={`flex items-center border rounded-md ${style.statsBg} p-1 sm:p-1.5 transition-colors duration-300`}
                    >
                      <div className="font-semibold">{stats.highestRating}</div>
                      <div className="text-gray-500 text-xxxs sm:text-xxs ml-1">
                        Highest
                      </div>
                    </div>
                    <div
                      className={`flex items-center border rounded-md ${style.statsBg} p-1 sm:p-1.5 transition-colors duration-300`}
                    >
                      <div className="font-semibold">{stats.countryRank}</div>
                      <div className="text-gray-500 text-xxxs sm:text-xxs ml-1">
                        Rank
                      </div>
                    </div>
                  </>
                )}

                {/* Codeforces specific fields */}
                {platform === "codeforces" && (
                  <>
                    <div
                      className={`flex items-center border rounded-md ${style.statsBg} p-1 sm:p-1.5 transition-colors duration-300`}
                    >
                      <div className="font-semibold">{stats.rating}</div>
                      <div className="text-gray-500 text-xxxs sm:text-xxs ml-1">
                        Rating
                      </div>
                    </div>
                    <div
                      className={`flex items-center border rounded-md ${style.statsBg} p-1 sm:p-1.5 transition-colors duration-300`}
                    >
                      <div className="font-semibold">{stats.rank}</div>
                      <div className="text-gray-500 text-xxxs sm:text-xxs ml-1">
                        Rank
                      </div>
                    </div>
                    <div
                      className={`flex items-center border rounded-md ${style.statsBg} p-1 sm:p-1.5 transition-colors duration-300`}
                    >
                      <div className="font-semibold">
                        {stats.totalProblemSolved}
                      </div>
                      <div className="text-gray-500 text-xxxs sm:text-xxs ml-1">
                        Problems
                      </div>
                    </div>
                  </>
                )}

                {/* GeeksforGeeks specific fields */}
                {platform === "geeksforgeeks" && (
                  <>
                    <div
                      className={`flex items-center border rounded-md ${style.statsBg} p-1 sm:p-1.5 transition-colors duration-300`}
                    >
                      <div className="font-semibold">
                        {stats.universityRank}
                      </div>
                      <div className="text-gray-500 text-xxs sm:text-xs ml-1">
                        University Rank
                      </div>
                    </div>
                    <div
                      className={`flex items-center border rounded-md ${style.statsBg} p-1 sm:p-1.5 transition-colors duration-300`}
                    >
                      <div className="font-semibold">{stats.codingScore}</div>
                      <div className="text-gray-500 text-xxs sm:text-xs ml-1">
                        Coding Score
                      </div>
                    </div>
                    <div
                      className={`flex items-center border rounded-md ${style.statsBg} p-1 sm:p-1.5 transition-colors duration-300`}
                    >
                      <div className="font-semibold">
                        {stats.problemsSolved}
                      </div>
                      <div className="text-gray-500 text-xxs sm:text-xs ml-1">
                        Problem Solved
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="absolute bottom-1 right-1 bg-gray-800 text-white text-xxxs sm:text-xxs px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Updated weekly
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileSecondary;