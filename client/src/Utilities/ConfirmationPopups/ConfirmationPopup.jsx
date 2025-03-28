import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Importing Icons
import { IoWarning, IoInformation, IoCheckmark } from "react-icons/io5";
import { FaSpinner } from "react-icons/fa";

const ConfirmationPopup = ({
  isOpen,
  onClose,
  onConfirm,
  type = "info",
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  const [loading, setLoading] = useState(false); // Loading state for API call

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm(); // Call the passed confirm function
    setLoading(false);
  };

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return {
          icon: IoCheckmark,
          bg: "bg-green-100",
          iconColor: "text-green-500",
          buttonColor: "bg-green-500 hover:bg-green-600",
        };
      case "danger":
        return {
          icon: IoWarning,
          bg: "bg-red-100",
          iconColor: "text-red-500",
          buttonColor: "bg-red-500 hover:bg-red-600",
        };
      default:
        return {
          icon: IoInformation,
          bg: "bg-blue-100",
          iconColor: "text-blue-500",
          buttonColor: "bg-blue-500 hover:bg-blue-600",
        };
    }
  };

  const { icon: Icon, bg, iconColor, buttonColor } = getTypeStyles();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden"
          >
            {/* Header */}
            <div className={`${bg} p-6 flex items-center gap-4`}>
              <div className={`${iconColor} text-2xl`}>
                <Icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-gray-600 whitespace-pre-line">{message}</p>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors"
              >
                {cancelText}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={async () => {
                  await handleConfirm(); // Wait for API to finish before closing modal
                  onClose();
                }}
                className={`px-4 py-2 rounded-lg text-white ${buttonColor} transition-colors`}
              >
                {loading ? (
                  <FaSpinner className="animate-spin inline-block" />
                ) : null}{" "}
                {confirmText}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationPopup;
