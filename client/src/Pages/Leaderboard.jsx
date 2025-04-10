import ReactGA from "react-ga4";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Importing the Icons
import {
  IoPersonOutline,
  IoWarningOutline,
  IoCloseOutline,
} from "react-icons/io5";
import { FaSpinner, FaSearch } from "react-icons/fa";

import { LeaderboardHero, LeaderboardTable } from "../Components";

import { Pagination, ToastMsg } from "../Utilities";

// Importing the API
import { UserServices } from "../Services";
import { GfgCoin } from "../Assets";

const Leaderboard = () => {
  // Google Analytics tracking
  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: "gfgsrm-tech.vercel.app/leaderboard",
      title: "Leaderboard Page",
    });
  }, []);

  const { fetchLeaderboardDataFunction } = UserServices();

  const [activeTab, setActiveTab] = useState("individual");

  const [searchUser, setSearchUser] = useState("");
  const [debouncedSearchUser, setDebouncedSearchUser] = useState(searchUser);

  const [searchQuery, setSearchQuery] = useState("");

  const [leaderboardData, setLeaderboardData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [topThreeUsers, setTopThreeUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [minimumPassingMark, setMinimumPassingMarks] = useState(0);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setLoading(true);
      try {
        const response = await fetchLeaderboardDataFunction({
          page: currentPage,
          limit: itemsPerPage,
          search: debouncedSearchUser,
        });
        //console.log(response);

        if (response.status == 200) {
          setMinimumPassingMarks(response.data.minimumPassingMark);

          const formattedData = response.data.data.map((user) => ({
            id: user._id,
            rank: user.currentRank ?? -1,
            name: user.name,
            pfp: user.profilePicture || "https://placehold.co/100x100",
            position: user.role,
            academicYear: `${user.academicYear}${getYearSuffix(
              user.academicYear
            )} Year`,
            points: user.totalQuestionSolved,
          }));

          setLeaderboardData(formattedData);
          setFilteredData(formattedData); // Initialize filtered data with all data
          if (currentPage == 1 && debouncedSearchUser == "") {
            setTopThreeUsers(formattedData.slice(0, 3));
          }
          setTotalPages(response.data.totalPages);
        }
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
        ToastMsg("Error fetching leaderboard data", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [currentPage, debouncedSearchUser]);

  // Debounce mechanism for serach input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchUser(searchUser);
    }, 1000); // 1s debounce time

    return () => {
      clearTimeout(handler);
    };
  }, [searchUser]);

  const getYearSuffix = (year) => {
    if (year === 1) return "st";
    if (year === 2) return "nd";
    if (year === 3) return "rd";
    return "th";
  };

  const tabs = [
    {
      id: "individual",
      icon: <IoPersonOutline className="w-5 h-5" />,
      label: "Individual",
    },
  ];

  const handlePageChange = (page) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      setCurrentPage(page);
    }, 300);
  };

  // Clear search and reset data
  const clearSearch = () => {
    setSearchQuery("");
    setFilteredData(leaderboardData);
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

        {loading ? (
          <div className="p-6 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <FaSpinner className="animate-spin text-4xl text-gfgsc-green" />
              <p className="text-gray-600">Loading leaderboard...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Search Bar */}
            <div className="flex justify-center mb-2">
              <div className="relative w-64 md:w-96 lg:w-1/2">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 rounded-full border border-green-300 focus:border-gfgsc-green focus:outline-none focus:ring-2 focus:ring-gfgsc-green/20 shadow-sm text-sm"
                />
                <FaSearch className="absolute left-3.5 top-2.5 text-green-500" />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    <IoCloseOutline className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <LeaderboardHero topThree={topThreeUsers} isTeam={false} />

                {loading ? (
                  <div className="flex justify-center my-8">
                    <FaSpinner className="animate-spin text-2xl text-gfgsc-green" />
                  </div>
                ) : (
                  <>
                    <LeaderboardTable
                      data={filteredData}
                      isTeam={false}
                      minimumPassingMark={minimumPassingMark}
                    />
                    {!searchQuery && (
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                    )}
                  </>
                )}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="mt-6 md:mt-8 sm:px-4 md:px-16"
              >
                <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 rounded-lg shadow-md overflow-hidden">
                  <div className="flex flex-col md:flex-row items-start p-4">
                    <div className="flex justify-center md:block mb-3 md:mb-0 md:mr-4">
                      <div className="flex-shrink-0 bg-red-500 text-white p-2 rounded-full">
                        <IoWarningOutline className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="flex-1 w-full">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-semibold text-red-800">
                          Warning: Performance Notice
                        </h4>
                      </div>

                      <p className="text-xs md:text-sm text-red-700">
                        It has been decided by the admin that every individual
                        must score a minimum of{" "}
                        <span className="font-semibold inline-flex items-center">
                          {minimumPassingMark}
                          <img
                            src={GfgCoin}
                            alt="GfgCoin"
                            className="w-3 h-3 md:w-4 md:h-4 ml-1"
                          />
                        </span>{" "}
                        points this month to pass. Otherwise, they will be
                        automatically removed from the website at the end of the
                        month.{" "}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Leaderboard;