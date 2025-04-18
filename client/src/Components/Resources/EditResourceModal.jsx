import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Importing Icons
import { FaSpinner } from "react-icons/fa";

import { RotatingCloseButton } from "../../Utilities";

const EditResourceModal = ({ isOpen, onClose, resource, onEdit }) => {
  const [loading, setLoading] = useState(false);
  //console.log(resource);
  const [title, setTitle] = useState(resource?.title);
  const [description, setDescription] = useState(resource?.description);

  useEffect(() => {
    setTitle(resource?.title);
    setDescription(resource?.description);
  }, [resource]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await onEdit({ title, description });
    } catch (error) {
      console.log("Error in creating resource: ", error);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Edit Resource</h2>
              <RotatingCloseButton
                onClick={onClose}
                className="text-gray-500 hover:text-gray-600"
              />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gfgsc-green focus:border-transparent transition-all"
                    placeholder="Video Resource title"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gfgsc-green focus:border-transparent transition-all"
                    placeholder="Video Resource description"
                    required
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gfgsc-green text-white rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  {loading ? (
                    <FaSpinner className="animate-spin inline-block" />
                  ) : null}{" "}
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EditResourceModal;
