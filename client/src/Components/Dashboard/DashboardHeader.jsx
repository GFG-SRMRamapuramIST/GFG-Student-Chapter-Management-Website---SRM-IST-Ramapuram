import { MdNotifications, MdNotificationsOff } from "react-icons/md";
import { motion } from "framer-motion";

const DashboardHeader = ({ name, notificationsEnabled, onToggleNotifications }) => (
  <div className="flex justify-between items-start mb-8">
    <div>
      <h1 className="text-4xl font-bold text-gfg-black mb-2">Hey {name}! 👋</h1>
      <p className="text-gray-600">
        Ready to conquer some coding challenges today?
      </p>
    </div>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onToggleNotifications}
      className={`
          relative p-3 rounded-xl shadow-sm transition-colors duration-300
          ${notificationsEnabled ? "bg-white" : "bg-gray-100"}
        `}
    >
      {notificationsEnabled ? (
        <MdNotifications className="text-xl text-gfgsc-green" />
      ) : (
        <MdNotificationsOff className="text-xl text-gray-400" />
      )}
      {notificationsEnabled && (
        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
      )}
    </motion.button>
  </div>
);

export default DashboardHeader;
