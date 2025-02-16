import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

// Importing Icons
import {
  FaCalendarAlt,
  FaListOl,
  FaChevronRight,
  FaTrash,
  FaPlus,
  FaSpinner,
} from "react-icons/fa";

import { platformIcons, resources } from "../../Constants";
import AddProblemModal from "../../Components/Resources/AddProblemModal";
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

  useEffect(() => {
    const foundResource = resources.find((r) => r.id.toString() === id);
    setResource(foundResource);
    setIsLoading(false);

    // Mock Data - Initialize problems when resource is found
    if (foundResource) {
      const initialProblems = Array(foundResource.count)
        .fill(null)
        .map((_, idx) => ({
          id: idx + 1,
          title: `Problem ${idx + 1}`,
          difficulty: ["easy", "medium", "hard"][Math.floor(Math.random() * 3)],
          platform:
            foundResource.platforms[
              Math.floor(Math.random() * foundResource.platforms.length)
            ],
          link: "#",
        }));
      setProblems(initialProblems);
    }
  }, [id]);

  // ******** Resource's Question Handlers ********

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
      <div className="min-h-screen p-6 flex items-center justify-center">
        <FaSpinner className="animate-spin inline-block" />
      </div>
    );
  }

  // Resource Not found state check
  if (!resource) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-gray-500">Resource not found</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen p-6"
    >
      {/* Breadcrumb */}
      <div className="mx-auto mb-4">
        <div className="flex items-center text-sm text-gray-500">
          <FaChevronRight className="mx-2" />
          <span className="text-gfgsc-green font-medium">{resource.title}</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex space-x-2">
                  {resource.platforms.map((platform) => {
                    const PlatformIcon = platformIcons[platform];
                    return (
                      <PlatformIcon
                        key={platform}
                        className="text-4xl text-gfgsc-green"
                      />
                    );
                  })}
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gfg-black mb-2">
                {resource.title}
              </h1>
              <p className="text-gray-600 mb-4">{resource.description}</p>
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-2" />
                  Last updated:{" "}
                  {new Date(resource.lastModifiedAt).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <FaListOl className="mr-2" />
                  {resource.totalQuestions} Problems
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Problems Table */}
      <div className="max-w-6xl mx-auto">
        {/* Filters and Actions */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex space-x-4">
              <div className="flex space-x-2">
                {["all", "easy", "medium", "hard"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedDifficulty(filter)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedDifficulty === filter
                        ? "bg-gfgsc-green text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
              <div className="border-l border-gray-200 pl-4 flex space-x-2">
                <button
                  onClick={() => setSelectedPlatform("all")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedPlatform === "all"
                      ? "bg-gfgsc-green text-white"
                      : "text-gray-600 hover:bg-gray-100"
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
                      className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                        selectedPlatform === platform
                          ? "bg-gfgsc-green text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <PlatformIcon className="h-5 w-5" />
                      <span>
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowDelete(!showDelete)}
                className={`p-2 rounded-lg transition-colors ${
                  showDelete
                    ? "bg-red-100 text-red-600"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                <FaTrash />
              </button>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
              >
                <FaPlus />
              </button>
            </div>
          </div>
        </div>

        {/* Problems Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                  #
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                  Problem
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                  Difficulty
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                  Platform
                </th>
                {showDelete && (
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                    Action
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {problems.map((problem, idx) => {
                const PlatformIcon = platformIcons[problem.platform];
                return (
                  <motion.tr
                    key={problem.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-500">{idx + 1}</td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">
                        {problem.questionTitle}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          problem.difficulty === "EASY"
                            ? "bg-green-100 text-green-800"
                            : problem.difficulty === "MEDIUM"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {problem.difficulty.charAt(0).toUpperCase() +
                          problem.difficulty.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={problem.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-gray-600 hover:text-gfgsc-green"
                      >
                        <PlatformIcon className="h-5 w-5" />
                      </a>
                    </td>
                    {showDelete && (
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(problem.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    )}
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AddProblemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAdd}
        platforms={resource.platforms}
      />
    </motion.div>
  );
};

export default Resource;
