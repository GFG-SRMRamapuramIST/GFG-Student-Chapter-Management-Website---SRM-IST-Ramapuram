import { FaVideo, FaCalendarAlt, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const ResourceCard = ({ resource }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -5 }}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
    >
      <Link to={`/resources/${resource.id}`}>
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-gfgsc-green transition-colors">
            {resource.title}
          </h3>

          <p className="text-gray-600 mb-6 line-clamp-2 text-sm">
            {resource.description}
          </p>

          <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
            <div className="flex items-center">
              <FaVideo className="mr-2 text-gfgsc-green" />
              <span className="font-medium">{resource.videoCount}</span>
              <span className="ml-1">Videos</span>
            </div>
            <div className="flex items-center">
              <FaCalendarAlt className="mr-2 text-gfgsc-green" />
              {new Date(resource.lastUpdated).toLocaleDateString()}
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <motion.div
              className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center"
              whileHover={{
                scale: 1.1,
                backgroundColor: "rgb(59 130 246 / 0.2)",
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