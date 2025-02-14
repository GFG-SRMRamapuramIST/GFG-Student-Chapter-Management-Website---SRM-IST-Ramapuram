import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaBookOpen,
  FaCalendarAlt,
  FaChevronRight,
  FaCode,
} from "react-icons/fa";
import { platformIcons, resources } from "../../Constants";

const AllResources = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const getCategoryColor = (category) => {
    switch (category.toLowerCase()) {
      case "noob":
        return "from-green-400 to-green-500";
      case "amateur":
        return "from-blue-400 to-blue-500";
      case "pro":
        return "from-purple-400 to-purple-500";
      default:
        return "from-gray-400 to-gray-500";
    }
  };

  return (
    <div className="min-h-screen p-6">
      {/* Category Filter */}
      <div className="flex justify-center gap-4 mb-12">
        {["all", "noob", "amateur", "pro"].map((category) => (
          <motion.button
            key={category}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-2 rounded-full font-medium transition-all
              ${
                selectedCategory === category
                  ? "bg-gfgsc-green text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </motion.button>
        ))}
      </div>

      {/* Resources Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
        layout
      >
        {resources
          .filter(
            (resource) =>
              selectedCategory === "all" ||
              resource.category === selectedCategory
          )
          .map((resource) => {
            const PlatformIcon = platformIcons[resource.platform] || FaCode;
            return (
              <motion.div
                key={resource.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <Link to={`/resources/${resource.category}/${resource.id}`}>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <PlatformIcon className="text-2xl text-gfgsc-green" />
                      <span
                        className={`text-sm font-medium px-3 py-1 rounded-full bg-gradient-to-r ${getCategoryColor(
                          resource.category
                        )} text-white`}
                      >
                        {resource.category.toUpperCase()}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {resource.title}
                    </h3>

                    <p className="text-gray-600 mb-4">{resource.description}</p>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <FaBookOpen className="mr-2" />
                        {resource.count} Problems
                      </div>
                      <div className="flex items-center">
                        <FaCalendarAlt className="mr-2" />
                        {new Date(resource.lastUpdated).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end text-gfgsc-green">
                      <FaChevronRight />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
      </motion.div>

      {/* Create New Resource Button (Admin only) */}
      <motion.div
        className="fixed bottom-8 right-8"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <button className="bg-gfgsc-green text-white p-4 rounded-full shadow-lg">
          <FaBookOpen className="text-2xl" />
        </button>
      </motion.div>
    </div>
  );
};

export default AllResources;
