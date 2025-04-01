import ReactGA from "react-ga4";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Importing Icons
import { FaSearch, FaPlus, FaSpinner } from "react-icons/fa";

import { Pagination, ToastMsg } from "../../Utilities";
import { CreatePracticeSetModal, PracticeSetCard } from "../../Components";

// Importing APIs
import { CoreMemberServices } from "../../Services";

const Practice = () => {
  // Google Analytics tracking
  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: "gfgsrm-tech.vercel.app/practice",
      title: "Practice Page",
    });
  }, []);

  const { createResourceFunction, fetchAllResourcesFunction } =
    CoreMemberServices();

  const [loading, setLoading] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);

  // ****************** Fetch all Resources Handlers Starts here *****************
  // Search Logic
  const [searchResource, setSearchResource] = useState("");
  const [debouncedSearchResource, setDebouncedSearchResource] =
    useState(searchResource);

  // Debounce mechanism for serach input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchResource(searchResource);
    }, 1000); // 1s debounce time

    return () => {
      clearTimeout(handler);
    };
  }, [searchResource]);

  // Pagination Logic
  const [pageInfo, setPageInfo] = useState({
    currentPage: 1,
    totalPages: null,
  });

  const setCurrentPage = (page) => {
    setPageInfo((prev) => ({ ...prev, currentPage: page }));
  };

  const [resources, setResources] = useState([]);

  // Fetch all resources
  const fetchAllResourcesHandler = async () => {
    setLoading(true);
    try {
      const response = await fetchAllResourcesFunction({
        page: pageInfo.currentPage,
        search: debouncedSearchResource,
      });

      if (response.status === 200) {
        const { currentPage, totalPages } = response.data;
        setPageInfo({ currentPage, totalPages });

        const formattedResources = response.data.data.map((resource) => ({
          id: resource.id, // Unique ID
          title: resource.title,
          platforms: resource.platforms || [],
          count: resource.totalQuestions,
          lastUpdated: resource.lastUpdatedAt.split("T")[0], // Extract date part
          description: resource.description,
        }));

        setResources(formattedResources);
      } else {
        ToastMsg(response.response.data.message, "error");
        console.log(response.response.data.message);
      }
    } catch (error) {
      ToastMsg("Internal Server Error!", "error");
      console.error("Fetch All Resources Error: ", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchResources = async () => {
      await fetchAllResourcesHandler();
    };

    fetchResources();
  }, [pageInfo.currentPage, debouncedSearchResource]);

  // ******************** Fetch all Resources Handler end's here ****************

  // Resources Creating Handlers
  const handleCreateResource = async (data) => {
    //console.log("Creating resource:", data);
    try {
      const response = await createResourceFunction(data);
      if (response.status == 200) {
        ToastMsg(response.data.message, "success");
      } else {
        ToastMsg(response.response.data.message, "error");
        console.log(response);
      }
    } catch (error) {
      ToastMsg("Internal Server Error", "error");
      console.log("Internal server error: ", error);
    } finally {
      fetchAllResourcesHandler();
    }
  };

  return (
    <div className="min-h-screen p-3 sm:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Search and Create Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 sm:mb-12 bg-white p-4 sm:p-6 rounded-2xl shadow-sm">
          <div className="relative w-full sm:max-w-md">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search practice set..."
              value={searchResource}
              onChange={(e) => setSearchResource(e.target.value)}
              className="w-full pl-12 pr-4 py-2 sm:py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gfgsc-green transition-all duration-200"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-gfgsc-green to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 w-full sm:w-auto shadow-lg shadow-gfgsc-green/20"
          >
            <FaPlus className="text-sm" />
            <span>Create Resource</span>
          </motion.button>
        </div>

        {/* Resources Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <FaSpinner className="animate-spin text-3xl sm:text-4xl text-gfgsc-green" />
          </div>
        ) : resources.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64 text-center">
            <div className="text-gray-400 text-lg sm:text-xl mb-2">
              No resources found
            </div>
            <div className="text-gray-500 text-sm sm:text-base">
              Try adjusting your search or create a new resource
            </div>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              layout
            >
              {resources.map((resource) => (
                <PracticeSetCard key={resource.id} resource={resource} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Pagination */}
        {!loading && resources.length > 0 && pageInfo.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination
              currentPage={pageInfo.currentPage}
              totalPages={pageInfo.totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}

        {/* Create Resource Modal */}
        <CreatePracticeSetModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateResource}
        />
      </div>
    </div>
  );
};

export default Practice;
