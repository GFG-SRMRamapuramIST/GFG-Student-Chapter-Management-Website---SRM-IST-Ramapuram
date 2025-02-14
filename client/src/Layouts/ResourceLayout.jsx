import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

const ResourceLayout = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Motivation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Resources</h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Master Your Coding Journey.
          </p>
        </div>
      </motion.div>

      {/* Render child routes */}
      <Outlet />
    </div>
  );
};

export default ResourceLayout;
