import { useEffect, useState } from "react";

// Importing Icons
import { RiAddLine } from "react-icons/ri";
import { FaSpinner } from "react-icons/fa";

import { useUser } from "../../Context/UserContext";
import { hasMinimumRole, ROLES } from "../../Utilities/roleUtils";
import { ToastMsg } from "../../Utilities";

import NotificationItem from "../ui/NotificationItem";
import NotificationModal from "../ui/NotificationModal";

// Importing APIs
import { CoreMemberServices } from "../../Services";

const NotificationsSection = () => {
  const { userRole } = useUser();
  const {
    createAnnouncementFunction,
    fetchAllAnnouncementFunction,
    deleteAnnouncementFunction,
  } = CoreMemberServices();
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [notifications, setNotifications] = useState([]);

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

  const handleAddNotification = async (notificationData) => {
    try {
      const response = await createAnnouncementFunction(notificationData);
      //console.log(response)
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
    //console.log(id);
    try {
      const response = await deleteAnnouncementFunction({ announcementId: id });

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
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
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

      {loading ? (
        <div className="p-6 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <FaSpinner className="animate-spin text-4xl text-gfgsc-green" />
            <p className="text-gray-600">Loading announcement...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification, index) => (
            <NotificationItem
              key={index}
              notification={notification}
              onDelete={handleNotificationDelete}
            />
          ))}
        </div>
      )}

      <NotificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddNotification}
      />
    </div>
  );
};

export default NotificationsSection;
