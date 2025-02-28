import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Importing Icons
import { FaSpinner } from "react-icons/fa";

const StatCard = ({ icon: Icon, label, value, change, loading }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
  >
    <div className="flex items-center justify-between mb-3">
      <div className="p-2 md:p-2.5 rounded-xl bg-gfgsc-green-200/50">
        <Icon className="text-lg sm:text-xl text-gfgsc-green" />
      </div>
      {change && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-1 text-sm font-medium ${
            change > 0 ? "text-gfgsc-green" : "text-red-500"
          }`}
        >
          {change > 0 ? "↑" : "↓"} {Math.abs(change)}%
        </motion.div>
      )}
    </div>

    {/* Show spinner if loading, otherwise show value */}
    <h4 className="text-2xl md:text-3xl font-bold text-gfg-black mb-1">
      {loading ? (
        <FaSpinner className="inline animate-spin text-gfgsc-green" />
      ) : (
        value
      )}
    </h4>
    <p className="text-xs sm:text-sm text-gray-600">{label}</p>
  </motion.div>
);

export const StatsSection = ({ stats }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(!stats || stats.length === 0);
  }, [stats]);

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} loading={loading} />
      ))}
    </div>
  );
};

export default StatsSection;
