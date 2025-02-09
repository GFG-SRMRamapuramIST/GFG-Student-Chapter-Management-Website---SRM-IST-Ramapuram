import { FaLaptopCode, FaUserGraduate } from "react-icons/fa";
import { SiGeeksforgeeks } from "react-icons/si";
import { motion } from "framer-motion";

// Decorative Background Component
const AuthBackground = ({ isRight }) => (
  <motion.div
    initial={{ x: isRight ? "100vh" : "-100vh" }}
    animate={{ x: 0 }}
    transition={{ type: "spring", stiffness: 100, damping: 20 }}
    className={`w-1/2 hidden lg:flex flex-col items-center justify-center bg-gradient-to-br from-gfg-green to-gfgsc-green p-12 text-white space-y-8 z-10`}
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.2 }}
      className="text-6xl"
    >
      <SiGeeksforgeeks />
    </motion.div>
    <div className="space-y-4 text-center">
      <h2 className="text-3xl font-bold">Welcome to GFGSC</h2>
      <p className="text-gfg-white/90 max-w-md">
        Join our community of passionate developers and tech enthusiasts. Access
        exclusive resources, events, and collaborate with fellow members.
      </p>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="flex items-center space-x-2 bg-white/10 p-3 rounded-lg"
      >
        <FaLaptopCode className="text-2xl" />
        <span>Coding Events</span>
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="flex items-center space-x-2 bg-white/10 p-3 rounded-lg"
      >
        <FaUserGraduate className="text-2xl" />
        <span>Learn & Grow</span>
      </motion.div>
    </div>
  </motion.div>
);

export default AuthBackground;
