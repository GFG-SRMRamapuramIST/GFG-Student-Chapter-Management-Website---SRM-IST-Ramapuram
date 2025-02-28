import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Importing Icons
import { MdNotifications, MdNotificationsOff } from "react-icons/md";
import { FaSpinner } from "react-icons/fa";

const DashboardHeader = ({
  name,
  notificationsEnabled,
  onToggleNotifications,
}) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (name === null || notificationsEnabled === null) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [name, notificationsEnabled]);

  return (
    <div className="flex justify-between items-start mb-8">
      <div>
        <h1 className="text-4xl font-bold text-gfg-black mb-2">
          Hey{" "}
          {loading ? (
            <>
              <FaSpinner className="inline animate-spin text-4xl text-gfgsc-green" />
            </>
          ) : (
            name
          )}
          ! 👋
        </h1>
        <p className="text-gray-600">
          Ready to conquer some coding challenges today?
        </p>
      </div>
      <motion.button
        whileHover={!loading ? { scale: 1.05 } : {}}
        whileTap={!loading ? { scale: 0.95 } : {}}
        onClick={onToggleNotifications}
        disabled={loading}
        className={`
        relative p-3 rounded-xl shadow-sm transition-colors duration-300 flex items-center justify-center
        ${notificationsEnabled ? "bg-white" : "bg-gray-100"}
        ${loading ? "opacity-50 cursor-not-allowed" : ""}
      `}
      >
        {loading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full"
          />
        ) : notificationsEnabled ? (
          <MdNotifications className="text-xl text-gfgsc-green" />
        ) : (
          <MdNotificationsOff className="text-xl text-gray-400" />
        )}

        {notificationsEnabled && !loading && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
        )}
      </motion.button>
    </div>
  );
};

export default DashboardHeader;
