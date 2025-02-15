import React, { useState } from "react";
import { FaLinkedin } from "react-icons/fa";
import { platformIcons } from "../../Constants";
import { CgCode, CgTrophy } from "react-icons/cg";
import { IoMailOutline, IoPeopleOutline } from "react-icons/io5";
import { codolioIcon } from "../../Assets";
import { GiProgression } from "react-icons/gi";

const ProfileHero = ({ userProfile }) => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="p-6 font-sans antialiased">
      <div className=" bg-white rounded-xl shadow-sm">
        {/* Profile Header */}
        <div className="flex justify-between p-8 bg-emerald-600 text-white rounded-t-xl">
          <div className="flex items-start space-x-6 ">
            <img
              src={userProfile.profilePic}
              alt={userProfile.name}
              className="w-24 h-24 rounded-full border-2 border-emerald-400 bg-gfg-white"
            />
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight space-x-2">
                <span>{userProfile.name}</span>
                {/* User tag */}
                <span className="text-sm text-emerald-100 bg-emerald-500 px-2 py-1 rounded-full">
                  {userProfile.role}
                </span>
                <span className="text-sm text-emerald-100 bg-emerald-500 px-2 py-1 rounded-full">
                  {userProfile.academic_year}
                </span>
              </h1>

              <p className="text-emerald-100 text-sm leading-relaxed max-w-md">
                {userProfile.bio}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end justify-center space-x-4 space-y-2">
            <div className="flex items-center space-x-1 justify-center">
              <IoMailOutline className="w-5 h-5" />
              <a
                href={`mailto:${userProfile.email}`}
                className="text-sm pb-1 font-medium"
              >
                {userProfile.email}
              </a>
            </div>

            <div className="flex items-center space-x-4">
              {userProfile.social.map(({ platform, url }) => (
                <a
                  key={platform}
                  href={url}
                  className=" text-emerald-100 hover:text-white hover:scale-105 transition-all"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {platform === "linkedin" && (
                    <FaLinkedin className="w-5 h-5 text-[#0a66c2]" />
                  )}
                  {platform === "codolio" && (
                    <img
                      src={codolioIcon}
                      alt="codolio"
                      width={20}
                      height={20}
                    />
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-100">
          <nav className="flex px-8" aria-label="Tabs">
            {["Overview", "Coding Profiles"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`px-4 py-4 text-sm font-medium border-b-2 ${
                  activeTab === tab.toLowerCase()
                    ? "border-emerald-500 text-emerald-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {activeTab === "overview" ? (
            <div className="grid grid-cols-3 gap-6">
              <StatCard
                icon={<CgCode />}
                label="Questions Solved"
                value={userProfile.stats.questions}
                trend="+5 this week"
              />
              <StatCard
                icon={<CgTrophy />}
                label="Individual Rank"
                value={`#${userProfile.stats.individualRank}`}
                trend="Top 5%"
              />
              <StatCard
                icon={<GiProgression />}
                label="Previous Rank"
                value={`#${userProfile.stats.previousRank}`}
                trend="Top 15%"
              />
              {/* <StatCard
                icon={<IoPeopleOutline />}
                label="Team Rank"
                value={`#${userProfile.stats.teamRank}`}
                trend="Top 10%"
              /> */}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {["leetcode", "codechef", "codeforces"].map((platform) => (
                <div
                  key={platform}
                  className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="self-start mt-1 p-2 rounded-lg bg-white">
                      {React.createElement(platformIcons[platform], {
                        className: "w-5 h-5 text-emerald-600",
                      })}
                    </div>
                    <div>
                      <h3 className="font-medium capitalize">{platform}</h3>
                      <p className="text-sm text-gray-500">
                        @{userProfile.profiles[platform].handle}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-sm text-gray-500">Rating</span>
                        <span className="font-medium text-gray-900">
                          {userProfile.profiles[platform].rating}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Rank</span>
                        <span className="font-medium text-gray-900">
                          #{userProfile.profiles[platform].rank}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, trend }) => (
  <div className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
    <div className="flex items-center space-x-3">
      <div className="p-2 rounded-lg bg-white">
        {React.cloneElement(icon, { className: "w-5 h-5 text-emerald-600" })}
      </div>
      <div>
        <div className="text-sm font-medium text-gray-500">{label}</div>
        <div className="text-xl font-semibold text-gray-900">{value}</div>
        {trend && (
          <div className="text-sm text-emerald-600 font-medium mt-0.5">
            {trend}
          </div>
        )}
      </div>
    </div>
  </div>
);

export default ProfileHero;
