import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Importing the Icons
import { IoPersonOutline, IoWarningOutline } from "react-icons/io5";
import { FaSpinner } from "react-icons/fa";

import { LeaderboardHero, LeaderboardTable } from "../Components";

import { Pagination, ToastMsg } from "../Utilities";

// Importing the API
import { UserServices } from "../Services";
import { GfgCoin } from "../Assets";
import { GoDotFill } from "react-icons/go";

const Leaderboard = () => {
  const { fetchLeaderboardDataFunction } = UserServices();

  const [activeTab, setActiveTab] = useState("individual");

  const [leaderboardData, setLeaderboardData] = useState([]);
  const [topThreeUsers, setTopThreeUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const [passingPercentage, setPassingPercentage] = useState(30);
  const [perDayPracticePoint, setPerDayPracticePoint] = useState(1);
  const [perContestPoint, setPerContestPoint] = useState(0);
  const [minimumPassingMark, setMinimumPassingMark] = useState(30);

  const calculatePassingMarks = () => {
    const perMonthmarks = 30 * perDayPracticePoint + 4 * perContestPoint;
    const minPassingMark = Math.floor(
      (passingPercentage / 100) * perMonthmarks
    );
    setMinimumPassingMark(minPassingMark);
  };

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setLoading(true);
      try {
        const response = await fetchLeaderboardDataFunction({
          page: currentPage,
          limit: itemsPerPage,
        });
        //console.log(response);

        setPassingPercentage(response.data.passingPercentage);
        setPerDayPracticePoint(response.data.perDayPracticePoint);
        setPerContestPoint(response.data.perContestPoint);

        if (response.status == 200) {
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
          if (currentPage == 1) {
            setTopThreeUsers(formattedData.slice(0, 3));
          }
          setTotalPages(response.data.totalPages);
        }
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
        ToastMsg("Error fetching leaderboard data", "error");
      } finally {
        setLoading(false);
        calculatePassingMarks();
      }
    };

    fetchLeaderboardData();
  }, [currentPage]);

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
            {/* <div className="flex justify-center self-center mx-auto space-x-4 p-3 rounded-lg mb-2 w-fit bg-gfgsc-green-200">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200
                  ${
                    activeTab === tab.id
                      ? "bg-gfgsc-green text-white"
                      : "text-gfg-black hover:bg-hover-gray"
                  }
                `}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </motion.button>
              ))}
            </div> */}

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <LeaderboardHero
                  topThree={topThreeUsers}
                  isTeam={false}
                  minimumPassingMark={minimumPassingMark}
                />
                <LeaderboardTable
                  data={leaderboardData}
                  isTeam={false}
                  minimumPassingMark={minimumPassingMark}
                />
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="mt-8 px-16"
              >
                <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 rounded-lg shadow-md overflow-hidden">
                  <div className="flex items-start p-4">
                    <div className="flex-shrink-0 bg-red-500 text-white p-2 rounded-full">
                      <IoWarningOutline className="w-5 h-5" />
                    </div>

                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-red-800">
                          Warning: Performance Notice
                        </h4>
                      </div>

                      <p className="mt-2 text-sm text-red-700">
                        It has been decided by the admin that every individual
                        must score a minimum of{" "}
                        <span className="font-semibold inline-flex items-center">
                          {minimumPassingMark}
                          <img
                            src={GfgCoin}
                            alt="GfgCoin"
                            className="w-4 h-4 ml-1"
                          />
                        </span>{" "}
                        points this month to pass. Otherwise, they will be
                        automatically removed from the website at the end of the
                        month.{" "}
                      </p>

                      <div className="mt-3 bg-white/50 backdrop-blur-sm p-2 rounded border border-red-200">
                        <p className="text-xs text-red-600 italic">
                          The minimum passing score is determined using the
                          following formula:
                        </p>
                        <p className="text-xs text-red-600 italic">
                          <GoDotFill className="inline" /> Expected points per
                          day from practicing questions = {perDayPracticePoint}
                        </p>
                        <p className="text-xs text-red-600 italic">
                          <GoDotFill className="inline" /> Expected points per
                          contest = {perContestPoint}
                        </p>
                        <p className="text-xs text-red-600 italic">
                          <GoDotFill className="inline" /> Passing percentage ={" "}
                          {passingPercentage}%
                        </p>
                        <p className="text-xs text-red-600 italic">
                          Passing score = floor(((30 X {perDayPracticePoint}) +
                          (4 X {perContestPoint})) X {passingPercentage}) ={" "}
                          {minimumPassingMark}
                        </p>
                        <p className="text-xs text-red-600 italic">
                          Here, 30 represents the default number of days in a
                          month (regardless of whether the month has 28, 29, 30,
                          or 31 days), and 4 represents the required number of
                          contests per month (even if more than four contests
                          are available).
                        </p>
                      </div>
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
