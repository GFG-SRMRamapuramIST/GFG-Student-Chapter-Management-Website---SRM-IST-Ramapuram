import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaLinkedin,
  FaCode,
  FaTrophy,
  FaFire,
  FaCalendarAlt,
  FaChartLine,
  FaChevronDown,
} from "react-icons/fa";
import {
  SiLeetcode,
  SiCodechef,
  SiCodeforces,
  SiGeeksforgeeks,
} from "react-icons/si";
import { codolioIcon } from "../../Assets";

const mockProfiles = {
  leftProfile: {
    id: "67bf1dae9abafaae75f73b7d",
    name: "John Doe",
    email: "john.doe@srmist.edu.in",
    role: "Core Member",
    academic_year: "3rd Year",
    profilePic: "https://placehold.co/100x100",
    bio: "Passionate competitive programmer and full-stack developer",

    social: [
      {
        platform: "linkedin",
        url: "https://linkedin.com/in/johndoe",
      },
      {
        platform: "codolio",
        url: "https://codolio.com/profile/johndoe",
      },
    ],

    stats: {
      questions: 450,
      individualRank: 3,
      previousRank: 5,
      monthlyProgress: +2,
      averageDaily: 4.5,
    },

    profiles: {
      leetcode: {
        handle: "john_doe",
        ranking: 45678,
        totalProblemSolved: 350,
        contestRating: 1756,
      },
      codechef: {
        handle: "john_doe_cc",
        rating: 1823,
        countryRank: 567,
        globalRank: 12345,
      },
      codeforces: {
        handle: "john_doe_cf",
        rating: 1456,
        maxRating: 1567,
        totalProblemSolved: 245,
      },
      geeksforgeeks: {
        handle: "john_doe_gfg",
        universityRank: 12,
        codingScore: 850,
        problemsSolved: 320,
      },
    },

    badges: [
      {
        id: 1,
        name: "Gold Medal",
        type: "gold",
        date: "2024-02-01",
        description: "Top performer in February 2024",
      },
      {
        id: 2,
        name: "Silver Medal",
        type: "silver",
        date: "2024-01-01",
        description: "Runner-up in January 2024",
      },
      {
        id: 3,
        name: "Bronze Medal",
        type: "bronze",
        date: "2023-12-01",
        description: "Third place in December 2023",
      },
    ],

    activityData: {
      currentStreak: 15,
      longestStreak: 30,
      totalContributions: 450,
      averagePerDay: 4.5,
      lastMonthSolved: 120,
    },
  },

  rightProfile: {
    id: "67bf1dae9abafaae75f73b7e",
    name: "Jane Smith",
    email: "jane.smith@srmist.edu.in",
    role: "Member",
    academic_year: "2nd Year",
    profilePic: "https://placehold.co/100x100",
    bio: "Machine learning enthusiast and competitive programmer",

    social: [
      {
        platform: "linkedin",
        url: "https://linkedin.com/in/janesmith",
      },
      {
        platform: "codolio",
        url: "https://codolio.com/profile/janesmith",
      },
    ],

    stats: {
      questions: 280,
      individualRank: 8,
      previousRank: 12,
      monthlyProgress: +4,
      averageDaily: 3.2,
    },

    profiles: {
      leetcode: {
        handle: "jane_smith",
        ranking: 78901,
        totalProblemSolved: 220,
        contestRating: 1534,
      },
      codechef: {
        handle: "jane_smith_cc",
        rating: 1645,
        countryRank: 890,
        globalRank: 23456,
      },
      codeforces: {
        handle: "jane_smith_cf",
        rating: 1234,
        rank: "Pupil",
        totalProblemSolved: 180,
      },
      geeksforgeeks: {
        handle: "jane_smith_gfg",
        universityRank: 25,
        codingScore: 650,
        problemsSolved: 210,
      },
    },

    badges: [
      {
        id: 1,
        name: "Silver Medal",
        type: "silver",
        date: "2024-02-01",
        description: "Runner-up in February 2024",
      },
      {
        id: 2,
        name: "Bronze Medal",
        type: "bronze",
        date: "2024-01-01",
        description: "Third place in January 2024",
      },
    ],

    activityData: {
      currentStreak: 8,
      longestStreak: 20,
      totalContributions: 280,
      averagePerDay: 3.2,
      lastMonthSolved: 85,
    },
  },
};

