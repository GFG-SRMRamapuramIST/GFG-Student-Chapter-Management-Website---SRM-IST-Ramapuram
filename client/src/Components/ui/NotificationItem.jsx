import { motion } from "framer-motion";

// Importing Icons
import { MdAccessTime, MdDelete } from "react-icons/md";
import { RiLinkM } from "react-icons/ri";

import { useUser } from "../../Context/UserContext";
import { hasMinimumRole, ROLES } from "../../Utilities/roleUtils";

const NotificationItem = ({ notification, onDelete }) => {
  const { userRole } = useUser();
  const { id, title, description, date, time, links } = notification;

  // Convert date and time to a proper Date object
  const formattedDateTime = date && time ? new Date(`${date}T${time}`) : null;

  // Function to handle delete click
  const handleDelete = async (notificationId) => {
    //console.log("Deleted ID:", notificationId);
    await onDelete(notificationId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-shadow"
    >
      {/* Title and Delete Icon */}
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-gray-800">{title}</h4>
        <MdDelete
          disabled={!hasMinimumRole(userRole, ROLES.COREMEMBER)}
          className={` ${
            hasMinimumRole(userRole, ROLES.COREMEMBER)
              ? "text-red-500 cursor-pointer hover:text-red-700 transition-colors"
              : "text-grey cursor-pointer hover:text-grey transition-colors"
          }`}
          size={18}
          onClick={() => handleDelete(id)} // Call function on click
        />
      </div>

      <p className="text-gray-600 mb-3">{description}</p>

      {formattedDateTime && (
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          <MdAccessTime />
          <time>{formattedDateTime.toLocaleString()}</time>
        </div>
      )}

      {links && links.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.link} // Fixed from link.url to link.link
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm hover:bg-green-100 transition-colors"
            >
              <RiLinkM className="w-4 h-4 mr-1" />
              {link.linkText}
            </a>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default NotificationItem;
