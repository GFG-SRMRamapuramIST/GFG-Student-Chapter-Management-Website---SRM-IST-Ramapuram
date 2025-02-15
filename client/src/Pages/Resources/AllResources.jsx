import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaPlus,
} from "react-icons/fa";
import { resources } from "../../Constants";
import { Pagination } from "../../Utilities";
import { CreateResourceModal, ResourceCard } from "../../Components";

const AllResources = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Search Logic
  const [searchQuery, setSearchQuery] = useState("");
  const filteredResources = resources.filter(
    (resource) =>
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination Logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);
  const currentResources = filteredResources.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Resources Handlers
  const handleCreateResource = (data) => {
    // Handle resource creation
    console.log("Creating resource:", data);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto">
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
