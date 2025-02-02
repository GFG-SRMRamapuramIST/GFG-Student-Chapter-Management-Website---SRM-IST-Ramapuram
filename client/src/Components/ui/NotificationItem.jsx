import { motion } from "framer-motion";

const NotificationItem = ({ message }) => (
    <motion.div
      whileHover={{ x: 2 }}
      className="flex items-center gap-3 p-3 hover:bg-gfgsc-green-200/20 rounded-xl cursor-pointer"
    >
      
      <div className="w-2 h-2 bg-gfgsc-green rounded-full" />
      <p className="text-sm text-gray-600 flex-1">{message}</p>
    </motion.div>
  );

export default NotificationItem;