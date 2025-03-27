import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaVideo,
  FaPencilAlt,
  FaTrash,
  FaPlus,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { useParams } from "react-router-dom";
import { AddResourceModal, EditResourceModal } from "../../Components";
import { ConfirmationPopup } from "../../Utilities";
import { useUser } from "../../Context/UserContext";

const mockResources = [
  {
    id: "1",
    title: "React Fundamentals",
    description: "A comprehensive guide to learning React from scratch",
    lastUpdated: "2024-03-27",
    videos: [
      {
        id: "v1",
        title: "Introduction to React",
        description: "Learn the basics of React and its core concepts",
        videoLink: "https://www.youtube.com/embed/DHjqpvDnNGE",
      },
      {
        id: "v2",
        title: "React Hooks Deep Dive",
        description: "Exploring useState, useEffect, and custom hooks",
        videoLink: "https://www.youtube.com/embed/DHjqpvDnNGE",
      },
    ],
  },
  {
    id: "2",
    title: "Advanced JavaScript",
    description: "Master advanced JavaScript techniques and patterns",
    lastUpdated: "2024-03-25",
    videos: [
      {
        id: "v3",
        title: "Closures Explained",
        description: "Understanding JavaScript closures in depth",
        videoLink: "https://www.youtube.com/embed/DHjqpvDnNGE",
      },
    ],
  },
];

const Resource = () => {
  const { id } = useParams();

  const { userRole } = useUser();
  const isAuthorized = (role) => {
    const roles = [
      "USER",
      "MEMBER",
      "COREMEMBER",
      "VICEPRESIDENT",
      "PRESIDENT",
      "ADMIN",
    ];
    const minRequiredRole = "COREMEMBER";
    return roles.indexOf(role) >= roles.indexOf(minRequiredRole);
  };

  const [resource, setResource] = useState(
    mockResources.find((r) => r.id === id)
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddVideoModalOpen, setIsAddVideoModalOpen] = useState(false);

  const [confirmationState, setConfirmationState] = useState({
    isOpen: false,
    type: "danger",
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const handleEditResource = (updatedData) => {
    console.log("Editing resource:", updatedData);
    // Placeholder for actual edit logic
  };

  const handleDeleteResource = () => {
    setConfirmationState({
      isOpen: true,
      type: "danger",
      title: "Delete Resource",
      message:
        "Are you sure you want to delete this resource? This action cannot be undone.",
      onConfirm: async () => {
        try {
          console.log("Deleting resource with ID:", resource.id);
          // Add your delete resource API call here
          // After successful deletion, redirect to resources list
        } catch (error) {
          console.error("Error deleting resource:", error);
        } finally {
          setConfirmationState((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const handleDeleteVideo = (videoId) => {
    setConfirmationState({
      isOpen: true,
      type: "danger",
      title: "Delete Video",
      message:
        "Are you sure you want to delete this video? This action cannot be undone.",
      onConfirm: async () => {
        try {
          console.log("Deleting video with ID:", videoId);
          // Add your delete video API call here
        } catch (error) {
          console.error("Error deleting video:", error);
        } finally {
          setConfirmationState((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const handleAddVideo = (newVideo) => {
    console.log("Adding new video:", newVideo);
    // Placeholder for actual add video logic
  };

  if (!resource) {
    return <div>Resource not found</div>;
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Resource Header */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg border border-gray-100 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
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
                {new Date(resource.lastUpdated).toLocaleDateString()}
              </div>
              <div className="flex items-center px-3 sm:px-4 py-1 sm:py-2 bg-gray-50 rounded-lg">
                <FaVideo className="mr-1 sm:mr-2 text-gfgsc-green" />
                {resource.videos.length} Videos
              </div>
            </div>
          </div>

          {/* Quick Actions */}
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

      {/* Videos Section */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Videos</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAddVideoModalOpen(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-2 bg-gfgsc-green text-white rounded-lg hover:bg-emerald-600 transition-colors shadow-lg shadow-gfgsc-green/20 text-xs sm:text-sm"
          >
            <FaPlus />
            <span className="hidden sm:flex">Add Video</span>
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resource.videos.map((video) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-50 rounded-lg overflow-hidden shadow-sm group"
            >
              <div className="relative">
                <iframe
                  src={video.videoLink}
                  title={video.title}
                  className="w-full aspect-video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                {isAuthorized(userRole) && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDeleteVideo(video.id)}
                    className="absolute top-2 right-2 bg-red-50 text-red-600 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <FaTrash className="text-sm" />
                  </motion.button>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex justify-between items-center">
                  {video.title}
                  <a
                    href={video.videoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gfgsc-green hover:text-emerald-700"
                  >
                    <FaExternalLinkAlt />
                  </a>
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {video.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <EditResourceModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        resource={resource}
        onEdit={handleEditResource}
      />

      <AddResourceModal
        isOpen={isAddVideoModalOpen}
        onClose={() => setIsAddVideoModalOpen(false)}
        onAdd={handleAddVideo}
      />

      <ConfirmationPopup
        isOpen={confirmationState.isOpen}
        onClose={() =>
          setConfirmationState((prev) => ({ ...prev, isOpen: false }))
        }
        onConfirm={confirmationState.onConfirm}
        type={confirmationState.type}
        title={confirmationState.title}
        message={confirmationState.message}
      />
    </div>
  );
};

export default Resource;
