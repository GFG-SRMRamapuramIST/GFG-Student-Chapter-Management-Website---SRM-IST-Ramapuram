import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaBookOpen,
  FaCalendarAlt,
  FaChevronRight,
  FaSearch,
  FaPlus,
} from "react-icons/fa";
import { platformIcons, resources } from "../../Constants";
import { Pagination } from "../../Utilities";

const CreateResourceModal = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title });
    setTitle("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Create New Resource
            </h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Resource Title"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gfgsc-green mb-6"
                required
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-gfgsc-green text-white rounded-xl hover:bg-gfgsc-green-600 transition-colors"
                >
                  Create Resource
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

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

const ResourcesPagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center items-center gap-2 mt-12">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <motion.button
          key={page}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors
            ${
              currentPage === page
                ? "bg-gfgsc-green text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
        >
          {page}
        </motion.button>
      ))}
    </div>
  );
};

const AllResources = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const itemsPerPage = 6;

  const filteredResources = resources.filter(
    (resource) =>
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);
  const currentResources = filteredResources.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCreateResource = (data) => {
    // Handle resource creation
    console.log("Creating resource:", data);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Search and Create Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-12">
          <div className="relative w-full md:w-96">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gfgsc-green"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gfgsc-green text-white rounded-xl hover:bg-gfgsc-green-600 transition-colors w-full md:w-auto justify-center"
          >
            <FaPlus />
            <span>Create Resource</span>
          </motion.button>
        </div>

        {/* Resources Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          layout
        >
          {currentResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Create Resource Modal */}
      <CreateResourceModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateResource}
      />
    </div>
  );
};

export default AllResources;