const mockUsers = [
  { id: "user1", name: "John Doe", role: "Core Member" },
  { id: "user2", name: "Jane Smith", role: "Member" },
  { id: "user3", name: "Alex Johnson", role: "Core Member" },
  { id: "user4", name: "Sarah Williams", role: "Member" },
  { id: "user5", name: "Mike Brown", role: "Core Member" },
];

const UserSelector = ({ selectedUser, label }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <label className="block text-emerald-600 text-sm mb-2">{label}</label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-emerald-900 border border-emerald-700 rounded-lg px-4 py-2 text-left flex items-center justify-between hover:bg-emerald-800/60 transition-colors"
      >
        <div className="flex items-center">
          <img
            src={selectedUser?.profilePic || "https://placehold.co/100x100"}
            alt={selectedUser?.name}
            className="w-8 h-8 rounded-full mr-3"
          />
          <div>
            <div className="text-white">{selectedUser?.name}</div>
            <div className="text-emerald-400 text-xs">{selectedUser?.role}</div>
          </div>
        </div>
        <FaChevronDown
          className={`text-emerald-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute w-full mt-2 bg-emerald-900/95 border border-emerald-700 rounded-lg shadow-xl z-50 backdrop-blur-sm max-h-60 overflow-y-auto">
          {mockUsers.map((user) => (
            <button
              key={user.id}
              onClick={() => {
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 flex items-center hover:bg-emerald-800/60 transition-colors"
            >
              <img
                src={user.profilePic || "https://placehold.co/100x100"}
                alt={user.name}
                className="w-8 h-8 rounded-full mr-3"
              />
              <div className="text-left">
                <div className="text-white">{user.name}</div>
                <div className="text-emerald-400 text-xs">{user.role}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ProfileComparison = () => {
  const { leftProfile, rightProfile } = mockProfiles;

  // GeeksforGeeks inspired color palette with your primary color
  const colors = {
    primary: "#00895e",
    neutral: "#f5f5f7",
  };

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const renderSocialLinks = (social) => (
    <div className="flex space-x-4 my-4 justify-center">
      {social.map((link) => (
        <motion.a
          key={link.platform}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.2, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          className="text-2xl text-white hover:text-emerald-300 transition-all duration-300"
        >
          {link.platform === "linkedin" ? (
            <FaLinkedin />
          ) : (
            <img src={codolioIcon} alt="codolio" className="w-6 h-6" />
          )}
        </motion.a>
      ))}
    </div>
  );

  const renderPlatformStats = (platform, data) => {
    let PlatformIcon;
    let profileUrl;
    let platformColor;

    switch (platform) {
      case "leetcode":
        PlatformIcon = SiLeetcode;
        profileUrl = `https://leetcode.com/${data.handle}`;
        platformColor = "#FFA116"; // LeetCode orange
        break;
      case "codechef":
        PlatformIcon = SiCodechef;
        profileUrl = `https://www.codechef.com/users/${data.handle}`;
        platformColor = "#654321"; // CodeChef brown
        break;
      case "codeforces":
        PlatformIcon = SiCodeforces;
        profileUrl = `https://codeforces.com/profile/${data.handle}`;
        platformColor = "#318CE7"; // Codeforces blue
        break;
      case "geeksforgeeks":
        PlatformIcon = SiGeeksforgeeks;
        profileUrl = `https://geeksforgeeks.org/user/${data.handle}/profile`;
        platformColor = colors.primary; // GFG green (your primary color)
        break;
      default:
        PlatformIcon = FaCode;
        profileUrl = "#";
        platformColor = colors.neutral;
    }

    return (
      <motion.a
        href={profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-white/95 backdrop-blur-sm shadow-md rounded-lg p-4 mb-4 transition-all duration-300 border  hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-900/20"
        variants={fadeInVariants}
        whileHover={{ y: -5 }}
      >
        <div className="flex items-center mb-3">
          <PlatformIcon
            style={{ color: platformColor }}
            className="text-xl mr-2"
          />
          <h3 className="font-bold text-lg capitalize">{platform}</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(data).map(
            ([key, value]) =>
              key !== "handle" && (
                <div key={key} className="text-sm">
                  <span className="text-gray-400">
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                    :{" "}
                  </span>
                  <span className="font-semibold text-emerald-800">
                    {value}
                  </span>
                </div>
              )
          )}
        </div>
      </motion.a>
    );
  };

  const renderBadges = (badges) => (
    <div className="flex flex-wrap gap-3 mb-4">
      {badges.map((badge) => (
        <motion.div
          key={badge.id}
          className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center space-x-1.5 shadow-md
            ${
              badge.type === "gold"
                ? "bg-gradient-to-r from-yellow-500 to-yellow-400 text-yellow-900"
                : badge.type === "silver"
                ? "bg-gradient-to-r from-gray-400 to-gray-300 text-gray-800"
                : "bg-gradient-to-r from-amber-700 to-amber-600 text-amber-100"
            }`}
          whileHover={{ scale: 1.07, y: -2 }}
          whileTap={{ scale: 0.95 }}
          title={badge.description}
        >
          <FaTrophy
            className={
              badge.type === "gold"
                ? "text-yellow-800"
                : badge.type === "silver"
                ? "text-gray-700"
                : "text-amber-200"
            }
          />
          <span>{badge.name}</span>
        </motion.div>
      ))}
    </div>
  );

  const renderActivityData = (activityData) => (
    <motion.div
      className="bg-white/90 backdrop-blur-sm rounded-lg p-5 mb-6 border border-emerald-800/50"
      variants={fadeInVariants}
    >
      <h3 className="font-bold text-lg mb-4 flex items-center text-emerald-800">
        <FaChartLine className="mr-2" />
        Monthly Activity
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center bg-gradient-to-br from-emerald-800/80 to-emerald-900/80 p-3 rounded-lg">
          <FaFire className="text-orange-500 mr-3 text-xl" />
          <div>
            <div className="text-sm text-emerald-300">Current Streak</div>
            <div className="font-bold text-lg">
              {activityData.currentStreak} days
            </div>
          </div>
        </div>
        <div className="flex items-center bg-gradient-to-br from-emerald-800/80 to-emerald-900/80 p-3 rounded-lg">
          <FaFire className="text-red-500 mr-3 text-xl" />
          <div>
            <div className="text-sm text-emerald-300">Longest Streak</div>
            <div className="font-bold text-lg">
              {activityData.longestStreak} days
            </div>
          </div>
        </div>
        <div className="flex items-center bg-gradient-to-br from-emerald-800/80 to-emerald-900/80 p-3 rounded-lg">
          <FaCalendarAlt className="text-blue-400 mr-3 text-xl" />
          <div>
            <div className="text-sm text-emerald-300">Last Month</div>
            <div className="font-bold text-lg">
              {activityData.lastMonthSolved} problems
            </div>
          </div>
        </div>
        <div className="flex items-center bg-gradient-to-br from-emerald-800/80 to-emerald-900/80 p-3 rounded-lg">
          <FaChartLine className="text-emerald-400 mr-3 text-xl" />
          <div>
            <div className="text-sm text-emerald-300">Daily Average</div>
            <div className="font-bold text-lg">
              {activityData.averagePerDay} problems
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderStats = (profile) => (
    <motion.div
      className="bg-gradient-to-br from-emerald-800/80 to-emerald-900/80 rounded-lg shadow-xl p-5 mb-6 border border-emerald-700"
      variants={fadeInVariants}
    >
      <h3 className="font-bold text-lg mb-4 text-emerald-100">
        Performance Statistics
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 p-3 rounded-lg">
          <div className="text-sm text-emerald-200 mb-1">Questions Solved</div>
          <div className={`font-bold text-2xl`}>{profile.stats.questions}</div>
        </div>
        <div className="bg-white/5 p-3 rounded-lg">
          <div className="text-sm text-emerald-200 mb-1">Rank</div>
          <div className={`font-bold text-2xl `}>
            #{profile.stats.individualRank}
          </div>
        </div>
        <div className="bg-white/5 p-3 rounded-lg">
          <div className="text-sm text-emerald-200 mb-1">Previous Rank</div>
          <div className="font-bold text-2xl">
            #{profile.stats.previousRank}
          </div>
        </div>
        <div className="bg-white/5 p-3 rounded-lg">
          <div className="text-sm text-emerald-200 mb-1">Monthly Progress</div>
          <div className={`font-bold text-2xl `}>
            {profile.stats.monthlyProgress > 0 ? "+" : ""}
            {profile.stats.monthlyProgress}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderProfileCard = (profile, otherProfile) => (
    <motion.div
      className="w-full"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      <motion.div
        className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden mb-6 border border-emerald-800/50"
        variants={fadeInVariants}
      >
        <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 p-8 text-white flex flex-col items-center justify-center text-center relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ffffff33_1px,transparent_1px)] bg-[size:20px_20px]"></div>
          </div>

          <motion.div
            className="relative z-10 mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-300 p-1 shadow-xl">
              <img
                src={profile.profilePic}
                alt={profile.name}
                className="w-full h-full rounded-full border-2 border-white object-cover"
              />
            </div>
          </motion.div>

          <h2 className="text-2xl font-bold text-center relative z-10 text-white">
            {profile.name}
          </h2>
          <div className="flex items-center justify-center space-x-2 mt-1 text-emerald-200">
            <span className="px-3 py-1 bg-emerald-800/70 rounded-full text-xs">
              {profile.role}
            </span>
            <span className="px-3 py-1 bg-emerald-800/70 rounded-full text-xs">
              {profile.academic_year}
            </span>
          </div>

          {renderSocialLinks(profile.social)}

          <p className="text-center text-sm italic mt-2 text-emerald-100 bg-emerald-950/30 px-4 py-2 rounded-full max-w-xs mx-auto">
            "{profile.bio}"
          </p>
        </div>

        <div className="p-6 bg-white">
          {renderStats(profile, otherProfile)}

          <motion.div className="mb-6" variants={fadeInVariants}>
            <h3 className="font-bold text-lg mb-4 flex items-center text-emerald-800">
              <FaTrophy className="mr-2 text-yellow-500" />
              Achievements & Badges
            </h3>
            {renderBadges(profile.badges)}
          </motion.div>

          {renderActivityData(profile.activityData)}

          <div className="space-y-4">
            <h3 className="font-bold text-lg mb-3 text-emerald-800">
              Coding Platforms
            </h3>
            {Object.entries(profile.profiles).map(([platform, data]) =>
              renderPlatformStats(platform, data)
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="min-h-screen  text-white p-6">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl font-bold mb-2 text-black">
          Profile Comparison
        </h1>
        <p className="text-black max-w-xl mx-auto">
          Compare coding platform performance and competitive programming
          metrics
        </p>
      </motion.div>

      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <UserSelector
            selectedUser={leftProfile}
            label="Select First Profile"
          />
          <UserSelector
            selectedUser={rightProfile}
            label="Select Second Profile"
          />
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            {renderProfileCard(leftProfile, rightProfile)}
          </div>

          <motion.div
            className="hidden md:flex items-center justify-center"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="w-px h-full bg-emerald-800 relative">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-full p-4 border-2 border-emerald-500 shadow-lg shadow-emerald-600/20">
                <span className="text-2xl font-bold text-white">VS</span>
              </div>
            </div>
          </motion.div>

          <div className="flex-1">
            {renderProfileCard(rightProfile, leftProfile)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileComparison;
