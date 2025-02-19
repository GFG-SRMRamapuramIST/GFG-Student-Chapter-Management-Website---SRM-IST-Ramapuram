import { motion } from "framer-motion";

const LeaderboardSection = ({top5Users}) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <h3 className="font-semibold text-gfg-black mb-4">Top Performers</h3>
      <div className="space-y-1">
        {top5Users.map((user) => (
          <motion.div
            key={user.id}
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              </div>
              <span className="font-medium text-gfg-black">{user.name}</span>
            </div>
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gfgsc-green-200/60 text-gfgsc-green">
              {user.points}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LeaderboardSection;
