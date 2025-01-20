import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaCode, 
  FaTrophy, 
  FaUsers, 
  FaBell,
  FaCalendarCheck,
  FaChartLine,
  FaExternalLinkAlt
} from 'react-icons/fa';
import { 
  SiLeetcode, 
  SiCodechef, 
  SiCodeforces 
} from 'react-icons/si';

const StatCard = ({ icon: Icon, label, value, change, bgColor = 'bg-white' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`${bgColor} p-4 rounded-xl shadow-sm`}
  >
    <div className="flex items-start justify-between">
      <div className="text-xl text-gfgsc-green">
        <Icon />
      </div>
      {change && (
        <span className={`text-xs font-medium ${
          change > 0 ? 'text-green-500' : 'text-red-500'
        }`}>
          {change > 0 ? '+' : ''}{change}%
        </span>
      )}
    </div>
    <div className="mt-2">
      <h4 className="text-2xl font-bold text-gfg-black">{value}</h4>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  </motion.div>
);

const PlatformStats = ({ platform, problems, rank, progress }) => (
  <div className="flex items-center space-x-4 bg-white p-3 rounded-lg">
    <div className="text-2xl">
      {platform === 'leetcode' && <SiLeetcode className="text-[#FFA116]" />}
      {platform === 'codechef' && <SiCodechef className="text-[#5B4638]" />}
      {platform === 'codeforces' && <SiCodeforces className="text-[#1F8ACB]" />}
    </div>
    <div className="flex-1">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gfg-black">
          {problems} problems solved
        </span>
        <span className="text-xs text-gray-500">Rank: {rank}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-1.5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="bg-gfgsc-green h-1.5 rounded-full"
        />
      </div>
    </div>
  </div>
);

const DashboardHero = () => {
  const notifications = [
    "Team 'CodeCrusaders' achieved 2nd place in last contest",
    "New resource shared: Advanced DP Techniques",
    "Upcoming Contest: LeetCode Weekly on Sunday"
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gfgsc-green-200/20 p-6 rounded-2xl">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile & Stats Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Welcome Section */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gfg-black">
                Welcome back, Surya! 👋
              </h1>
              <p className="text-gray-600 mt-1">
                You're making great progress this week
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="relative p-2 text-xl text-gfgsc-green bg-white rounded-lg shadow-sm"
            >
              <FaBell />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
            </motion.button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <StatCard 
              icon={FaCode}
              label="Total Problems"
              value="324"
              change={12}
            />
            <StatCard 
              icon={FaTrophy}
              label="Current Rank"
              value="#42"
              change={5}
            />
            <StatCard 
              icon={FaUsers}
              label="Team Rank"
              value="#3"
              change={2}
            />
          </div>

          {/* Platform Progress */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gfg-black">Platform Progress</h3>
              <button className="text-sm text-gfgsc-green hover:text-gfg-green flex items-center space-x-1">
                <span>View Details</span>
                <FaExternalLinkAlt className="text-xs" />
              </button>
            </div>
            <PlatformStats 
              platform="leetcode"
              problems="156"
              rank="1,234"
              progress={75}
            />
            <PlatformStats 
              platform="codechef"
              problems="89"
              rank="2,567"
              progress={60}
            />
            <PlatformStats 
              platform="codeforces"
              problems="79"
              rank="3,123"
              progress={45}
            />
          </div>
        </div>

        {/* Notifications & Quick Actions */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h3 className="font-semibold text-gfg-black mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: FaUsers, label: "Team Hub" },
                { icon: FaCalendarCheck, label: "Schedule" },
                { icon: FaChartLine, label: "Analytics" },
                { icon: FaCode, label: "Practice" }
              ].map((action, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gfgsc-green-200/20"
                >
                  <action.icon className="text-xl text-gfgsc-green mb-1" />
                  <span className="text-sm text-gfg-black">{action.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Recent Notifications */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h3 className="font-semibold text-gfg-black mb-4">Recent Updates</h3>
            <div className="space-y-3">
              {notifications.map((notification, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-lg"
                >
                  <div className="w-2 h-2 mt-2 bg-gfgsc-green rounded-full" />
                  <p className="text-sm text-gray-600">{notification}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHero;