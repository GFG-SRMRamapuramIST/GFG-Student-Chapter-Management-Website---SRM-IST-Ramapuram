import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import PropTypes from "prop-types";

// Icons
import {
  RiCalendarLine,
  RiVideoLine,
  RiTeamLine,
  RiTrophyLine,
  RiLinkM,
  RiTimeLine,
  RiUserLine,
  RiFileTextLine,
  RiSaveLine,
  RiEditLine,
  RiDeleteBin6Line,
  RiCloseLine,
  RiInformationLine,
} from "react-icons/ri";
import { platformIcons } from "../../Constants";

// ============ Constants ============
const ATTENDEE_OPTIONS = ["ALL", "CORE"];
const PLATFORM_OPTIONS = ["leetcode", "codechef", "codeforces"];

const EventModal = ({ selectedDate, events, onClose }) => {
  // ============ State Management ============
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [momContent, setMomContent] = useState("");
  const [isEditingMom, setIsEditingMom] = useState(false);
  const [editedEventData, setEditedEventData] = useState(null);

  // Filter events by type
  const meetings = events.filter((e) => e.type === "meeting");
  const contests = events.filter((e) => e.type === "contest");

  // ============ Event Modal Handlers ============
  const toggleEventExpand = (idx, type) => {
    const key = `${type}-${idx}`;
    setExpandedEvent(expandedEvent === key ? null : key);
    setIsEditingMom(false);
    setEditingEvent(null);
  };

  const handleEditStart = (event, type, idx) => { 
    const key = `${type}-${idx}`;
    setExpandedEvent(key);
    setEditedEventData(event);
    setEditingEvent(event.id);
  };

  const handleEditCancel = () => {
    setEditedEventData(null);
    setEditingEvent(null);
  };

  const handleEditSave = (event) => {
    console.log("Editing event:", {
      original: event,
      updated: editedEventData,
    });
    setEditingEvent(null);
    setEditedEventData(null);
  };

  const handleDelete = (event) => {
    setExpandedEvent(null);
    console.log("Deleting event:", event);
  };

  // ============ MoM Handlers ============
  const handleMomEdit = () => {
    setIsEditingMom(true);
  };

  const handleMomSave = () => {
    console.log("Saving MoM:", {
      eventId: expandedEvent,
      content: momContent,
    });
    setIsEditingMom(false);
  };

  // ============ Render Helper Functions ============
  const renderEventCard = (event, idx, type) => {
    const isExpanded = expandedEvent === `${type}-${idx}`;
    const isEditing = editingEvent === event.id;
    const Icon =
      type === "contest" ? platformIcons[event.platform] : RiVideoLine;

    return (
      <div key={event.id} className="space-y-2">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`flex items-center gap-4 p-4 bg-gradient-to-br ${
            type === "contest"
              ? "from-[#002b46] to-[#004b7c]"
              : "from-[#00895e] to-[#00b377]"
          } text-white rounded-2xl shadow-lg cursor-pointer`}
          onClick={() => toggleEventExpand(idx, type)}
        >
          <div className="p-2 bg-white/10 rounded-xl">
            <Icon className="w-5 h-5" />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h5 className="font-medium">{event.name}</h5>
                {type === "meeting" && (
                  <span className="px-2 py-1 bg-white/10 rounded-full text-xs flex items-center gap-1">
                    <RiTeamLine className="w-3 h-3" />
                    {event.attendees}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditStart(event, type, idx);
                  }}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <RiEditLine className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(event);
                  }}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <RiDeleteBin6Line className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-sm text-white/80">
              {new Date(event.time).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </motion.div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white border border-gray-200 rounded-xl p-4 space-y-4"
            >
              {isEditing ? (
                // Edit Form
                <div className="space-y-4">
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editedEventData.name}
                      onChange={(e) =>
                        setEditedEventData({
                          ...editedEventData,
                          name: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                      placeholder="Event name"
                    />

                    <input
                      type="datetime-local"
                      value={editedEventData.time}
                      onChange={(e) =>
                        setEditedEventData({
                          ...editedEventData,
                          time: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    />

                    <input
                      type="url"
                      value={editedEventData.link}
                      onChange={(e) =>
                        setEditedEventData({
                          ...editedEventData,
                          link: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                      placeholder="Event link"
                    />

                    {type === "meeting" && (
                      <>
                        <textarea
                          value={editedEventData.description}
                          onChange={(e) =>
                            setEditedEventData({
                              ...editedEventData,
                              description: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                          placeholder="Description"
                          rows={3}
                        />

                        <select
                          value={editedEventData.attendees}
                          onChange={(e) =>
                            setEditedEventData({
                              ...editedEventData,
                              attendees: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                        >
                          {ATTENDEE_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </>
                    )}

                    {type === "contest" && (
                      <select
                        value={editedEventData.platform}
                        onChange={(e) =>
                          setEditedEventData({
                            ...editedEventData,
                            platform: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                      >
                        {PLATFORM_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={handleEditCancel}
                      className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleEditSave(event)}
                      className="px-4 py-2 bg-gfgsc-green text-white rounded-lg hover:bg-emerald-600 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                // Event Details View
                <div className="space-y-4">
                  {type === "meeting" && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <RiInformationLine className="w-4 h-4" />
                        <span className="font-medium">Description</span>
                      </div>
                      <p className="text-sm text-gray-700 pl-6">
                        {event.description || "No description provided"}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <RiLinkM className="w-4 h-4" />
                      <a
                        href={event.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {type === "meeting" ? "Join Meeting" : "View Contest"}
                      </a>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <RiTimeLine className="w-4 h-4" />
                      <span>
                        {new Date(event.time).toLocaleString("en-US", {
                          dateStyle: "full",
                          timeStyle: "short",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <RiUserLine className="w-4 h-4" />
                      <span>Created by {event.createdBy || "Anonymous"}</span>
                    </div>
                  </div>

                  {type === "meeting" && (
                    <div className="space-y-3 border-t pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <RiFileTextLine className="w-4 h-4" />
                          <span>Minutes of Meeting</span>
                        </div>
                        <button
                          onClick={handleMomEdit}
                          className="flex items-center gap-1 px-3 py-1 bg-gfgsc-green text-white rounded-lg text-sm hover:bg-emerald-600 transition-colors"
                        >
                          <RiEditLine className="w-4 h-4" />
                          {momContent ? "Edit MoM" : "Create MoM"}
                        </button>
                      </div>

                      {isEditingMom ? (
                        <div className="space-y-3">
                          <textarea
                            className="w-full h-48 p-3 border border-gray-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-gfgsc-green"
                            placeholder="Write the minutes of meeting..."
                            value={momContent}
                            onChange={(e) => setMomContent(e.target.value)}
                          />
                          <div className="flex justify-end">
                            <button
                              onClick={handleMomSave}
                              className="flex items-center gap-1 px-4 py-2 bg-gfgsc-green text-white rounded-lg text-sm hover:bg-emerald-600 transition-colors"
                            >
                              <RiSaveLine className="w-4 h-4" />
                              Save MoM
                            </button>
                          </div>
                        </div>
                      ) : momContent ? (
                        <div className="prose prose-sm max-w-none p-4 bg-gray-50 rounded-lg">
                          {momContent}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">
                          No minutes of meeting recorded yet.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // ============ Main Render ============
  return (
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
        className="bg-white rounded-3xl p-6 max-w-3xl w-full shadow-2xl max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-gfgsc-green/10 p-3 rounded-2xl">
              <RiCalendarLine className="text-gfgsc-green w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              {selectedDate.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
              })}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <RiCloseLine className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Contests Section */}
          {contests.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <RiTrophyLine className="w-4 h-4 text-gfgsc-green" />
                <h4 className="font-medium text-gray-600">Contests</h4>
              </div>
              <div className="space-y-3">
                {contests.map((contest, idx) =>
                  renderEventCard(contest, idx, "contest")
                )}
              </div>
            </div>
          )}

          {/* Meetings Section */}
          {meetings.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <RiVideoLine className="w-4 h-4 text-gfgsc-green" />
                <h4 className="font-medium text-gray-600">Meetings</h4>
              </div>
              <div className="space-y-3">
                {meetings.map((meeting, idx) =>
                  renderEventCard(meeting, idx, "meeting")
                )}
              </div>
            </div>
          )}

          {/* No Events Message */}
          {events.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No events scheduled for this date.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

EventModal.propTypes = {
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.oneOf(["meeting", "contest"]).isRequired,
      name: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
      createdBy: PropTypes.string,
      // Meeting specific props
      description: PropTypes.string,
      attendees: PropTypes.oneOf(ATTENDEE_OPTIONS),
      // Contest specific props
      platform: PropTypes.oneOf(PLATFORM_OPTIONS),
      endTime: PropTypes.string,
    })
  ).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EventModal;
