import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaCalendarAlt, 
  FaTrophy, 
  FaUsers, 
  FaChartLine,
  FaCode,
  FaCheck,
  FaClock,
  FaUserFriends
} from 'react-icons/fa';
import { 
  SiLeetcode, 
  SiCodechef, 
  SiCodeforces 
} from 'react-icons/si';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="flex items-start space-x-4 bg-white p-4 rounded-xl"
  >
    <div className="text-2xl text-gfgsc-green">
      <Icon />
    </div>
    <div>
      <h3 className="font-semibold text-gfg-black mb-1">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  </motion.div>
);

const AboutSection = () => {
  return (
    <div className="py-20 bg-gradient-to-br from-gray-50 to-gfgsc-green-200/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Interactive Display */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Platform Integration Showcase */}
            <div className="bg-white p-6 rounded-2xl shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gfg-black">Platform Integration</h3>
                <div className="flex space-x-4 text-2xl">
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="text-[#FFA116]"
                  >
                    <SiLeetcode />
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="text-[#5B4638]"
                  >
                    <SiCodechef />
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="text-[#1F8ACB]"
                  >
                    <SiCodeforces />
                  </motion.div>
                </div>
              </div>

              {/* Live Activity Demo */}
              <div className="space-y-4">
                <motion.div 
                  initial={{ width: "30%" }}
                  whileInView={{ width: "80%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5 }}
                  className="h-2 bg-gfgsc-green rounded-full"
                />
                <motion.div 
                  initial={{ width: "20%" }}
                  whileInView={{ width: "60%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.2 }}
                  className="h-2 bg-gfgsc-green-400 rounded-full"
                />
                <motion.div 
                  initial={{ width: "10%" }}
                  whileInView={{ width: "40%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.4 }}
                  className="h-2 bg-gfgsc-green-200 rounded-full"
                />
              </div>

              {/* Stats Display */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                {[
                  { label: "Active Teams", value: "15" },
                  { label: "Contests", value: "25+" },
                  { label: "Problems", value: "500+" }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-xl font-bold text-gfgsc-green">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -right-4 -bottom-4 w-full h-full bg-gfgsc-green/10 rounded-2xl -z-10" />
            <div className="absolute -right-8 -bottom-8 w-full h-full bg-gfgsc-green/5 rounded-2xl -z-20" />
          </motion.div>

          {/* Right Side - Feature Description */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h2 className="text-4xl font-bold text-gfg-black">
                Your Complete
                <span className="text-gfgsc-green block">Competitive Programming Hub</span>
              </h2>
              <p className="text-gray-600">
                A comprehensive platform designed to streamline your coding journey, foster team collaboration, 
                and track progress across multiple competitive programming platforms.
              </p>
            </motion.div>

            <div className="grid gap-4">
              <FeatureCard 
                icon={FaCalendarAlt}
                title="Smart Event Management"
                description="Schedule and track contests, meetings, and events across multiple platforms with automated reminders and participation tracking."
              />
              <FeatureCard 
                icon={FaChartLine}
                title="Performance Analytics"
                description="Real-time tracking of solved problems and progress across LeetCode, CodeChef, and Codeforces with detailed performance metrics."
              />
              <FeatureCard 
                icon={FaUserFriends}
                title="Team Formation & Collaboration"
                description="Create or join teams, participate in team competitions, and climb the leaderboards together with automated team matching."
              />
              <FeatureCard 
                icon={FaTrophy}
                title="Dynamic Leaderboards"
                description="Track individual and team rankings with real-time updates, fostering healthy competition and motivation."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;