import { FaBookOpen, FaCalendarAlt, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const ResourceCard = ({ resource }) => {
  const usedPlatforms = resource.platforms || [];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <Link to={`/resources/${resource.id}`}>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            {usedPlatforms.map((platform) => {
              const PlatformIcon = platformIcons[platform];
              return PlatformIcon ? (
                <div
                  key={platform}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors"
                >
                  <PlatformIcon className="text-lg text-gfgsc-green" />
                </div>
              ) : null;
            })}
          </div>

          <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-gfgsc-green transition-colors">
            {resource.title}
          </h3>

          <p className="text-gray-600 mb-4 line-clamp-2">
            {resource.description}
          </p>

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

          <div className="mt-4 flex justify-end">
            <motion.div
              className="h-8 w-8 rounded-full bg-gfgsc-green/10 flex items-center justify-center"
              whileHover={{
                scale: 1.1,
                backgroundColor: "rgb(0 137 94 / 0.2)",
              }}
            >
              <FaChevronRight className="text-gfgsc-green" />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ResourceCard;