import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaTrophy, FaCode, FaChartLine } from "react-icons/fa";

// Main Profile Component
const ProfileHero = ({ userProfile }) => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="p-6 font-sans">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden"
      >
        <ProfileHeader profile={userProfile} />
        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === "overview" && <ProfileOverview profile={userProfile} />}
        {activeTab === "coding" && <CodingActivity profile={userProfile} />}
        {activeTab === "achievements" && <Achievements profile={userProfile} />}
      </motion.div>
    </div>
  );
};

// Profile Header Component
const ProfileHeader = ({ profile }) => (
  <div className="flex items-center p-6 bg-gfgsc-green text-white">
    <img
      src={profile.profilePic}
      alt={profile.name}
      className="w-24 h-24 rounded-full border-4 border-gfgsc-green-200"
    />
    <div className="ml-6">
      <h1 className="text-3xl font-bold">{profile.name}</h1>
      <p className="text-gfgsc-green-200">{profile.email}</p>
      <div className="flex items-center space-x-4 mt-2">
        <span className="bg-gfgsc-green-400 px-3 py-1 rounded-full text-sm">
          {profile.year}
        </span>
        <span className="bg-gfgsc-green-400 px-3 py-1 rounded-full text-sm">
          {profile.department}
        </span>
      </div>
    </div>
  </div>
);

// Profile Tabs Component
const ProfileTabs = ({ activeTab, setActiveTab }) => {
  const tabItems = [
    { id: "overview", icon: <FaChartLine />, label: "Overview" },
    { id: "coding", icon: <FaCode />, label: "Coding Activity" },
    { id: "achievements", icon: <FaTrophy />, label: "Achievements" },
  ];

  return (
    <div className="flex border-b border-gray-200">
      {tabItems.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center space-x-2 p-4 ${activeTab === tab.id ? "text-gfgsc-green border-b-2 border-gfgsc-green" : "text-gray-500"}`}
        >
          {tab.icon}
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

// Profile Overview Component
const ProfileOverview = ({ profile }) => (
  <div className="p-6 grid grid-cols-3 gap-6">
    <StatCard
      icon={<FaCode />}
      title="Total Questions"
      value={profile.stats.totalQuestions}
    />
    <StatCard
      icon={<FaTrophy />}
      title="Contests"
      value={profile.stats.contestsParticipated}
    />
    <StatCard
      icon={<FaChartLine />}
      title="Current Streak"
      value={profile.stats.currentStreak}
    />
  </div>
);

// Coding Activity Component
const CodingActivity = ({ profile }) => {
  // Mock data for activity heatmap
  const activityData = Array(365)
    .fill(0)
    .map(() => Math.floor(Math.random() * 5));

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Coding Activity Heatmap</h2>
      <div className="grid grid-cols-52 gap-1">
        {activityData.map((level, index) => (
          <div
            key={index}
            className={`h-3 rounded-sm ${level === 0 ? "bg-gray-200" : level === 1 ? "bg-green-200" : level === 2 ? "bg-green-400" : level === 3 ? "bg-green-600" : "bg-green-800"}`}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>Less</span>
        <span>More</span>
      </div>
    </div>
  );
};

// Achievements Component
const Achievements = ({ profile }) => (
  <div className="p-6">
    <h2 className="text-2xl font-semibold mb-4">Coding Profiles</h2>
    <div className="grid md:grid-cols-3 gap-4">
      {Object.entries(profile.platforms).map(([platform, details]) => (
        <motion.div
          key={platform}
          whileHover={{ scale: 1.05 }}
          className="bg-hover-gray p-4 rounded-lg shadow-md"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold capitalize">{platform}</h3>
            {platform === "leetcode" && <FaCode className="text-gfg-green" />}
            {platform === "codeforces" && <FaTrophy className="text-gfg-green" />}
            {platform === "github" && <FaGithub className="text-gfg-green" />}
          </div>
          <div className="text-sm">
            <p>Handle: {details.handle}</p>
            {details.rating && <p>Rating: {details.rating}</p>}
            {details.repos && <p>Repositories: {details.repos}</p>}
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

// Stat Card Component
const StatCard = ({ icon, title, value }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-hover-gray p-4 rounded-lg shadow-md flex items-center space-x-4"
  >
    <div className="text-3xl text-gfg-green">{icon}</div>
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold text-gfg-black">{value}</p>
    </div>
  </motion.div>
);

export default ProfileHero;
