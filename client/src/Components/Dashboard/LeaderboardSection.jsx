import { useEffect, useState } from "react";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Importing Icons
import { FaSpinner } from "react-icons/fa";

const LeaderboardSection = ({ top5Users }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(!top5Users || top5Users.length === 0);
  }, [top5Users]);

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm">
      <h3 className="font-semibold text-gfg-black text-base sm:text-lg mb-2 sm:mb-4">
        Top Performers
      </h3>
      {loading ? (
        <div className="p-6 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <FaSpinner className="animate-spin text-4xl text-gfgsc-green" />
            <p className="text-gray-600">Loading ...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-1">
          {top5Users.map((user) => (
            <Link to={`/profile/${user.id}`} key={user.id} className="block">
              <motion.div
                key={user.id}
                whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                className="flex items-center justify-between p-2 sm:p-3 rounded-xl hover:bg-gray-50 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className="relative flex-shrink-0">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover"
                    />
                  </div>
                  <span className="font-medium text-gfg-black text-sm sm:text-base truncate">
                    {user.name}
                  </span>
                </div>
                <span className="px-2 py-1 ml-2 inline-flex text-xs leading-4 font-semibold rounded-full bg-gfgsc-green-200/60 text-gfgsc-green flex-shrink-0">
                  {user.points}
                </span>
              </motion.div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeaderboardSection;
