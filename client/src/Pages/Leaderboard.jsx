import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoPersonOutline,
  IoTelescopeOutline,
  IoChevronForwardOutline,
  IoChevronBackOutline,
} from "react-icons/io5";

const mockLeaderboardData = [
  {
    id: 1,
    rank: 1,
    name: "Aakash Kumar",
    pfp: "https://placehold.co/100x100",
    position: "President",
    academicYear: "Final Year",
    team: "Code Warriors",
    problemsSolved: 342,
    positionColor: "bg-yellow-500",
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
    positionColor: "bg-gray-400",
  },
  {
    id: 3,
    rank: 3,
    name: "Rachit Dhaka",
    pfp: "https://placehold.co/100x100",
    position: "Core Member",
    academicYear: "2nd Year",
    team: "Code Ninjas",
    problemsSolved: 312,
    positionColor: "bg-amber-700",
  },
  // ... more mock data
].concat(
  Array.from({ length: 107 }, (_, i) => ({
    id: i + 4,
    rank: i + 4,
    name: `Member ${i + 4}`,
    pfp: "https://placehold.co/100x100",
    position: "Member",
    academicYear: `${Math.floor(Math.random() * 4) + 1}st Year`,
    team: `Team ${String.fromCharCode(65 + Math.floor(i / 3))}`,
    problemsSolved: Math.floor(Math.random() * 200) + 100,
    positionColor: "bg-green-500",
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
    id: i + 4,
    rank: i + 4,
    name: `Team ${String.fromCharCode(65 + i)}`,
    members: Array(3).fill("https://placehold.co/100x100"),
    additionalMembers: Math.floor(Math.random() * 3),
    points: Math.floor(Math.random() * 1000) + 500,
  }))
);

