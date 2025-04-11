import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from 'prop-types';

// Icons
import {
  RiCalendarLine,
} from "react-icons/ri";
import { FaSpinner } from "react-icons/fa";

// Components
import { RotatingCloseButton, ToastMsg } from "../../Utilities";

const EventCreationModal = ({ isOpen, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [eventType, setEventType] = useState("meeting");
  const [isLastDayOfMonth, setIsLastDayOfMonth] = useState(false);

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

  // Check if selected date is the last day of the month
  useEffect(() => {
    if (formData.date) {
      const selectedDate = new Date(formData.date);
      const lastDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
      setIsLastDayOfMonth(selectedDate.getDate() === lastDay);
    } else {
      setIsLastDayOfMonth(false);
    }
  }, [formData.date]);

  // Reset non-required fields when event type changes
  useEffect(() => {
    if (eventType === "festival") {
      setFormData(prev => ({
        ...prev,
        link: "",
        startTime: "",
        endTime: "",
        description: "",
        attendees: "all",
        platform: "leetcode",
      }));
    }
  }, [eventType]);

  // *** Event Creation Modal Handles ***
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent contest scheduling on the last day of month
    if (eventType === "contest" && isLastDayOfMonth) {
      // Instead of just returning, show a toast message
      ToastMsg("Contests cannot be scheduled on the last day of the month", "error");
      return;
    }
    
    setLoading(true); // Start loading
    
    let eventData;
    
    // Format event data based on type
    if (eventType === "festival") {
      eventData = {
        name: formData.title,
        date: formData.date,
        type: eventType,
      };
    } else {
      eventData = {
        name: formData.title,
        link: formData.link,
        date: formData.date,
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
    }
      
    // console.log("Form Data:", formData);
    // console.log("Event Data:", eventData);

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
        platform: "LeetCode",
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
            className="bg-white  max-h-[90vh] overflow-y-scroll no-scrollbar rounded-3xl p-6 max-w-lg w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gfgsc-green-200 p-3 rounded-2xl">
                  <RiCalendarLine className="text-gfgsc-green w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gfg-black">
                  Schedule {eventType === "meeting" ? "Meeting" : eventType === "contest" ? "Contest" : "Festival"}
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
                <button
                  onClick={() => setEventType("festival")}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    eventType === "festival"
                      ? "bg-white text-gfg-black shadow-sm"
                      : "text-gray-500"
                  }`}
                >
                  Festival
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

              {eventType !== "festival" && (
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
              )}

              <div className={`grid ${eventType !== "festival" ? "grid-cols-2" : ""} gap-4`}>
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
                  {isLastDayOfMonth && eventType === "contest" && (
                    <p className="text-red-500 text-xs mt-1">Contests cannot be scheduled on the last day of the month</p>
                  )}
                </div>
                
                {eventType !== "festival" && (
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
                )}
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
                      <option value="LeetCode">LeetCode</option>
                      <option value="Codeforces">CodeForces</option>
                      <option value="CodeChef">CodeChef</option>
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

              {/* Festival Event Type Info */}
              {eventType === "festival" && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        Festival events only require a title and date. They will appear as special markers on the calendar.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={loading || (eventType === "contest" && isLastDayOfMonth)}
                  className={`px-6 py-2 ${eventType === "contest" && isLastDayOfMonth 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-gfgsc-green hover:bg-gfgsc-green-600"} text-white rounded-xl transition-colors`}
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