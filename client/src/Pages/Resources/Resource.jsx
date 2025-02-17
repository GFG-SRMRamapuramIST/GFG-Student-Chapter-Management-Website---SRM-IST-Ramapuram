import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

// Importing Icons
import {
  FaCalendarAlt,
  FaListOl,
  FaTrash,
  FaPlus,
  FaSpinner,
  FaExternalLinkAlt,
  FaArrowLeft,
  FaPencilAlt,
} from "react-icons/fa";
import { BiChevronLeft } from "react-icons/bi";

import { platformColors, platformIcons } from "../../Constants";
import { AddProblemModal, EditResourceModal } from "../../Components";
import { ToastMsg } from "../../Utilities";

// Importing APIs
import { CoreMemberServices } from "../../Services";

const Resource = () => {
  const { id } = useParams();
  const {
    fetchAllQuestionsOfResourceFunction,
    addQuestionToResourceFunction,
    deleteQuestionFromResourceFunction,
  } = CoreMemberServices();

  const [isLoading, setIsLoading] = useState(true);
  const [resource, setResource] = useState(null);
  const [problems, setProblems] = useState([]);

  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [showDelete, setShowDelete] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const getAllQuestionsOfResourceHandler = async () => {
    try {
      setIsLoading(true);

      const response = await fetchAllQuestionsOfResourceFunction({
        resourceId: id,
        difficulty: selectedDifficulty,
        platform: selectedPlatform,
      });

      //console.log(response);
      if (response.status == 200) {
        setResource(response.data.resourceInfo);
        setProblems(response.data.questions);
      } else {
        ToastMsg(response.response.data.message, "error");
        console.log(response.response.data.message);
      }
    } catch (error) {
      ToastMsg("Internal Server Error!", "error");
      console.error("Fetch All Questions of a Resource Error: ", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      await getAllQuestionsOfResourceHandler();
    };

    fetchQuestions();
  }, [selectedDifficulty, selectedPlatform]);

  // ******** Resource's Question Handlers ********

  const handleEditResource = (updatedData) => {
    console.log("Updating resource:", {
      resourceId: id,
      ...updatedData,
    });
    // Add your API call here
  };

  const handleDeleteResource = () => {
    console.log("Deleting resource:", id);
    // Add your API call here
  };

  // Deleting a question from a resource
  const handleDelete = async (problemId) => {
    //console.log("Deleting problem with ID:", problemId);
    try {
      const response = await deleteQuestionFromResourceFunction({
        resourceId: id,
        questionId: problemId,
      });
      //console.log(response);
      if (response.status == 200) {
        ToastMsg(response.data.message, "success");
      } else {
        ToastMsg(response.response.data.message, "error");
        console.log(response.response.data.message);
      }
    } catch (error) {
      ToastMsg("Internal Server Error!", "error");
      console.error("Delete a Questions to a Resource Error: ", error.message);
    } finally {
      getAllQuestionsOfResourceHandler();
    }
  };

  // Adding a question to a resource
  const handleAdd = async (newProblem) => {
    //console.log("Adding new problem:", newProblem);
    try {
      const response = await addQuestionToResourceFunction({
        resourceId: id,
        title: newProblem.title,
        link: newProblem.link,
        difficulty: newProblem.difficulty,
        platform: newProblem.platform,
      });
      //console.log(response);
      if (response.status == 200) {
        ToastMsg(response.data.message, "success");
      } else {
        ToastMsg(response.response.data.message, "error");
        console.log(response.response.data.message);
      }
    } catch (error) {
      ToastMsg("Internal Server Error!", "error");
      console.error("Add a Questions to a Resource Error: ", error.message);
    } finally {
      getAllQuestionsOfResourceHandler();
    }
  };
  // ******** Resource's Question Handlers END ********

  // Loading state check
  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <FaSpinner className="animate-spin text-4xl text-gfgsc-green" />
          <p className="text-gray-600">Loading resource...</p>
        </div>
      </div>
    );
  }

  // Resource Not Found State
  if (!resource) {
    return (
      <div className=" p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Resource not found
          </h2>
          <p className="text-gray-600 mb-4">
            {`The resource you're looking for doesn't exist.`}
          </p>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-4 py-2 bg-gfgsc-green text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      {/* Breadcrumb */}
      <div className="mx-auto mb-6">
        <div className="flex items-center text-sm">
          <button
            onClick={() => window.history.back()}
            className="text-gray-600 hover:text-gfgsc-green transition-colors flex items-center justify-center"
          >
            <BiChevronLeft className="mr-2" />
            Back to Resources
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className=" mx-auto mb-8">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-4">
                {resource.platforms.map((platform) => {
                  const PlatformIcon = platformIcons[platform];
                  const color =
                    platformColors[platform.toLowerCase()] || "#6B7280";

                  return (
                    <div
                      key={platform}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium duration-200 hover:scale-105"
                      style={{
                        borderColor: color,
                        color: color,
                        borderWidth: "1px",
                      }}
                    >
                      <PlatformIcon className="mr-1 text-sm" />
                      {platform}
                    </div>
                  );
                })}
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {resource.title}
              </h1>
              <p className="text-gray-600 text-lg mb-6 max-w-3xl">
                {resource.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center px-4 py-2 bg-gray-50 rounded-lg">
                  <FaCalendarAlt className="mr-2 text-gfgsc-green" />
                  Updated{" "}
                  {new Date(resource.lastModifiedAt).toLocaleDateString()}
                </div>
                <div className="flex items-center px-4 py-2 bg-gray-50 rounded-lg">
                  <FaListOl className="mr-2 text-gfgsc-green" />
                  {resource.totalQuestions} Problems
                </div>
              </div>
            </div>

            {/* quick actions div */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditModalOpen(true)}
                className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
              >
                <FaPencilAlt />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDeleteResource}
                className="p-3 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
              >
                <FaTrash />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Problems Section */}
      <div className=" mx-auto">
        {/* Filters and Actions */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg border border-gray-100">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-4">
              {/* Difficulty Filter */}
              <div className="flex gap-2 bg-gray-50 p-1 rounded-lg">
                {["all", "easy", "medium", "hard"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedDifficulty(filter)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      selectedDifficulty === filter
                        ? "bg-gfgsc-green text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>

              {/* Platform Filter */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedPlatform("all")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    selectedPlatform === "all"
                      ? "bg-gfgsc-green text-white shadow-md"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  All Platforms
                </button>
                {resource.platforms.map((platform) => {
                  const PlatformIcon = platformIcons[platform];
                  const colors = platformColors[platform.toLowerCase()] || {
                    bg: "#6B7280",
                    text: "white",
                  };

                  return (
                    <button
                      key={platform}
                      onClick={() => setSelectedPlatform(platform)}
                      style={
                        selectedPlatform === platform
                          ? { backgroundColor: colors.bg, color: colors.text }
                          : {}
                      }
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2
                        ${
                          selectedPlatform === platform
                            ? "shadow-md"
                            : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                      <PlatformIcon className="text-sm" />
                      {platform}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDelete(!showDelete)}
                className={`p-3 rounded-lg transition-colors ${
                  showDelete
                    ? "bg-red-100 text-red-600"
                    : "bg-gray-50 hover:bg-gray-100 text-gray-600"
                }`}
              >
                <FaTrash />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gfgsc-green text-white rounded-lg hover:bg-emerald-600 transition-colors shadow-lg shadow-gfgsc-green/20"
              >
                <FaPlus />
                Add Problem
              </motion.button>
            </div>
          </div>
        </div>

        {/* Problems Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    #
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Problem
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Difficulty
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Platform
                  </th>
                  {showDelete && (
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                      Action
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <AnimatePresence>
                  {problems.map((problem, idx) => {
                    const PlatformIcon = platformIcons[problem.platform];
                    const color =
                      platformColors[problem.platform.toLowerCase()] ||
                      "#6B7280";

                    return (
                      <motion.tr
                        key={problem.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2, delay: idx * 0.05 }}
                        className="hover:bg-gray-50 transition-colors group"
                      >
                        <td className="px-6 py-4 text-gray-500">{idx + 1}</td>
                        <td className="px-6 py-4">
                          <a
                            href={problem.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-gray-900 hover:text-gfgsc-green transition-colors flex items-center gap-2 group"
                          >
                            {problem.questionTitle}
                            <FaExternalLinkAlt className="opacity-0 group-hover:opacity-100 transition-opacity text-sm" />
                          </a>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                              problem.difficulty === "EASY"
                                ? "bg-green-100 text-green-800"
                                : problem.difficulty === "MEDIUM"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {problem.difficulty}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium duration-200 hover:scale-105"
                            style={{
                              borderColor: color,
                              color: color,
                              borderWidth: "1px",
                            }}
                          >
                            <PlatformIcon className="mr-1 text-sm" />
                            {problem.platform}
                          </div>
                        </td>
                        {showDelete && (
                          <td className="px-6 py-4 text-right">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDelete(problem.id)}
                              className="text-red-500 hover:text-red-600 p-2"
                            >
                              <FaTrash />
                            </motion.button>
                          </td>
                        )}
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddProblemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAdd}
        platforms={resource.platforms}
      />

      <EditResourceModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        resource={resource}
        onEdit={handleEditResource}
      />
    </motion.div>
  );
};

export default Resource;
