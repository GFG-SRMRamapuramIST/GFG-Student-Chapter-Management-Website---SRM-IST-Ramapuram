import { motion } from "framer-motion";

const LeaderboardSection = ({ top5Users }) => {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm">
      <h3 className="font-semibold text-gfg-black text-base sm:text-lg mb-2 sm:mb-4">
        Top Performers
      </h3>
      <div className="space-y-1">
        {top5Users.map((user) => (
          <motion.div
            key={user.id}
            whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
            className="flex items-center justify-between p-2 sm:p-3 rounded-xl hover:bg-gray-50 transition-all duration-300"
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
        ))}
      </div>
    </div>
  );
};

export default LeaderboardSection;