const LeaderboardHero = ({ topThree, isTeam }) => {
  const medalColors = [
    "bg-gradient-to-br from-[#FFD700] to-[#FFA500] border-[#FFD700]",
    "bg-gradient-to-br from-[#C0C0C0] to-[#A9A9A9] border-[#C0C0C0]",
    "bg-gradient-to-br from-[#CD7F32] to-[#8B4513] border-[#CD7F32]",
  ];

  const sizes = ["scale-95", "scale-110", "scale-90"];
  const [silver, gold, bronze] = topThree;
  const orderedMembers = [silver, gold, bronze];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-center items-center space-x-4 md:space-x-8 mb-8 px-4"
    >
      {orderedMembers.map((member, index) => (
        <motion.div
          key={member.id}
          whileHover={{ scale: sizes[index] * 1.02 }}
          className={`
            flex flex-col items-center p-4 rounded-xl shadow-lg
            transform transition-all duration-200 border-2
            ${sizes[index]} ${medalColors[index]}
          `}
        >
          {!isTeam && (
            <img
              src={member.pfp}
              alt={member.name}
              className="w-20 h-20 rounded-full border-2 border-white shadow-md"
            />
          )}
          <h3 className="text-white font-bold mt-2">{member.name}</h3>
          <p className="text-white/90 text-sm">
            {isTeam
              ? `${member.points} Points`
              : `${member.problemsSolved} Problems`}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
};

// Add TeamLeaderboard component
const TeamLeaderboard = ({ data }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden">
    <table className="w-full">
      <thead className="bg-gfgsc-green-200">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-medium text-gfg-black uppercase">
            Rank
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gfg-black uppercase">
            Team
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gfg-black uppercase">
            Members
          </th>
          <th className="px-4 py-3 text-right text-xs font-medium text-gfg-black uppercase">
            Points
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((team) => (
          <motion.tr
            key={team.id}
            whileHover={{
              backgroundColor: "#b3e6d4",
              transition: { duration: 0.1 },
            }}
            className="border-b border-gfgsc-green-200"
          >
            <td className="px-4 py-4 whitespace-nowrap text-sm">{team.rank}</td>
            <td className="px-4 py-4 whitespace-nowrap text-sm">{team.name}</td>
            <td className="px-4 py-4">
              <div className="flex items-center">
                {team.members.slice(0, 3).map((pfp, i) => (
                  <img
                    key={i}
                    src={pfp}
                    alt=""
                    className="w-8 h-8 rounded-full -ml-2 first:ml-0 border-2 border-white"
                  />
                ))}
                {team.additionalMembers > 0 && (
                  <span className="ml-1 text-sm text-gray-500">
                    +{team.additionalMembers}
                  </span>
                )}
              </div>
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
              {team.points}
            </td>
          </motion.tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState("individual");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const topThree = mockLeaderboardData.slice(0, 3);
  const paginatedData = mockLeaderboardData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const paginatedTeamData = mockTeamData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(mockLeaderboardData.length / itemsPerPage);

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <motion.button
          key={i}
          onClick={() => setCurrentPage(i)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`
            px-4 py-2 mx-1 rounded-full transition-all duration-300
            ${
              currentPage === i
                ? "bg-gfgsc-green text-white"
                : "bg-gfgsc-green-200 text-gfg-black hover:bg-gfgsc-green-400"
            }
          `}
        >
          {i}
        </motion.button>
      );
    }
    return pages;
  };

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

  return (
    <div className="min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto "
      >
        <h1 className="text-4xl font-bold text-gfg-black mb-6 text-center">
          Leaderboard
        </h1>

        {/* Tab Navigation */}
        <div className="flex justify-center space-x-4 mb-6">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300
                ${
                  activeTab === tab.id
                    ? "bg-gfgsc-green text-white"
                    : "bg-hover-gray text-gfg-black hover:bg-gfgsc-green-200"
                }
              `}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Leaderboard Hero for Top 3 */}
        <LeaderboardHero topThree={topThree} isTeam={activeTab === "team"} />

        {/* Leaderboard Table */}
        <AnimatePresence>
          {activeTab === "individual" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gfgsc-green-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gfg-black uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gfg-black uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gfg-black uppercase tracking-wider">
                        Position
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gfg-black uppercase tracking-wider">
                        Academic Year
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gfg-black uppercase tracking-wider">
                        Team
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gfg-black uppercase tracking-wider">
                        Problems Solved
                      </th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((member) => (
                      <motion.tr
                        key={member.id}
                        whileHover={{
                          backgroundColor: "#b3e6d4",
                          boxShadow:
                            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                        }}
                        className="border-b border-gfgsc-green-200 hover:bg-gfgsc-green-200 transition-all duration-75"
                      >
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gfg-black">
                          {member.rank}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap flex items-center space-x-3">
                          <img
                            src={member.pfp}
                            alt={member.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <span>{member.name}</span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span
                            className={`
                            px-2 py-1 rounded-full text-xs font-medium text-white
                            ${member.positionColor}
                          `}
                          >
                            {member.position}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gfg-black">
                          {member.academicYear}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gfg-black">
                          {member.team}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium text-gfg-black">
                          {member.problemsSolved}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-gfgsc-green hover:text-gfg-green"
                          >
                            <IoChevronForwardOutline className="w-5 h-5" />
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Custom Pagination */}
              <div className="flex justify-center items-center mt-6 space-x-2">
                <motion.button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  disabled={currentPage === 1}
                  className="
                      p-2 rounded-full bg-gfgsc-green-200 
                      disabled:opacity-50 disabled:cursor-not-allowed
                    "
                >
                  <IoChevronBackOutline className="w-5 h-5" />
                </motion.button>

                {renderPagination()}

                <motion.button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  disabled={currentPage === totalPages}
                  className="
                      p-2 rounded-full bg-gfgsc-green-200 
                      disabled:opacity-50 disabled:cursor-not-allowed
                    "
                >
                  <IoChevronForwardOutline className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {activeTab === "team" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <TeamLeaderboard data={paginatedTeamData} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Leaderboard;
