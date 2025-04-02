import React, { useState } from "react";

// Importing icons
import { FaChevronRight, FaExternalLinkAlt } from "react-icons/fa";
import { CgCode, CgTrophy } from "react-icons/cg";
import { BiError } from "react-icons/bi";

import { platformIcons } from "../../Constants";
import NotificationsSection from "../Dashboard/NotificationsSection";
import MonthlyActivityHeatmap from "./MonthlyActivityHeatmap";
import Medal from "../ui/Medal";
import CustomDialog from "../ui/CustomDialog";
import { RiVerifiedBadgeFill } from "react-icons/ri";

const ProfileSecondary = ({ userProfile }) => {
  const [showBadges, setShowBadges] = useState(false);

  return (
    <div className="p-3 sm:p-4 md:p-6 font-sans antialiased">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Platform Profiles - Takes up full width on mobile, 50% on md, 33% on lg */}
        <div className="lg:col-span-1 h-full">
          <PlatformProfiles platformProfiles={userProfile.profiles} />
        </div>

        {/* Middle column for Heatmap */}
        <div className="lg:col-span-1 h-full">
          {/* Heatmap */}
          <MonthlyActivityHeatmap
            avgPerDay={userProfile.avgPerDay}
            maxStreak={userProfile.maxStreak}
            dailyActivity={userProfile.dailyActivity}
          />
        </div>

        {/* Announcements - 33% on large screens */}
        <div className="grid lg:col-span-1 gap-4 lg:gap-6 h-full">
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
                  <div className="flex justify-evenly py-2 gap-2 sm:gap-3">
                    {userProfile.badges.slice(0, 3).map((badge) => (
                      <div
                        key={badge.id}
                        className="flex flex-col items-center"
                      >
                        <Medal
                          type={badge.type}
                          content={badge.name}
                          size="medium"
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowBadges(true)}
                    className="w-full mt-2 py-2 sm:py-3 px-2 sm:px-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors text-xs sm:text-sm font-medium flex items-center justify-center"
                  >
                    <span>View all</span>
                    <FaChevronRight className="w-2 h-2 sm:w-2.5 sm:h-2.5 ml-1" />
                  </button>
                </>
              )}
            </div>
          </div>
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
              <Medal
                type={badge.type}
                content={badge.name}
                size="large"
                labelClassName="mt-3 sm:mt-4 font-medium text-sm sm:text-base"
              />
              <div className="mt-3 sm:mt-4 space-y-1">
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

const PlatformProfiles = ({ platformProfiles }) => {
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
        {Object.entries(platformProfiles).map(([platform, stats]) => {
          const style = platformStyles[platform];

          return (
            <div
              key={platform}
              className={`group relative bg-white border-2 p-2 sm:p-3 rounded-lg transition-all duration-300 
                ${style.borderHover} ${style.shadow} hover:shadow-lg`}
            >
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <span className="text-sm sm:text-md font-medium capitalize flex items-center gap-1 sm:gap-2 flex-wrap">
                  <span>
                    {React.createElement(platformIcons[platform], {
                      className: `w-4 h-4 sm:w-5 sm:h-5 ${style.iconColor}`,
                    })}
                  </span>

                  <span>{platform}</span>
                  <span className="text-xs sm:text-sm text-gray-500 lowercase">
                    @{stats.handle || "N/A"}
                  </span>
                  {stats.verified && (
                    <RiVerifiedBadgeFill className="text-green-500" />
                  )}
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
                      <div className="font-semibold text-sm">
                        {stats.badgesCount}
                      </div>
                      <div className="text-gray-500 text-xs ml-1">Badges</div>
                    </div>
                    <div
                      className={`flex items-center border rounded-md ${style.statsBg} p-1 sm:p-1.5 transition-colors duration-300`}
                    >
                      <div className="font-semibold text-sm">
                        {stats.ranking}
                      </div>
                      <div className="text-gray-500 text-xs ml-1">Ranking</div>
                    </div>
                    <div
                      className={`flex items-center border rounded-md ${style.statsBg} p-1 sm:p-1.5 transition-colors duration-300`}
                    >
                      <div className="font-semibold text-sm">
                        {stats.totalProblemSolved}
                      </div>
                      <div className="text-gray-500 text-xs ml-1">Problems</div>
                    </div>
                  </>
                )}

                {/* CodeChef specific fields */}
                {platform === "codechef" && (
                  <>
                    <div
                      className={`flex items-center border rounded-md ${style.statsBg} p-1 sm:p-1.5 transition-colors duration-300`}
                    >
                      <div className="font-semibold text-sm">
                        {stats.rating}
                      </div>
                      <div className="text-gray-500 text-xs ml-1">Rating</div>
                    </div>
                    <div
                      className={`flex items-center border rounded-md ${style.statsBg} p-1 sm:p-1.5 transition-colors duration-300`}
                    >
                      <div className="font-semibold text-sm">
                        {stats.highestRating}
                      </div>
                      <div className="text-gray-500 text-xs ml-1">Highest</div>
                    </div>
                    <div
                      className={`flex items-center border rounded-md ${style.statsBg} p-1 sm:p-1.5 transition-colors duration-300`}
                    >
                      <div className="font-semibold text-sm">
                        {stats.countryRank}
                      </div>
                      <div className="text-gray-500 text-xs ml-1">Rank</div>
                    </div>
                  </>
                )}

                {/* Codeforces specific fields */}
                {platform === "codeforces" && (
                  <>
                    <div
                      className={`flex items-center border rounded-md ${style.statsBg} p-1 sm:p-1.5 transition-colors duration-300`}
                    >
                      <div className="font-semibold text-sm">
                        {stats.rating}
                      </div>
                      <div className="text-gray-500 text-xs ml-1">Rating</div>
                    </div>
                    <div
                      className={`flex items-center border rounded-md ${style.statsBg} p-1 sm:p-1.5 transition-colors duration-300`}
                    >
                      <div className="font-semibold text-sm">{stats.rank}</div>
                      <div className="text-gray-500 text-xs ml-1">Rank</div>
                    </div>
                    <div
                      className={`flex items-center border rounded-md ${style.statsBg} p-1 sm:p-1.5 transition-colors duration-300`}
                    >
                      <div className="font-semibold text-sm">
                        {stats.totalProblemSolved}
                      </div>
                      <div className="text-gray-500 text-xs ml-1">Problems</div>
                    </div>
                  </>
                )}

                {/* GeeksforGeeks specific fields */}
                {platform === "geeksforgeeks" && (
                  <>
                    <div
                      className={`flex items-center border rounded-md ${style.statsBg} p-1 sm:p-1.5 transition-colors duration-300`}
                    >
                      <div className="font-semibold text-sm">
                        {stats.universityRank}
                      </div>
                      <div className="text-gray-500 text-xs ml-1">
                        University Rank
                      </div>
                    </div>
                    <div
                      className={`flex items-center border rounded-md ${style.statsBg} p-1 sm:p-1.5 transition-colors duration-300`}
                    >
                      <div className="font-semibold text-sm">
                        {stats.codingScore}
                      </div>
                      <div className="text-gray-500 text-xs ml-1">
                        Coding Score
                      </div>
                    </div>
                    <div
                      className={`flex items-center border rounded-md ${style.statsBg} p-1 sm:p-1.5 transition-colors duration-300`}
                    >
                      <div className="font-semibold text-sm">
                        {stats.problemsSolved}
                      </div>
                      <div className="text-gray-500 text-xs ml-1">
                        Problem Solved
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="absolute bottom-1 right-1 bg-gray-800 text-white text-xxxs sm:text-xxs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {stats.verified ? (
                  platform === "leetcode" || platform === "geeksforgeeks" ? (
                    <span>Updated Daily</span>
                  ) : (
                    <span>Updated Weekly</span>
                  )
                ) : (
                  <span className="text-red-400">Verify at Edit Profile</span>
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
