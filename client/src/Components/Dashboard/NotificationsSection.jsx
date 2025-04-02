import React, { useEffect, useState, useCallback } from "react";

// Importing Icons
import { RiAddLine, RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { FaSpinner, FaDotCircle } from "react-icons/fa";

import { useUser } from "../../Context/UserContext";
import { hasMinimumRole, ROLES } from "../../Utilities/roleUtils";
import { ConfirmationPopup, ToastMsg } from "../../Utilities";

import NotificationItem from "../ui/NotificationItem";
import NotificationModal from "../ui/NotificationModal";

// Importing APIs
import { CoreMemberServices } from "../../Services";

const NotificationsSection = ({
  isCarousel = true,
  autoSlideInterval = 4000,
}) => {
  const { userRole } = useUser();
  const {
    createAnnouncementFunction,
    fetchAllAnnouncementFunction,
    deleteAnnouncementFunction,
  } = CoreMemberServices();

  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [confirmationState, setConfirmationState] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const getAllAnnouncement = async () => {
    setLoading(true);
    try {
      const response = await fetchAllAnnouncementFunction();
      if (response.status === 200) {
        const formattedData = response.data.data.map((item) => ({
          id: item._id,
          title: item.title,
          description: item.description,
          date: item.date.split("T")[0], // Extract YYYY-MM-DD
          time: item.time,
          links: item.links.map((link) => ({
            linkText: link.linkText,
            link: link.link,
          })),
        }));

        setNotifications(formattedData);
      } else {
        ToastMsg("Error in fetching announcements", "error");
      }
    } catch (error) {
      console.error("Error in fetching announcements: ", error);
      ToastMsg("Error in fetching announcements", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllAnnouncement();
  }, []);

  // Auto-sliding logic for carousel
  // useEffect(() => {
  //   if (!isCarousel || notifications.length <= 1) return;

  //   const slideInterval = setInterval(() => {
  //     setCurrentSlide((prev) => (prev + 1) % notifications.length);
  //   }, autoSlideInterval);

  //   return () => clearInterval(slideInterval);
  // }, [isCarousel, notifications.length, autoSlideInterval]);

  const handleNextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % notifications.length);
  }, [notifications.length]);

  const handlePrevSlide = useCallback(() => {
    setCurrentSlide(
      (prev) => (prev - 1 + notifications.length) % notifications.length
    );
  }, [notifications.length]);

  const handleAddNotification = async (notificationData) => {
    try {
      const response = await createAnnouncementFunction(notificationData);
      if (response.status === 200) {
        ToastMsg(response.data.message, "success");
      } else {
        console.error(
          "Error adding announcement: ",
          response.response.data.message
        );
        ToastMsg("Failed to add announcement", "error");
      }
    } catch (error) {
      console.error("Internal Server Error: ", error);
      ToastMsg("Internal Server Error! Please try later", "error");
    } finally {
      getAllAnnouncement();
    }
  };

  const handleNotificationDelete = async (id) => {
    setConfirmationState({
      isOpen: true,
      type: "danger",
      title: "Delete Announcement",
      message: `Are you sure you want to delete the announcement?`,
      onConfirm: async () => {
        try {
          const response = await deleteAnnouncementFunction({
            announcementId: id,
          });

          if (response.status == 200) {
            ToastMsg(response.data.message, "success");
          } else {
            console.log("Error in deleting announcement");
            ToastMsg("Error in deleting announcement", "error");
          }
        } catch (error) {
          console.error("Internal Server Error: ", error);
          ToastMsg("Internal Server Error! Please try later", "error");
        } finally {
          getAllAnnouncement();
        }
      },
    });
  };

  // Render content based on view type
  const renderContent = () => {
    if (loading) {
      return (
        <div className="p-6 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <FaSpinner className="animate-spin text-4xl text-gfgsc-green" />
            <p className="text-gray-600">Loading announcement...</p>
          </div>
        </div>
      );
    }

    if (notifications.length === 0) {
      return (
        <div className="text-center text-gray-500 p-4">
          No announcements available
        </div>
      );
    }

    // Carousel view
    if (isCarousel) {
      if (notifications.length === 1) {
        // If only one notification, show it without carousel
        return (
          <NotificationItem
            notification={notifications[0]}
            onDelete={handleNotificationDelete}
          />
        );
      }

      return (
        <div className="relative">
          {/* Slide content */}
          <div className="transition-transform duration-500 ease-in-out">
            <NotificationItem
              notification={notifications[currentSlide]}
              onDelete={handleNotificationDelete}
            />
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center items-center mt-3 space-x-2">
            {/* Navigation arrows */}
            {notifications.length > 1 && (
              <>
                <button
                  onClick={handlePrevSlide}
                  className=" bg-white/50 p-1 rounded-full"
                >
                  <RiArrowLeftSLine className="text-2xl text-gray-700" />
                </button>
              </>
            )}
            {notifications.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`
                  ${
                    currentSlide === index
                      ? "text-gfgsc-green"
                      : "text-gray-300"
                  }
                  transition-colors duration-300
                `}
              >
                <FaDotCircle className="text-xs" />
              </button>
            ))}
            {/* Navigation arrows */}
            {notifications.length > 1 && (
              <>
                <button
                  onClick={handleNextSlide}
                  className="bg-white/50 p-1 rounded-full"
                >
                  <RiArrowRightSLine className="text-2xl text-gray-700" />
                </button>
              </>
            )}
          </div>
        </div>
      );
    }

    // Scrollable view
    return (
      <div className="space-y-3 overflow-y-auto no-scrollbar ">
        {notifications.map((notification, index) => (
          <NotificationItem
            key={index}
            notification={notification}
            onDelete={handleNotificationDelete}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm ">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gfg-black">Announcements</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={!hasMinimumRole(userRole, ROLES.COREMEMBER)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-colors ${
            hasMinimumRole(userRole, ROLES.COREMEMBER)
              ? "bg-green-50 text-green-700 hover:bg-green-100"
              : "bg-gray-50 text-gray-400 cursor-not-allowed"
          }`}
        >
          <RiAddLine />
          Add
        </button>
      </div>

      {renderContent()}

      <NotificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddNotification}
      />

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
    </div>
  );
};

export default NotificationsSection;
