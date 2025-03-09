import { useState } from "react";
import { RiAddLine } from "react-icons/ri";
import { useUser } from "../../Context/UserContext";
import { hasMinimumRole, ROLES } from "../../Utilities/roleUtils";
import NotificationItem from "../ui/NotificationItem";
import NotificationModal from "../ui/NotificationModal";
import { ToastMsg } from "../../Utilities";

const NotificationsSection = () => {
  const { userRole } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [notifications, setNotifications] = useState( [
    {
      title: "New Contest Announced",
      description: "Join us for an exciting coding contest this weekend!",
      datetime: "2024-03-10T15:00:00",
      links: [
        {
          url: "https://example.com/contest",
          placeholder: "Register Now",
        },
        {
          url: "https://example.com/rules",
          placeholder: "View Rules",
        },
      ],
    },
    // ...more notifications
  ]);

  const handleAddNotification = (notificationData) => {
    try {
      // Add new notification at the beginning of the array
      setNotifications(prevNotifications => [
        {
          ...notificationData,
          // Clean up empty links if any
          links: notificationData.links.filter(link => 
            link.url.trim() && link.placeholder.trim()
          )
        },
        ...prevNotifications
      ]);

      ToastMsg("Notification added successfully!", "success");
    } catch (error) {
      console.error("Error adding notification:", error);
      ToastMsg("Failed to add notification", "error");
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gfg-black">Recent Updates</h3>
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

      <div className="space-y-3">
        {notifications.map((notification, index) => (
          <NotificationItem key={index} notification={notification} />
        ))}
      </div>

      <NotificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddNotification}
      />
    </div>
  );
};

export default NotificationsSection;
