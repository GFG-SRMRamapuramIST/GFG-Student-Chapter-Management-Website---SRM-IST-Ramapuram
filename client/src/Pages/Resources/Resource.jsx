import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import {
  FaCalendarAlt,
  FaVideo,
  FaPencilAlt,
  FaTrash,
  FaPlus,
  FaExternalLinkAlt,
  FaArrowLeft,
  FaSpinner,
} from "react-icons/fa";

import { AddResourceModal, EditResourceModal } from "../../Components";
import {
  ConfirmationPopup,
  processYouTubeUrl,
  ToastMsg,
} from "../../Utilities";
import { useUser } from "../../Context/UserContext";

// Importing APIs
import { CoreMemberServices } from "../../Services";
import { BiChevronLeft } from "react-icons/bi";
import { hasMinimumRole, ROLES } from "../../Utilities/roleUtils";

const Resource = () => {
  const {
    fetchAllVideoOfVideoResourceFunction,
    addVideoToVideoResourceFunction,
    deleteVideoFromVideoResourceFunction,
    editVideoResourceFunction,
    deleteVideoResourceFunction,
  } = CoreMemberServices();

  const { id } = useParams();
  const navigate = useNavigate();

  const { userRole } = useUser();

  const [isLoading, setIsLoading] = useState(true);
  const [resource, setResource] = useState(null);
  const [videos, setVideos] = useState([]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddVideoModalOpen, setIsAddVideoModalOpen] = useState(false);

  const [confirmationState, setConfirmationState] = useState({
    isOpen: false,
    type: "danger",
    title: "",
    message: "",
    onConfirm: () => {},
  });

  //****************** Fetch all videos of a resource **********************/
  const getAllVideosOfVideoResourceHandler = async () => {
    try {
      setIsLoading(true);

      const response = await fetchAllVideoOfVideoResourceFunction({
        videoResourceId: id,
      });

      //console.log(response);
      if (response.status == 200) {
        setResource(response.data.resourceInfo);
        setVideos(response.data.videos);
      } else {
        //ToastMsg(response.response.data.message, "error");
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
    const fetchVideos = async () => {
      await getAllVideosOfVideoResourceHandler();
    };

    fetchVideos();
  }, []);

  //****************************************************************************/

  //************************ Video Resource Handler ****************************/
  const handleEditResource = async (updatedData) => {
    try {
      const response = await editVideoResourceFunction({
        videoResourceId: id,
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
      getAllVideosOfVideoResourceHandler();
    }
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
          const response = await deleteVideoResourceFunction({
            videoResourceId: id,
          });
          if (response.status === 200) {
            ToastMsg(response.data.message, "success");
            navigate("/resources");
          } else {
            ToastMsg(response.response.data.message, "error");
            console.log(response.response.data.message);
          }
        } catch (error) {
          ToastMsg("Internal Server Error!", "error");
          console.error("Delete Resource Error: ", error.message);
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
          const response = await deleteVideoFromVideoResourceFunction({
            videoResourceId: id,
            videoId: videoId,
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
          console.error("Delete a video to a Resource Error: ", error.message);
        } finally {
          setConfirmationState((prev) => ({ ...prev, isOpen: false }));
          getAllVideosOfVideoResourceHandler();
        }
      },
    });
  };

  const handleAddVideo = async (newVideo) => {
    //console.log(newVideo);
    try {
      const processedVideoLink = processYouTubeUrl(newVideo.videoLink);
      if (!processedVideoLink) {
        ToastMsg("Invalid YouTube URL", "error");
        return;
      }

      const response = await addVideoToVideoResourceFunction({
        vidoeResourceId: id,
        title: newVideo.title,
        link: processedVideoLink,
        description: newVideo.description,
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
      console.error("Add a video to a Resource Error: ", error.message);
    } finally {
      getAllVideosOfVideoResourceHandler();
    }
  };
  //****************************************************************************/

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 sm:p-6 max-w-7xl mx-auto"
    >
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
                    {new Date(resource.lastModifiedAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center px-3 sm:px-4 py-1 sm:py-2 bg-gray-50 rounded-lg">
                    <FaVideo className="mr-1 sm:mr-2 text-gfgsc-green" />
                    {resource.totalVideos} Videos
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2 mt-4 sm:mt-0">
                <div className="relative group">
                  <motion.button
                    whileHover={
                      hasMinimumRole(userRole, ROLES.COREMEMBER)
                        ? { scale: 1.05 }
                        : {}
                    }
                    whileTap={
                      hasMinimumRole(userRole, ROLES.COREMEMBER)
                        ? { scale: 0.95 }
                        : {}
                    }
                    onClick={() =>
                      hasMinimumRole(userRole, ROLES.COREMEMBER) &&
                      setIsEditModalOpen(true)
                    }
                    disabled={!hasMinimumRole(userRole, ROLES.COREMEMBER)}
                    className={`p-2 sm:p-3 rounded-lg transition-colors ${
                      hasMinimumRole(userRole, ROLES.COREMEMBER)
                        ? "bg-gray-50 hover:bg-gray-100 text-gray-600"
                        : "bg-gray-50 text-gray-300 cursor-not-allowed"
                    }`}
                  >
                    <FaPencilAlt className="text-sm sm:text-base" />
                  </motion.button>
                  {!hasMinimumRole(userRole, ROLES.COREMEMBER) && (
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      Only core team members can edit
                    </div>
                  )}
                </div>

                <div className="relative group">
                  <motion.button
                    whileHover={
                      hasMinimumRole(userRole, ROLES.COREMEMBER)
                        ? { scale: 1.05 }
                        : {}
                    }
                    whileTap={
                      hasMinimumRole(userRole, ROLES.COREMEMBER)
                        ? { scale: 0.95 }
                        : {}
                    }
                    onClick={() =>
                      hasMinimumRole(userRole, ROLES.COREMEMBER) &&
                      handleDeleteResource()
                    }
                    disabled={!hasMinimumRole(userRole, ROLES.COREMEMBER)}
                    className={`p-2 sm:p-3 rounded-lg transition-colors ${
                      hasMinimumRole(userRole, ROLES.COREMEMBER)
                        ? "bg-red-50 hover:bg-red-100 text-red-600"
                        : "bg-gray-50 text-gray-300 cursor-not-allowed"
                    }`}
                  >
                    <FaTrash className="text-sm sm:text-base" />
                  </motion.button>
                  {!hasMinimumRole(userRole, ROLES.COREMEMBER) && (
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      Only core team members can delete
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Videos Section */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Videos</h2>
              <div className="relative group">
                <motion.button
                  whileHover={
                    hasMinimumRole(userRole, ROLES.COREMEMBER)
                      ? { scale: 1.05 }
                      : {}
                  }
                  whileTap={
                    hasMinimumRole(userRole, ROLES.COREMEMBER)
                      ? { scale: 0.95 }
                      : {}
                  }
                  onClick={() =>
                    hasMinimumRole(userRole, ROLES.COREMEMBER) &&
                    setIsAddVideoModalOpen(true)
                  }
                  disabled={!hasMinimumRole(userRole, ROLES.COREMEMBER)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-2 rounded-lg transition-colors ${
                    hasMinimumRole(userRole, ROLES.COREMEMBER)
                      ? "bg-gfgsc-green text-white hover:bg-emerald-600 shadow-lg shadow-gfgsc-green/20"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <FaPlus />
                  <span className="hidden sm:flex">Add Video</span>
                </motion.button>
                {!hasMinimumRole(userRole, ROLES.COREMEMBER) && (
                  <div className="absolute -bottom-8 right-0 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    Only core team members can add videos
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos?.map((video) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 rounded-lg overflow-hidden shadow-sm group"
                >
                  <div className="relative">
                    <iframe
                      src={processYouTubeUrl(video.videoLink)}
                      title={video.videoTitle}
                      className="w-full aspect-video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                    {hasMinimumRole(userRole, ROLES.COREMEMBER) && (
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
                      {video.videoTitle}
                      <a
                        href={video.videoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gfgsc-green hover:text-emerald-700"
                      >
                        <FaExternalLinkAlt />
                      </a>
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2"
                    title={video.videoDescription}>
                      {video.videoDescription}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </>
      )}

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
    </motion.div>
  );
};

export default Resource;
