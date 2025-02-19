import NotificationItem from "../ui/NotificationItem";

const NotificationsSection = ({ title, notifications }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm">
    <h3 className="font-semibold text-gfg-black mb-4">{title}</h3>
    <div className="space-y-1">
      {notifications.map((notification, index) => (
        <NotificationItem key={index} message={notification} />
      ))}
    </div>
  </div>
);

export default NotificationsSection;
