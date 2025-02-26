import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Importing the Icons
import { IoPersonOutline } from "react-icons/io5";
import { FaSpinner } from "react-icons/fa";

import { LeaderboardHero, LeaderboardTable } from "../Components";

import { Pagination, ToastMsg } from "../Utilities";

// Importing the API
import { UserServices } from "../Services";

const Leaderboard = () => {
  const { fetchLeaderboardDataFunction } = UserServices();

  const [activeTab, setActiveTab] = useState("individual");

  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setLoading(true);
      try {
        const response = await fetchLeaderboardDataFunction({
          page: currentPage,
          limit: itemsPerPage,
        });
        //console.log(response);

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
              <p className="text-gray-600">Loading resource...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-center self-center mx-auto space-x-4 p-3 rounded-lg mb-2 w-fit bg-gfgsc-green-200">
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
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <LeaderboardHero
                  topThree={leaderboardData.slice(0, 3)}
                  isTeam={false}
                />
                <LeaderboardTable data={leaderboardData} isTeam={false} />
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Leaderboard;
