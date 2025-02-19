import { motion } from "framer-motion";

const StatCard = ({ icon: Icon, label, value, change }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
  >
    <div className="flex items-center justify-between mb-3">
      <div className="p-2.5 rounded-xl bg-gfgsc-green-200/50">
        <Icon className="text-xl text-gfgsc-green" />
      </div>
      {change && (
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
    <h4 className="text-3xl font-bold text-gfg-black mb-1">{value}</h4>
    <p className="text-sm text-gray-600">{label}</p>
  </motion.div>
);

export const StatsSection = ({ stats }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default StatsSection;
