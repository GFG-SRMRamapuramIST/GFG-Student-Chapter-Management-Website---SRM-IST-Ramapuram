import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaCode, 
  FaTrophy, 
  FaChartLine, 
  FaCalendarAlt, 
  FaUserFriends 
} from 'react-icons/fa';
import { 
  SiLeetcode, 
  SiCodechef, 
  SiCodeforces, 
  SiGeeksforgeeks 
} from 'react-icons/si';

const PlatformIcon = ({ Icon, color, name }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="flex flex-col items-center space-y-2 p-4 bg-white rounded-xl shadow-md"
  >
    <div 
      className="p-3 rounded-full bg-opacity-10 mb-2"
      style={{ 
        backgroundColor: color, 
        color: color 
      }}
    >
      <Icon className="text-3xl text-white " />
    </div>
    <span className="text-sm font-medium text-gray-700">{name}</span>
  </motion.div>
);

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    whileHover={{ 
      scale: 1.05,
      boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
    }}
    className="bg-white p-6 rounded-2xl space-y-4 border border-gfgsc-green/10 transition-all duration-300 ease-in-out"
  >
    <div className="flex items-center space-x-4">
      <div className="bg-gfgsc-green/10 p-3 rounded-xl">
        <Icon className="text-2xl text-gfgsc-green" />
      </div>
      <h3 className="text-lg font-semibold text-gfg-black">{title}</h3>
    </div>
    <p className="text-gray-600 text-sm">{description}</p>
  </motion.div>
);

const AboutSection = () => {
  const platforms = [
    { 
      Icon: SiLeetcode, 
      color: "#FFA116", 
      name: "LeetCode" 
    },
    { 
      Icon: SiCodechef, 
      color: "#5B4638", 
      name: "CodeChef" 
    },
    { 
      Icon: SiCodeforces, 
      color: "#1F8ACB", 
      name: "Codeforces" 
    },
    { 
      Icon: SiGeeksforgeeks, 
      color: "#2F8D46", 
      name: "GeeksforGeeks" 
    }
  ];

  const features = [
    {
      icon: FaCode,
      title: "Smart Event Management",
      description: "Seamlessly schedule and track contests, meetings, and events across multiple platforms with intelligent reminders."
    },
    {
      icon: FaChartLine,
      title: "Performance Analytics",
      description: "Comprehensive real-time tracking of problem-solving progress with detailed performance metrics and insights."
    },
    {
      icon: FaUserFriends,
      title: "Resources Shared",
      description: "Access a vast library of coding resources, tutorials, and practice problems shared by the community."
    },
    {
      icon: FaTrophy,
      title: "Dynamic Leaderboards",
      description: "Engage in healthy competition with real-time individual and team rankings that motivate continuous improvement."
    }
  ];

  return (
    <div className="py-24 bg-gradient-to-br from-gfgsc-green-200/10 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gfg-black mb-4">
            Your Complete
            <span className="text-gfgsc-green block">Coding Ecosystem</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            A holistic platform designed to elevate your competitive programming
            journey, fostering skill development, team collaboration, and
            continuous learning.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Platform Integration */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 shadow-2xl border border-gfgsc-green/10"
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-gfg-black">
                Integrated Platforms
              </h3>
              <div className="text-xs bg-gfgsc-green/10 px-3 py-1 rounded-full text-gfgsc-green">
                4 Platforms Connected
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {platforms.map((platform, index) => (
                <PlatformIcon key={index} {...platform} />
              ))}
            </div>

            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              transition={{ duration: 1.5 }}
              className="h-1 bg-gradient-to-r from-gfgsc-green to-gfgsc-green-200 mt-8 rounded-full"
            />
          </motion.div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>

        {/* Statistics Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 bg-gfgsc-green/10 rounded-3xl p-8 grid md:grid-cols-3 gap-8 text-center"
        >
          {[
            { value: "40+", label: "Active Users" },
            { value: "150+", label: "Practice Problems" },
            { value: "5+", label: "Resources Shared" },
          ].map((stat, index) => (
            <div key={index}>
              <div className="text-4xl font-bold text-gfgsc-green mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default AboutSection;