import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Importing Icons
import { FaSpinner } from "react-icons/fa";

import { RotatingCloseButton } from "../../Utilities";

const CreateResourceSetModal = ({ isOpen, onClose, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [resource, setResource] = useState({ title: "", description: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await onSubmit(resource);
    } catch (error) {
      console.log("Error in creating resource: ", error);
    } finally {
      setLoading(false);
      setResource({ title: "", description: "" });
      onClose();
    }
  };

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
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                Create Resource Set
              </h3>
              <RotatingCloseButton onClick={onClose} />
            </div>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={resource.title}
                onChange={(e) =>
                  setResource((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Resource Set Title"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gfgsc-green mb-6"
                required
              />
              <textarea
                type="text"
                value={resource.description}
                onChange={(e) =>
                  setResource((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Resource Set Description"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gfgsc-green mb-6"
                required
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-gfgsc-green text-white rounded-xl hover:bg-gfgsc-green-600 transition-colors"
                >
                  {loading ? (
                    <FaSpinner className="animate-spin inline-block" />
                  ) : null}{" "}
                  Create Resource Set
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateResourceSetModal;
