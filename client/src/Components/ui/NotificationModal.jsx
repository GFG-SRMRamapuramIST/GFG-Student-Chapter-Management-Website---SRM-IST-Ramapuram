import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Importing Icons
import { RiAddLine, RiCloseLine, RiLinkM } from "react-icons/ri";
import {
  MdDateRange,
  MdTitle,
  MdDescription,
  MdAccessTime,
} from "react-icons/md";
import { FaSpinner } from "react-icons/fa";

const NotificationModal = ({ isOpen, onClose, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0], // Default to today
    time: "",
    links: [{ link: "", linkText: "" }],
  });

  const handleAddLink = () => {
    setFormData((prev) => ({
      ...prev,
      links: [...prev.links, { link: "", linkText: "" }],
    }));
  };

  const handleRemoveLink = (index) => {
    setFormData((prev) => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index),
    }));
  };

  const handleLinkChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      links: prev.links.map((link, i) =>
        i === index ? { ...link, [field]: value } : link
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedData = {
      ...formData,
      links: formData.links.filter((link) => link.link && link.linkText),
    };

    setLoading(true);
    await onSubmit(cleanedData);
    setLoading(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md m-4"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Add Announcement
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <RiCloseLine className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  {/* Title */}
                  <div className="relative">
                    <MdTitle className="absolute left-3 top-3 text-gray-400" />
                    <input
                      required
                      type="text"
                      placeholder="Announcement Title"
                      className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-gfgsc-green focus:border-transparent"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                    />
                  </div>

                  {/* Description */}
                  <div className="relative">
                    <MdDescription className="absolute left-3 top-3 text-gray-400" />
                    <textarea
                      required
                      placeholder="Announcement Description"
                      className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-gfgsc-green focus:border-transparent min-h-[100px]"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                    />
                  </div>

                  {/* Date */}
                  <div className="relative">
                    <MdDateRange className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="date"
                      className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-gfgsc-green focus:border-transparent"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          date: e.target.value,
                        }))
                      }
                    />
                  </div>

                  {/* Time */}
                  <div className="relative">
                    <MdAccessTime className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="time"
                      className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-gfgsc-green focus:border-transparent"
                      value={formData.time}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          time: e.target.value,
                        }))
                      }
                    />
                  </div>

                  {/* Links Section */}
                  <div className="space-y-4">
                    {formData.links.map((link, index) => (
                      <div
                        key={index}
                        className="flex gap-2 bg-gray-50 p-2 rounded-xl"
                      >
                        <div className="flex-1 space-y-2">
                          <div className="relative">
                            <RiLinkM className="absolute left-3 top-3 text-gray-400" />
                            <input
                              type="url"
                              placeholder="Link URL"
                              className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-gfgsc-green focus:border-transparent"
                              value={link.link}
                              onChange={(e) =>
                                handleLinkChange(index, "link", e.target.value)
                              }
                            />
                          </div>
                          <input
                            type="text"
                            placeholder="Link Text"
                            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-gfgsc-green focus:border-transparent"
                            value={link.linkText}
                            onChange={(e) =>
                              handleLinkChange(
                                index,
                                "linkText",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveLink(index)}
                          className="self-center p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <RiCloseLine className="w-6 h-6" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddLink}
                      className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
                    >
                      <RiAddLine /> Add Link
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                  >
                    {loading ? (
                      <FaSpinner className="animate-spin inline-block" />
                    ) : null}{" "}
                    Add Announcement
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default NotificationModal;
