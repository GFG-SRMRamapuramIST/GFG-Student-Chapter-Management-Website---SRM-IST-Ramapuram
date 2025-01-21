import React from 'react';
import { motion } from 'framer-motion';
import { 
  MdTrendingUp, 
  MdEmojiEvents, 
  MdGroups,
  MdNotifications,
  MdCalendarToday,
  MdArrowForward
} from 'react-icons/md';
import { 
  SiLeetcode, 
  SiCodechef, 
  SiCodeforces,
  SiGeeksforgeeks
} from 'react-icons/si';
import CustomCalendar from '../Calendar/CustomCalendar';

const StatCard = ({ icon: Icon, label, value, change }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
  >
    <div className="flex items-center justify-between mb-3">
      <div className="p-2.5 rounded-xl bg-gfgsc-green-200/50">
        <Icon className="text-xl text-gfgsc-green" />
      </div>
      {change && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-1 text-sm font-medium ${
            change > 0 ? 'text-gfgsc-green' : 'text-red-500'
          }`}
        >
          {change > 0 ? '↑' : '↓'} {Math.abs(change)}%
        </motion.div>
      )}
    </div>
    <h4 className="text-3xl font-bold text-gfg-black mb-1">{value}</h4>
    <p className="text-sm text-gray-600">{label}</p>
  </motion.div>
);

const PlatformCard = ({ platform, problems, rank, progress }) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
  >
    <div className="flex items-center gap-4">
      <div className="text-2xl">
        {platform === 'leetcode' && <SiLeetcode className="text-[#FFA116]" />}
        {platform === 'codechef' && <SiCodechef className="text-[#5B4638]" />}
        {platform === 'codeforces' && <SiCodeforces className="text-[#1F8ACB]" />}
        {platform === 'gfg' && <SiGeeksforgeeks className="text-gfgsc-green" />}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium text-gfg-black">
            {problems} solved
          </span>
          <span className="text-sm bg-gfgsc-green-200/50 text-gfgsc-green px-2 py-0.5 rounded-full">
            Rank #{rank}
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="bg-gradient-to-r from-gfgsc-green to-gfgsc-green-400 h-2 rounded-full"
          />
        </div>
      </div>
    </div>
  </motion.div>
);

const NotificationItem = ({ message }) => (
  <motion.div
    whileHover={{ x: 4 }}
    className="flex items-center gap-3 p-3 hover:bg-gfgsc-green-200/20 rounded-xl cursor-pointer"
  >
    <div className="w-2 h-2 bg-gfgsc-green rounded-full" />
    <p className="text-sm text-gray-600 flex-1">{message}</p>
    <MdArrowForward className="text-gfgsc-green" />
  </motion.div>
);

const DashboardHero = () => {

  const events = [
    {
      type: 'contest',
      platform: 'leetcode',
      name: 'Weekly Contest 123',
      time: '2025-01-25T14:30:00',
      link: 'https://leetcode.com/contest/123'
    },
    {
      type: 'meeting',
      name: 'Team Sync',
      time: '2025-01-22T15:00:00',
      attendees: 'CORE',
      link: 'https://meet.google.com/xyz',
    },
    {
      type: 'meeting',
      name: 'DSA Discussion',
      time: '2025-01-22T17:00:00',
      attendees: 'ALL',
      link: 'https://meet.google.com/abc',
    },
    {
      type: 'contest',
      platform: 'leetcode',
      name: 'Weekly Contest 123',
      time: '2025-01-22T17:00:00',
      link: 'https://leetcode.com/contest/123'
    },
  ];

  const notifications = [
    "Team 'CodeCrusaders' achieved 2nd place in last contest",
    "New resource shared: Advanced DP Techniques",
    "Upcoming Contest: LeetCode Weekly on Sunday"
  ];

  return (
    <div className="min-h-screen px-16 pt-24 pb-8 bg-gradient-to-br from-gray-50 to-gfgsc-green-200/20">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gfg-black mb-2">
            Hey Surya! 👋
          </h1>
          <p className="text-gray-600">
            Ready to conquer some coding challenges today?
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="relative p-3 bg-white rounded-xl shadow-sm"
        >
          <MdNotifications className="text-xl text-gfgsc-green" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
        </motion.button>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <StatCard 
              icon={MdTrendingUp}
              label="Problems Solved"
              value="324"
              change={12}
            />
            <StatCard 
              icon={MdEmojiEvents}
              label="Current Rank"
              value="#42"
              change={5}
            />
            <StatCard 
              icon={MdGroups}
              label="Team Position"
              value="#3"
              change={2}
            />
          </div>

          {/* Calendar */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <CustomCalendar events={events} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Platform Progress */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gfg-black">Platform Progress</h3>
              <MdCalendarToday className="text-gfgsc-green" />
            </div>
            <div className="space-y-4">
              <PlatformCard 
                platform="leetcode"
                problems="156"
                rank="1,234"
                progress={75}
              />
              <PlatformCard 
                platform="codechef"
                problems="89"
                rank="2,567"
                progress={60}
              />
              <PlatformCard 
                platform="codeforces"
                problems="79"
                rank="3,123"
                progress={45}
              />
              <PlatformCard 
                platform="gfg"
                problems="102"
                rank="892"
                progress={80}
              />
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="font-semibold text-gfg-black mb-4">Recent Updates</h3>
            <div className="space-y-2">
              {notifications.map((notification, index) => (
                <NotificationItem key={index} message={notification} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHero;