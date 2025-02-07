import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoPersonOutline, IoTelescopeOutline } from "react-icons/io5";
import {
  LeaderboardHero,
  LeaderboardPagination,
  LeaderboardTable,
} from "../Components";

const mockLeaderboardData = [
  {
    id: 1,
    rank: 1,
    name: "Aakash Kumar",
    pfp: "https://placehold.co/100x100",
    position: "President",
    academicYear: "3rd Year",
    team: "Code Warriors",
    problemsSolved: 342,
  },
  {
    id: 2,
    rank: 2,
    name: "Sanjana Jaldu",
    pfp: "https://placehold.co/100x100",
    position: "Vice President",
    academicYear: "3rd Year",
    team: "Tech Titans",
    problemsSolved: 326,
  },
  {
    id: 3,
    rank: 3,
    name: "Rachit Dhaka",
    pfp: "https://placehold.co/100x100",
    position: "Technical Head",
    academicYear: "2nd Year",
    team: "Code Ninjas",
    problemsSolved: 312,
  },
  // ... more mock data
].concat(
  Array.from({ length: 40 }, (_, i) => ({
    id: i + 4,
    rank: i + 4,
    name: `Member ${i + 4}`,
    pfp: "https://placehold.co/100x100",
    position: "Member",
    academicYear: `${Math.floor(Math.random() * 4) + 1}st Year`,
    team: `Team ${String.fromCharCode(65 + Math.floor(i / 3))}`,
    problemsSolved: Math.floor(Math.random() * 200) + 100,
  }))
).concat(
  Array.from({ length: 15 }, (_, i) => ({
    id: i + 4,
    rank: i + 4,
    name: `User ${i + 4}`,
    pfp: "https://placehold.co/100x100",
    position: "User",
    academicYear: `${Math.floor(Math.random() * 4) + 1}st Year`,
    team: `Team ${String.fromCharCode(65 + Math.floor(i / 3))}`,
    problemsSolved: Math.floor(Math.random() * 200) + 100,
  }))
);

const mockTeamData = [
  {
    id: 1,
    rank: 1,
    name: "Code Warriors",
    members: [
      "https://placehold.co/100x100",
      "https://placehold.co/100x100",
      "https://placehold.co/100x100",
      "https://placehold.co/100x100",
    ],
    additionalMembers: 2,
    points: 1250,
  },
  // Add more mock team data...
].concat(
  Array.from({ length: 27 }, (_, i) => ({
    id: i + 1,
    rank: i + 1,
    name: `Team ${String.fromCharCode(65 + i)}`,
    members: Array(3).fill("https://placehold.co/100x100"),
    additionalMembers: Math.floor(Math.random() * 3),
    points: Math.floor(Math.random() * 1000) + 500,
  }))
);

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState("individual");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const data = activeTab === "individual" ? mockLeaderboardData : mockTeamData;
  const topThree = data.slice(0, 3);
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const tabs = [
    {
      id: "individual",
      icon: <IoPersonOutline className="w-5 h-5" />,
      label: "Individual",
    },
    {
      id: "team",
      icon: <IoTelescopeOutline className="w-5 h-5" />,
      label: "Team",
    },
  ];

  const handlePageChange = (page) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Wait for scroll to complete before changing page
    setTimeout(() => {
      setCurrentPage(page);
    }, 300); // Adjust timing based on your scroll duration preference
  };

  return (
    <div className="min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto"
      >
        <h1 className="text-4xl font-bold text-gfg-black mb-6 text-center">
          Leaderboard
        </h1>

        <div className="flex justify-center self-center mx-auto space-x-4 p-3 rounded-lg mb-2 w-fit bg-gfgsc-green-200">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200
                ${
                  activeTab === tab.id
                    ? "bg-gfgsc-green text-white"
                    : "text-gfg-black hover:bg-hover-gray"
                }
              `}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LeaderboardHero
              topThree={topThree}
              isTeam={activeTab === "team"}
            />
            <LeaderboardTable
              data={paginatedData}
              isTeam={activeTab === "team"}
            />
            <LeaderboardPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}  
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Leaderboard;
