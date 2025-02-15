import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from 'prop-types';

// Icons
import {
  RiCalendarLine,
} from "react-icons/ri";
import { FaSpinner } from "react-icons/fa";

// Components
import { RotatingCloseButton } from "../../Utilities";

const EventCreationModal = ({ isOpen, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);

  const [eventType, setEventType] = useState("meeting");

  const [formData, setFormData] = useState({
    title: "",
    link: "",
    date: "",
    startTime: "",
    endTime: "",
    description: "",
    attendees: "all",
    platform: "leetcode",
  });

  // *** Event Creation Modal Handles ***
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    const eventData = {
      name: formData.title,
      link: formData.link,
      date: formData.date, // Fixed key typo from 'data' to 'date'
      time: formData.startTime,
      type: eventType,
      ...(eventType === "meeting"
        ? {
            description: formData.description,
            attendees: formData.attendees,
          }
        : {
            platform: formData.platform,
            endTime: formData.endTime,
          }),
    };

    try {
      await onSave(eventData); // Call API
    } catch (error) {
      console.error("Error saving event:", error);
    } finally {
      setLoading(false); // Stop loading
      setFormData({
        title: "",
        link: "",
        date: "",
        startTime: "",
        endTime: "",
        description: "",
        attendees: "all",
        platform: "leetcode",
      });
      onClose();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // *** Event Creation Modal Handles ENDS ***

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
              <div className="flex items-center gap-3">
                <div className="bg-gfgsc-green-200 p-3 rounded-2xl">
                  <RiCalendarLine className="text-gfgsc-green w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gfg-black">
                  Schedule {eventType === "meeting" ? "Meeting" : "Contest"}
                </h3>
              </div>
              <RotatingCloseButton onClick={onClose} />
            </div>

            <div className="mb-6">
              <div className="flex bg-gray-100 p-1 rounded-2xl w-fit">
                <button
                  onClick={() => setEventType("meeting")}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    eventType === "meeting"
                      ? "bg-white text-gfg-black shadow-sm"
                      : "text-gray-500"
                  }`}
                >
                  Meeting
                </button>
                <button
                  onClick={() => setEventType("contest")}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    eventType === "contest"
                      ? "bg-white text-gfg-black shadow-sm"
                      : "text-gray-500"
                  }`}
                >
                  Contest
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gfgsc-green"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link
                </label>
                <input
                  type="url"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gfgsc-green"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gfgsc-green"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gfgsc-green"
                    required
                  />
                </div>
              </div>

              {eventType === "contest" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Platform
                    </label>
                    <select
                      name="platform"
                      value={formData.platform}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gfgsc-green"
                      required
                    >
                      <option value="leetcode">LeetCode</option>
                      <option value="codeforces">CodeForces</option>
                      <option value="codechef">CodeChef</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      min={formData.startTime}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gfgsc-green"
                      required
                    />
                  </div>
                </div>
              )}

              {eventType === "meeting" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gfgsc-green resize-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Attendees
                    </label>
                    <select
                      name="attendees"
                      value={formData.attendees}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gfgsc-green"
                      required
                    >
                      <option value="ALL">Users</option>
                      <option value="MEMBER">Members</option>
                      <option value="COREMEMBER">Core Members</option>
                    </select>
                  </div>
                </>
              )}

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-gfgsc-green text-white rounded-xl hover:bg-gfgsc-green-600 transition-colors"
                >
                  {loading ? (
                    <FaSpinner className="animate-spin inline-block" />
                  ) : null}{" "}
                  Schedule
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

EventCreationModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
  };

export default EventCreationModal;
