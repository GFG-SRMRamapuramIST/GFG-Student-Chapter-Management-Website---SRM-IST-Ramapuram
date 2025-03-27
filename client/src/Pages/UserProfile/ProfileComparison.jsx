import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Importing Icons
import {
  FaLinkedin,
  FaCode,
  FaTrophy,
  FaFire,
  FaChartLine,
  FaChevronDown,
  FaChevronRight,
  FaExternalLinkAlt,
  FaSpinner,
} from "react-icons/fa";

import { codolioIcon } from "../../Assets";
import { Medal } from "../../Components";
import CustomDialog from "../../Components/ui/CustomDialog";
import { getPlatformUrl, platformColors, platformIcons } from "../../Constants";
import { ToastMsg } from "../../Utilities";

// Importing APIs
import { UserServices } from "../../Services";
import { BiError } from "react-icons/bi";

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
    },
  },
};

const UserSelector = ({
  selectedUser,
  label,
  allUsers,
  currentUserRole,
  side,
  fetchProfileData,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleIsOpen = (userId) => {
    if (
      side == "left" &&
      (currentUserRole == "MEMBER" || currentUserRole == "USER")
    ) {
      setIsOpen(false);
    } else {
      setIsOpen(!isOpen);
    }

    if (userId) {
      fetchProfileData(userId, side);
    }
  };
  return (
    <div className="relative">
      <label className="block text-emerald-600 text-sm mb-2">{label}</label>
      <button
        onClick={() => toggleIsOpen()}
        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-left flex items-center justify-between hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center">
          <img
            src={selectedUser?.profilePic || "https://placehold.co/100x100"}
            alt={selectedUser?.name}
            className="w-8 h-8 rounded-full mr-3"
          />
          <div>
            <div className="text-black">{selectedUser?.name}</div>
            <div className="text-emerald-600 text-xs">{selectedUser?.role}</div>
          </div>
        </div>
        <FaChevronDown
          className={`text-emerald-600 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
          {allUsers?.map((user) => (
            <button
              key={user.id}
              onClick={() => toggleIsOpen(user.id)}
              className="w-full px-4 py-2 flex items-center hover:bg-gray-100 transition-colors"
            >
              <img
                src={user.profilePic || "https://placehold.co/100x100"}
                alt={user.name}
                className="w-8 h-8 rounded-full mr-3"
              />
              <div className="text-left">
                <div className="text-black">{user.name}</div>
                <div className="text-emerald-600 text-xs">{user.role}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ProfileComparison = () => {
  const { getAllUsersWithIdNameRolePfpFunction, getProfilePageDataFunction } =
    UserServices();
  const [loading, setLoading] = useState(false);
  const [leftProfileLoading, setLeftProfileLoading] = useState(false);
  const [rightProfileLoading, setRightProfileLoading] = useState(false);

  const [users, setUsers] = useState([]);
  const [currentUserIdandRole, setCurrentUserIdandRole] = useState({
    id: "",
    role: "",
  });
  //const { leftProfile, rightProfile } = mockProfiles;
  const emptyProfile = {
    id: "",
    name: "",
    email: "",
    role: "",
    academic_year: "",
    profilePic: "",
    bio: "",
    social: [
      { platform: "linkedin", url: "" },
      { platform: "codolio", url: "" },
    ],
    stats: {
      questions: 0,
      individualRank: 0,
      previousRank: 0,
      averageDaily: 0,
    },
    profiles: {
      leetcode: {
        handle: "",
        ranking: 0,
        totalProblemSolved: 0,
        badgesCount: 0,
      },
      codechef: {
        handle: "",
        rating: 0,
        countryRank: 0,
        highestRating: 0,
      },
      codeforces: {
        handle: "",
        rating: 0,
        maxRating: 0,
        totalProblemSolved: 0,
      },
      geeksforgeeks: {
        handle: "",
        universityRank: 0,
        codingScore: 0,
        problemsSolved: 0,
      },
    },
    badges: [],
    activityData: {
      currentStreak: 0,
      longestStreak: 0,
      totalContributions: 0,
      averagePerDay: 0,
    },
  };

  const [leftProfile, setLeftProfile] = useState(emptyProfile);
  const [rightProfile, setRightProfile] = useState(emptyProfile);

  const [showLeftBadges, setShowLeftBadges] = useState(false);
  const [showRightBadges, setShowRightBadges] = useState(false);

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const fetchProfileData = async (profileId, label) => {
    try {
      if (label === "left") {
        setLeftProfileLoading(true);
      } else {
        setRightProfileLoading(true);
      }
      const response = await getProfilePageDataFunction({ userId: profileId });

      if (response.status !== 200) {
        ToastMsg("Error fetching profile data! Please try later", "error");
      } else {
        const data = response.data;
        //console.log("Profile Data:", data);
        const formattedProfile = {
          id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
          academic_year: data.academicYear,
          profilePic: data.profilePicture,
          bio: data.bio,

          social: [
            {
              platform: "linkedin",
              url: `https://linkedin.com/in/${data.linkedinUsername}`,
            },
            {
              platform: "codolio",
              url: `https://codolio.com/profile/${data.codolioUsername}`,
            },
          ],

          stats: {
            questions: data.totalQuestionSolved,
            individualRank: data.currentRank,
            previousRank: data.prevMonthData?.prevRank || null,
            averageDaily: data.avgPerDay,
          },

          profiles: {
            leetcode: {
              handle: data.leetcodeUsername,
              ranking: data.platforms.leetcode.ranking,
              totalProblemSolved: data.platforms.leetcode.totalProblemSolved,
              badgesCount: data.platforms.leetcode.badgesCount,
            },
            codechef: {
              handle: data.codechefUsername,
              rating: data.platforms.codechef.rating,
              countryRank: data.platforms.codechef.countryRank,
              highestRating: data.platforms.codechef.highestRating,
            },
            codeforces: {
              handle: data.codeforcesUsername,
              rating: data.platforms.codeforces.rating,
              maxRating: data.platforms.codechef.highestRating,
              totalProblemSolved: data.platforms.codeforces.totalProblemSolved,
            },
            geeksforgeeks: {
              handle: data.geeksforgeeksUsername,
              universityRank: data.platforms.geeksforgeeks.universityRank,
              codingScore: data.platforms.geeksforgeeks.codingScore,
              problemsSolved: data.platforms.geeksforgeeks.problemSolved,
            },
          },

          badges: [
            ...data.achievement.gold.map((name, index) => ({
              id: index + 1,
              name,
              type: "gold",
              date: null,
              description: "",
            })),
            ...data.achievement.silver.map((name, index) => ({
              id: index + 1 + data.achievement.gold.length,
              name,
              type: "silver",
              date: null,
              description: "",
            })),
            ...data.achievement.bronze.map((name, index) => ({
              id:
                index +
                1 +
                data.achievement.gold.length +
                data.achievement.silver.length,
              name,
              type: "bronze",
              date: null,
              description: "",
            })),
            ...data.achievement.dailyActiveStreak.map((badge) => ({
              id: Math.random(),
              name: "Daily Active Streak",
              type: "dailyActiveStreak",
              date: `${badge.year}-${badge.month
                .toString()
                .padStart(2, "0")}-01`,
              description: "Awarded for good performance in coding contests.",
            })),
            ...data.achievement.maxAvgPerDay.map((badge) => ({
              id: Math.random(),
              name: "Max Average Per Day",
              type: "maxAvgPerDay",
              date: `${badge.year}-${badge.month
                .toString()
                .padStart(2, "0")}-01`,
              description: "Awarded for good performance in coding contests.",
            })),
          ],

          activityData: {
            currentStreak: data.maxStreak,
            longestStreak: data.maxStreak,
            totalContributions: data.dailyActivity.reduce(
              (sum, day) => sum + day.count,
              0
            ),
            averagePerDay: data.avgPerDay,
          },
        };

        if (label === "left") {
          setLeftProfile(formattedProfile);
        } else if (label === "right") {
          setRightProfile(formattedProfile);
        } else {
          setLeftProfile(formattedProfile);
          setRightProfile(formattedProfile);
        }
      }
    } catch (error) {
      ToastMsg("Error fetching profile data! Please try later", "error");
      console.error("Error fetching profile data:", error.message);
    } finally {
      if (label === "left") {
        setLeftProfileLoading(false);
      } else {
        setRightProfileLoading(false);
      }
    }
  };

  const fetchAllUsersWithIdNameRolePfp = async () => {
    try {
      setLoading(true);
      const response = await getAllUsersWithIdNameRolePfpFunction();
      //console.log(response);
      if (response.status == 200) {
        const allUsers = response.data.data.map((user) => ({
          id: user._id,
          name: user.name,
          role: user.role,
          profilePic: user.profilePicture,
        }));
        setUsers(allUsers);

        await fetchProfileData(response.data.userId);
        setCurrentUserIdandRole({
          id: response.data.userId,
          role: response.data.role,
        });
      } else {
        ToastMsg(response.response.data.message, "error");
      }
    } catch (error) {
      ToastMsg("Error fetching profile data! Please try later", "error");
      console.error("Error fetching profile data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsersWithIdNameRolePfp();
  }, []);

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
    // Normalize platform name to lowercase for consistency
    const normalizedPlatform = platform.toLowerCase();

    // Get platform-specific properties
    const PlatformIcon = platformIcons[normalizedPlatform] || FaCode;
    const platformColor = platformColors[normalizedPlatform] || "#6e6e6e";
    const profileUrl = data.handle
      ? `https://${getPlatformUrl(normalizedPlatform)}/${data.handle}`
      : "#";

    return (
      <div
        className="rounded-lg shadow-md p-4 mb-4 transition-all duration-300 hover:shadow-lg"
        style={{ borderLeft: `4px solid ${platformColor}` }}
      >
        <div className="flex items-center mb-3">
          <div
            className="p-2 rounded-full mr-3"
            style={{ backgroundColor: `${platformColor}20` }} // 20 is hex for 12% opacity
          >
            <PlatformIcon size={24} color={platformColor} />
          </div>

          <h3 className="text-lg text-black font-semibold flex-grow capitalize">
            {normalizedPlatform}
          </h3>

          {data.handle && (
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm font-medium transition-colors duration-300 hover:underline"
              style={{ color: platformColor }}
            >
              <span className="hidden md:flex">{data.handle}</span>
              <FaExternalLinkAlt size={12} className="ml-1" />
            </a>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {Object.entries(data).map(
            ([key, value]) =>
              key !== "handle" && (
                <div key={key} className="bg-gray-50 p-2 rounded">
                  <div className="text-xs text-gray-500 mb-1">
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </div>
                  <div className="font-medium text-black">{value}</div>
                </div>
              )
          )}
        </div>
      </div>
    );
  };

  const renderBadges = (badges, setShowBadges) => (
    <div className="space-y-4">
      {badges.length === 0 ? (
        <div className="flex flex-col text-center items-center justify-center p-2 sm:p-4">
          <BiError className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
          <p className="mt-2 text-xs sm:text-sm text-gray-500">
            No achievements yet. Keep trying harder!
          </p>
        </div>
      ) : (
        <>
          <div className="flex  py-2 gap-2 sm:gap-3">
            {badges.slice(0, 3).map((badge) => (
              <div
                key={badge.id}
                className="flex flex-col items-center justify-center text-center"
              >
                <Medal type={badge.type} content={badge.name} size="medium" />
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowBadges(true)}
            className="w-full mt-2 py-2 sm:py-3 px-2 sm:px-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors text-xs sm:text-sm font-medium flex items-center justify-center"
          >
            <span>View all</span>
            <FaChevronRight className="w-2 h-2 sm:w-2.5 sm:h-2.5 ml-1" />
          </button>
        </>
      )}
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
          <FaFire className="hidden md:flex text-orange-500 mr-3 text-xl" />
          <div>
            <div className="text-xs md:text-sm text-emerald-300">
              Current Streak
            </div>
            <div className="font-bold text-md md:text-lg">
              {activityData.currentStreak} days
            </div>
          </div>
        </div>
        <div className="flex items-center bg-gradient-to-br from-emerald-800/80 to-emerald-900/80 p-3 rounded-lg">
          <FaFire className="hidden md:flex text-red-500 mr-3 text-xl" />
          <div>
            <div className="text-xs md:text-sm text-emerald-300">
              Longest Streak
            </div>
            <div className="font-bold text-md md:text-lg">
              {activityData.longestStreak} days
            </div>
          </div>
        </div>
        <div className="flex items-center bg-gradient-to-br from-emerald-800/80 to-emerald-900/80 p-3 rounded-lg">
          <FaChartLine className="hidden md:flex text-emerald-400 mr-3 text-xl" />
          <div>
            <div className="text-xs md:text-sm text-emerald-300">
              Daily Average
            </div>
            <div className="font-bold text-md md:text-lg">
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
      </div>
    </motion.div>
  );

  const renderProfileCard = (profile, otherProfile, setShowBadges) => (
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

          <p className="text-ellipsis text-center text-sm italic mt-2 text-emerald-100 bg-emerald-950/30 px-4 py-2 rounded-full mx-auto">
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
            {renderBadges(profile.badges, setShowBadges)}
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
    <div className="min-h-screen  text-white">
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

      {loading ? (
        <div className="p-6 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <FaSpinner className="animate-spin text-4xl text-gfgsc-green" />
            <p className="text-gray-600">Loading resource...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <UserSelector
                selectedUser={leftProfile}
                label="Select First Profile"
                allUsers={users}
                currentUserRole={currentUserIdandRole.role}
                side="left"
                fetchProfileData={fetchProfileData}
              />
              <UserSelector
                selectedUser={rightProfile}
                label="Select Second Profile"
                allUsers={users}
                currentUserRole={currentUserIdandRole.role}
                side="right"
                fetchProfileData={fetchProfileData}
              />
            </div>
            <div className="flex flex-col md:flex-row gap-8">
              {leftProfileLoading ? (
                <div className="p-6 flex-1 items-center justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <FaSpinner className="animate-spin text-4xl text-gfgsc-green" />
                  </div>
                </div>
              ) : (
                <div className="flex-1">
                  {renderProfileCard(
                    leftProfile,
                    rightProfile,
                    setShowLeftBadges
                  )}
                </div>
              )}

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
              {rightProfileLoading ? (
                <div className="p-6 flex-1 items-center justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <FaSpinner className="animate-spin text-4xl text-gfgsc-green" />
                  </div>
                </div>
              ) : (
                <div className="flex-1">
                  {renderProfileCard(
                    rightProfile,
                    leftProfile,
                    setShowRightBadges
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Add Badge Popups */}
          <CustomDialog
            open={showLeftBadges}
            onClose={() => setShowLeftBadges(false)}
          >
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-8">
              All Achievements - {leftProfile.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              {leftProfile.badges.map((badge) => (
                <div
                  key={badge.id}
                  className="flex flex-col items-center text-center"
                >
                  <Medal
                    type={badge.type}
                    content={badge.name}
                    size="large"
                    labelClassName="mt-3 sm:mt-4 font-medium text-sm sm:text-base"
                  />
                  <div className="mt-3 sm:mt-4 space-y-1">
                    <div className="text-xs sm:text-sm text-gray-500">
                      {badge.date}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
                      {badge.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CustomDialog>

          <CustomDialog
            open={showRightBadges}
            onClose={() => setShowRightBadges(false)}
          >
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-8">
              All Achievements - {rightProfile.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              {rightProfile.badges.map((badge) => (
                <div
                  key={badge.id}
                  className="flex flex-col items-center text-center"
                >
                  <Medal
                    type={badge.type}
                    content={badge.name}
                    size="large"
                    labelClassName="mt-3 sm:mt-4 font-medium text-sm sm:text-base"
                  />
                  <div className="mt-3 sm:mt-4 space-y-1">
                    <div className="text-xs sm:text-sm text-gray-500">
                      {badge.date}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
                      {badge.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CustomDialog>
        </>
      )}
    </div>
  );
};

export default ProfileComparison;
