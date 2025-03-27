import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { AddProblemModal, EditPracticeSetModal } from "../../Components";
import { ConfirmationPopup, ToastMsg } from "../../Utilities";

// Importing APIs
import { CoreMemberServices } from "../../Services";

const PracticeSet = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    fetchAllQuestionsOfResourceFunction,
    addQuestionToResourceFunction,
    deleteQuestionFromResourceFunction,
    editResourceFunction,
    deleteResourceFunction,
  } = CoreMemberServices();

  const [isLoading, setIsLoading] = useState(true);
  const [resource, setResource] = useState(null);
  const [problems, setProblems] = useState([]);

  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [showDelete, setShowDelete] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [confirmationState, setConfirmationState] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
    onConfirm: () => {},
  });

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

  // Editing the title and description of a resource
  const handleEditResource = async (updatedData) => {
    try {
      const response = await editResourceFunction({
        resourceId: id,
        title: updatedData.title,
        description: updatedData.description,
      });
      //console.log(response)
      if (response.status == 200) {
        ToastMsg(response.data.message, "success");
      } else {
        console.log(response.response.data.message);
        ToastMsg(response.response.data.message, "error");
      }
    } catch (error) {
      ToastMsg("Internal Server Error!", "error");
      console.error("Edit a Resource Error: ", error.message);
    } finally {
      getAllQuestionsOfResourceHandler();
    }
  };

  // Deleting the complete resource
  const handleDeleteResource = () => {
    setConfirmationState({
      isOpen: true,
      type: "danger",
      title: "Delete Practice Set",
      message:
        "Are you sure you want to delete this practice set? This action cannot be undone.",
      onConfirm: async () => {
        try {
          const response = await deleteResourceFunction({ resourceId: id });
          if (response.status === 200) {
            ToastMsg("Resource deleted successfully!", "success");
            navigate("/practice");
          } else {
            ToastMsg(response.response.data.message, "error");
            console.log(response.response.data.message);
          }
        } catch (error) {
          ToastMsg("Internal Server Error!", "error");
          console.error("Delete Resource Error: ", error.message);
        }
      },
    });
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

  // Adding a new question to a resource
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 sm:p-6 max-w-7xl mx-auto"
    >
      <ConfirmationPopup
        isOpen={confirmationState.isOpen}
        onClose={() =>
          setConfirmationState({ ...confirmationState, isOpen: false })
        }
        onConfirm={confirmationState.onConfirm}
        type={confirmationState.type}
        title={confirmationState.title}
        message={confirmationState.message}
      />
      {/* Breadcrumb */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center text-sm">
          <button
            onClick={() => window.history.back()}
            className="text-gray-600 hover:text-gfgsc-green transition-colors flex items-center justify-center"
          >
            <BiChevronLeft className="mr-2 text-lg" />
            <span className="hidden xs:inline">Back to Resources</span>
            <span className="xs:hidden">Back</span>
          </button>
        </div>
      </div>

      {/* Loading state check */}
      {isLoading ? (
        <div className="p-4 sm:p-6 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <FaSpinner className="animate-spin text-3xl sm:text-4xl text-gfgsc-green" />
            <p className="text-gray-600">Loading resource...</p>
          </div>
        </div>
      ) : !resource ? (
        // Resource Not Found State
        <div className="p-4 sm:p-6 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
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
      ) : (
        <>
          {/* Hero Section */}
          <div className="mb-6 sm:mb-8">
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
                    {resource.platforms.map((platform) => {
                      const PlatformIcon = platformIcons[platform];
                      const color =
                        platformColors[platform.toLowerCase()] || "#6B7280";

                      return (
                        <div
                          key={platform}
                          className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium duration-200 hover:scale-105"
                          style={{
                            borderColor: color,
                            color: color,
                            borderWidth: "1px",
                          }}
                        >
                          <PlatformIcon className="mr-1 text-xs sm:text-sm" />
                          {platform}
                        </div>
                      );
                    })}
                  </div>

                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
                    {resource.title}
                  </h1>
                  <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-4 sm:mb-6 max-w-3xl">
                    {resource.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-500">
                    <div className="flex items-center px-3 sm:px-4 py-1 sm:py-2 bg-gray-50 rounded-lg">
                      <FaCalendarAlt className="mr-1 sm:mr-2 text-gfgsc-green" />
                      <span className="hidden xs:inline">Updated </span>
                      {new Date(resource.lastModifiedAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center px-3 sm:px-4 py-1 sm:py-2 bg-gray-50 rounded-lg">
                      <FaListOl className="mr-1 sm:mr-2 text-gfgsc-green" />
                      {resource.totalQuestions} Problems
                    </div>
                  </div>
                </div>

                {/* quick actions div */}
                <div className="flex items-center gap-2 mt-4 sm:mt-0">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditModalOpen(true)}
                    className="p-2 sm:p-3 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                  >
                    <FaPencilAlt className="text-sm sm:text-base" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDeleteResource}
                    className="p-2 sm:p-3 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                  >
                    <FaTrash className="text-sm sm:text-base" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          {/* Problems Section */}
          <div>
            {/* Filters and Actions */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 shadow-lg border border-gray-100">
              <div className="flex justify-between gap-4">
                <div className="flex flex-col sm:flex-row flex-wrap gap-4">
                  {/* Difficulty Filter */}
                  <div className="flex flex-wrap gap-1 sm:gap-2 bg-gray-100 p-1 rounded-lg w-full sm:w-auto">
                    {["all", "easy", "medium", "hard"].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setSelectedDifficulty(filter)}
                        className={`flex-1 sm:flex-initial px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                          selectedDifficulty === filter
                            ? "bg-gfgsc-green text-white shadow-md"
                            : "text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                      </button>
                    ))}
                  </div>

                  {/* Platform Filter */}
                  <div className="flex flex-wrap gap-1 sm:gap-2 bg-gray-100 p-1 rounded-lg w-full sm:w-auto">
                    <button
                      onClick={() => setSelectedPlatform("all")}
                      className={`px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                        selectedPlatform === "all"
                          ? "bg-gfgsc-green text-white shadow-md"
                          : " text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      All Platforms
                    </button>
                    {resource.platforms.map((platform) => {
                      const PlatformIcon = platformIcons[platform];

                      return (
                        <button
                          key={platform}
                          onClick={() => setSelectedPlatform(platform)}
                          className={`px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-1 sm:gap-2
                            ${
                              selectedPlatform === platform
                                ? "bg-gfgsc-green text-white shadow-md"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                          <PlatformIcon className="text-xs sm:text-sm" />
                          <span className="hidden sm:flex">{platform}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowDelete(!showDelete)}
                    className={`p-2 sm:p-3 rounded-lg transition-colors ${
                      showDelete
                        ? "bg-red-100 text-red-600"
                        : "bg-gray-50 hover:bg-gray-100 text-gray-600"
                    }`}
                  >
                    <FaTrash className="text-sm sm:text-base" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1 sm:py-2 bg-gfgsc-green text-white rounded-lg hover:bg-emerald-600 transition-colors shadow-lg shadow-gfgsc-green/20 text-xs sm:text-sm"
                  >
                    <FaPlus />
                    <span className="hidden sm:flex">Add Problem</span>
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Problems Table */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full min-w-[640px]">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-600">
                        #
                      </th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-600">
                        Problem
                      </th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-600">
                        Difficulty
                      </th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-600">
                        Platform
                      </th>
                      {showDelete && (
                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm font-semibold text-gray-600">
                          Action
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <AnimatePresence>
                      {problems.length === 0 ? (
                        <tr>
                          <td
                            colSpan={showDelete ? 5 : 4}
                            className="px-6 py-12 text-center text-gray-500"
                          >
                            <div className="flex flex-col items-center justify-center gap-2">
                              <div className="text-gray-400 text-lg">
                                No problems found
                              </div>
                              <p className="text-sm text-gray-400">
                                Try changing your filters or add a new problem
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        problems.map((problem, idx) => {
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
                              <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-500 text-xs sm:text-sm">
                                {idx + 1}
                              </td>
                              <td className="px-4 sm:px-6 py-3 sm:py-4">
                                <a
                                  href={problem.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-medium text-xs sm:text-sm text-gray-900 hover:text-gfgsc-green transition-colors flex items-center gap-2 group truncate max-w-[180px] sm:max-w-xs md:max-w-md"
                                >
                                  {problem.questionTitle}
                                  <FaExternalLinkAlt className="opacity-0 group-hover:opacity-100 transition-opacity text-xs flex-shrink-0" />
                                </a>
                              </td>
                              <td className="px-4 sm:px-6 py-3 sm:py-4">
                                <span
                                  className={`inline-flex items-center px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-medium ${
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
                              <td className="px-4 sm:px-6 py-3 sm:py-4">
                                <div
                                  className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium duration-200 hover:scale-105"
                                  style={{
                                    borderColor: color,
                                    color: color,
                                    borderWidth: "1px",
                                  }}
                                >
                                  <PlatformIcon className="mr-1 text-xs" />
                                  {problem.platform}
                                </div>
                              </td>
                              {showDelete && (
                                <td className="px-4 sm:px-6 py-3 sm:py-4 text-right">
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleDelete(problem.id)}
                                    className="text-red-500 hover:text-red-600 p-1 sm:p-2"
                                  >
                                    <FaTrash className="text-xs sm:text-sm" />
                                  </motion.button>
                                </td>
                              )}
                            </motion.tr>
                          );
                        })
                      )}
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

          <EditPracticeSetModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            resource={resource}
            onEdit={handleEditResource}
          />
        </>
      )}
    </motion.div>
  );
};

export default PracticeSet;
