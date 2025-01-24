import React from "react";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import PlatformProgress from "./PlatformProgress";
import { platformIcons } from "../../Constants";

const OverviewSection = ({ platformData }) => {
  return (
    <div className="py-8 px-16 rounded-xl flex gap-6">
      <div className="flex flex-col w-2/3">
        <QuickStats platformData={platformData} />
        <PlatformProgress platformData={platformData} />
      </div>
      <div className="flex flex-col w-1/3">
        <PlatformProfiles platformData={platformData} />
      </div>
    </div>
  );
};

const PlatformProfiles = ({ user, platformData }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold text-gfg-black mb-4">
        Platform Profiles
      </h2>
      {Object.entries(platformData).map(([platform, details]) => (
        <motion.div
          key={platform}
          whileHover={{ scale: 1.03 }}
          className="bg-white shadow-md rounded-xl p-4 flex items-center justify-between border border-gfgsc-green-200"
        >
          <div className="flex items-center space-x-4">
            {React.createElement(platformIcons[platform], {
              className: "text-3xl",
            })}
            <div>
              <h3 className="font-semibold text-lg">{details.name}</h3>
              <p className="text-sm text-gray-500">Rank: {details.rank}</p>
            </div>
          </div>
          <FaArrowRight className="text-gfgsc-green" />
        </motion.div>
      ))}
    </div>
  );
};

const QuickStats = ({ platformData }) => {
  const overallStats = {
    totalContests: Object.values(platformData).reduce(
      (sum, platform) => sum + platform.contestsParticipated,
      0
    ),
    totalProblems: Object.values(platformData).reduce(
      (sum, platform) => sum + platform.totalProblems,
      0
    ),
    averageRating: Math.round(
      Object.values(platformData).reduce(
        (sum, platform) => sum + platform.rating,
        0
      ) / Object.keys(platformData).length
    ),
  };

  const statsCards = [
    {
      icon: <platformIcons.leetcode className="text-gfgsc-green text-3xl" />,
      value: overallStats.totalContests,
      label: "Contests",
    },
    {
      icon: <platformIcons.codechef className="text-blue-500 text-3xl" />,
      value: overallStats.totalProblems,
      label: "Problems",
    },
    {
      icon: <platformIcons.codeforces className="text-purple-500 text-3xl" />,
      value: overallStats.averageRating,
      label: "Rating",
    },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-gfg-black mb-4">Quick Stats</h2>
      <div className="flex w-full gap-4">
        {statsCards.map((card, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="flex-1 bg-white shadow-md rounded-xl p-4 flex items-center space-x-4"
          >
            {card.icon}
            <div>
              <p className="text-2xl font-bold">{card.value}</p>
              <p className="text-sm text-gray-500">{card.label}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default OverviewSection;