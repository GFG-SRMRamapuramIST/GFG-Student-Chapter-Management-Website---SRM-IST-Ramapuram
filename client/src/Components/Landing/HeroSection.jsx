import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  SiGeeksforgeeks,
  SiJavascript,
  SiPython,
  SiReact,
  SiTailwindcss,
} from "react-icons/si";
import {
  FaCode,
  FaArrowRight,
  FaBrain,
  FaUserGraduate,
  FaCrown,
  FaTrophy,
  FaMedal,
} from "react-icons/fa";
import { GfgCoin } from "../../Assets";

const TopPerformerCard = ({ rank, performer, delay }) => {
  const getRankData = () => {
    switch (rank) {
      case 1:
        return {
          icon: FaCrown,
          color: "from-yellow-400 to-amber-500",
          borderGlow: "rgba(251, 191, 36, 0.5)",
          label: "Gold",
          scale: 1.1,
          zIndex: 30,
        };
      case 2:
        return {
          icon: FaTrophy,
          color: "from-gray-300 to-gray-400",
          borderGlow: "rgba(156, 163, 175, 0.5)",
          label: "Silver",
          scale: 1,
          zIndex: 20,
        };
      case 3:
        return {
          icon: FaMedal,
          color: "from-amber-700 to-amber-800",
          borderGlow: "rgba(180, 83, 9, 0.5)",
          label: "Bronze",
          scale: 1,
          zIndex: 20,
        };
    }
  };

  const rankData = getRankData();
  const Icon = rankData.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay, duration: 0.5 }}
      className={`relative ${rank === 1 ? "-mt-8" : ""}`}
      style={{ zIndex: rankData.zIndex }}
    >
      <motion.div
        whileHover={{ scale: 1.05, y: -5 }}
        className={`
          relative w-fit md:whitespace-nowrap p-6 rounded-xl
          bg-gradient-to-br ${rankData.color}
          shadow-lg
        `}
        style={{
          boxShadow: `0 0 20px ${rankData.borderGlow}`,
        }}
      >
        {/* Content */}
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <Icon className="text-white text-3xl" />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay + 0.3, type: "spring" }}
              className="bg-white/20 px-3 py-1 rounded-full"
            >
              <span className="text-white text-sm font-medium">
                {rankData.label}
              </span>
            </motion.div>
          </div>

          <div className="flex flex-col justify-center text-center items-center px-4">
            <div className=" relative">
              <div className="w-16 h-16 rounded-full bg-white/20 overflow-hidden">
                <img
                  src={performer.pfp}
                  alt={performer.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* <motion.div
                className="absolute -bottom-1 -right-1 bg-white/90 rounded-full px-2 py-1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: delay + 0.5 }}
              >
                <span className="text-xs font-bold">#{rank}</span>
              </motion.div> */}
            </div>

            <div className="flex flex-col items-center justify-center text-center">
              <h3 className="text-white font-bold text-lg">{performer.name}</h3>
              <div className="flex items-center text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: delay + 0.4 }}
                  className="flex justify-center items-center bg-white/20 px-2 py-0.5 rounded-full"
                >
                  <span className="text-white font-semibold">
                    {performer.points}
                  </span>
                  <img src={GfgCoin} alt="GfgCoin" className="w-4 h-4 ml-1" />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const HeroSection = () => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  // Sample top performers data
  const topPerformers = [
    {
      id: 2,
      name: "Aakash Kumar",
      points: 2840,
      monthlyRank: 2,
      pfp: "https://placehold.co/100x100",
    },
    {
      id: 1,
      name: "Sanjana Jaldu",
      points: 3120,
      monthlyRank: 1,
      pfp: "https://placehold.co/100x100",
    },
    {
      id: 3,
      name: "Rachit Dhaka",
      points: 2695,
      monthlyRank: 3,
      pfp: "https://placehold.co/100x100",
    },
  ];

  const floatingIcons = [
    { Icon: SiJavascript, top: "20%", left: "10%", delay: 0, duration: 4 },
    { Icon: SiPython, bottom: "30%", left: "5%", delay: 0.5, duration: 5 },
    { Icon: SiReact, top: "30%", right: "15%", delay: 1, duration: 3.5 },
    {
      Icon: SiTailwindcss,
      bottom: "20%",
      right: "10%",
      delay: 1.5,
      duration: 4.5,
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-white to-gfgsc-green-200/30 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      {/* Floating Tech Icons */}
      {floatingIcons.map((icon, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            top: icon.top,
            left: icon.left,
            right: icon.right,
            bottom: icon.bottom,
          }}
        >
          <FloatingTechIcon {...icon} />
        </div>
      ))}

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            className="inline-flex items-center space-x-2 bg-gfg-black text-white px-6 py-2 rounded-full mb-8"
            whileHover={{ scale: 1.05 }}
          >
            <SiGeeksforgeeks className="text-gfgsc-green" />
            <span>Student Chapter</span>
          </motion.div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <h1 className="text-6xl font-bold leading-tight">
              <span className="block text-gfg-black">Innovate.</span>
              <span className="block text-gfgsc-green">Create.</span>
              <span className="block text-gfg-black">Together.</span>
            </h1>

            <div className="flex flex-wrap gap-4 text-lg text-gray-600">
              {[
                { icon: FaCode, text: "Code Excellence" },
                { icon: FaBrain, text: "Tech Innovation" },
                { icon: FaUserGraduate, text: "Continuous Learning" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 * index }}
                  className="flex items-center space-x-2"
                >
                  <item.icon className="text-gfgsc-green" />
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="relative inline-block"
              onHoverStart={() => setHovered(true)}
              onHoverEnd={() => setHovered(false)}
            >
              <button
                onClick={() => navigate("/auth/register")}
                className="group relative px-8 py-4 bg-gfgsc-green text-white rounded-xl font-medium text-lg overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gfg-green"
                  initial={{ x: "-100%" }}
                  animate={{ x: hovered ? 0 : "-100%" }}
                  transition={{ duration: 0.3 }}
                />
                <motion.div className="relative flex items-center space-x-2">
                  <span>Start Your Journey</span>
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </motion.div>
              </button>
            </motion.div>
          </motion.div>

          {/* Right Section - Top Performers Display */}
          <div className="flex flex-col h-full items-center justify-evenly">
            <div className="flex space-x-4 items-center">
              {[topPerformers[1], topPerformers[0], topPerformers[2]].map(
                (performer, index) => (
                  <TopPerformerCard
                    key={performer.id}
                    rank={index === 0 ? 2 : index === 1 ? 1 : 3}
                    performer={performer}
                    delay={0.2 + index * 0.2}
                  />
                )
              )}
            </div>

            <motion.div
              className="flex flex-col items-center space-y-2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold tracking-tight">
                TOP PERFORMERS
              </h2>
              <p className="text-lg font-black text-gfgsc-green tracking-wider">
                FEBRUARY 2025
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FloatingTechIcon = ({ Icon, delay, duration }) => {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{
        y: [-10, 10, -10],
        rotate: [-5, 5, -5],
      }}
      transition={{
        repeat: Infinity,
        duration,
        delay,
        ease: "easeInOut",
      }}
      className="absolute text-2xl text-gfgsc-green/40"
    >
      <Icon />
    </motion.div>
  );
};

export default HeroSection;
