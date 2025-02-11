import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import PropTypes from 'prop-types';

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
  RiInformationLine,
  RiEditLine,
} from "react-icons/ri";
import { platformIcons } from "../../Constants";

// Components
import { RotatingCloseButton } from "../../Utilities";

const EventModal = ({ selectedDate, events, onClose }) => {
  const meetings = events.filter((e) => e.type === "meeting");
  const contests = events.filter((e) => e.type === "contest");
  const [expandedMeeting, setExpandedMeeting] = useState(null);
  const [momContent, setMomContent] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [momEditedBy, setMomEditedBy] = useState(null);

  const toggleMeetingExpand = (idx) => {
    setExpandedMeeting(expandedMeeting === idx ? null : idx);
    setShowEditor(false); // Reset editor state when collapsing/expanding meetings
  };

  const handleSave = () => {
    console.log("MoM content:", momContent);
    setMomEditedBy("John Doe"); // Replace with actual user
    setShowEditor(false);
  };

  const handleEditClick = () => {
    setShowEditor(true);
  };

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
        {/* ... header ... */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-gfgsc-green-200 p-3 rounded-2xl">
              <RiCalendarLine className="text-gfgsc-green w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-gfg-black">
              {selectedDate.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
              })}
            </h3>
          </div>
          <RotatingCloseButton onClick={onClose} />
        </div>

        <div className="space-y-6">
          {/* ... Contests section ... */}
          {contests.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <RiTrophyLine className="w-4 h-4 text-gfgsc-green" />
                <h4 className="font-medium text-gray-600">Contests</h4>
              </div>
              <div className="space-y-3">
                {contests.map((contest, idx) => {
                  const Icon = platformIcons[contest.platform];
                  return (
                    <motion.a
                      key={idx}
                      href={contest.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center gap-4 p-4 bg-gradient-to-br from-[#002b46] to-[#004b7c] text-white rounded-2xl shadow-lg"
                    >
                      <div className="p-2 bg-white/10 rounded-xl">
                        {Icon && <Icon className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium">{contest.name}</h5>
                        <p className="text-sm text-white/80">
                          {new Date(contest.time).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </motion.a>
                  );
                })}
              </div>
            </div>
          )}

          {meetings.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <RiVideoLine className="w-4 h-4 text-gfgsc-green" />
                <h4 className="font-medium text-gray-600">Meetings</h4>
              </div>
              <div className="space-y-3">
                {meetings.map((meeting, idx) => (
                  <div key={idx} className="space-y-2">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center gap-4 p-4 bg-gradient-to-br from-[#00895e] to-[#00b377] text-white rounded-2xl shadow-lg cursor-pointer"
                      onClick={() => toggleMeetingExpand(idx)}
                    >
                      <div className="p-2 bg-white/10 rounded-xl">
                        <RiVideoLine className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h5 className="font-medium">{meeting.name}</h5>
                          <div className="flex items-center gap-1 px-2 py-1 bg-white/10 rounded-full text-xs">
                            <RiTeamLine className="w-3 h-3" />
                            <span>{meeting.attendees}</span>
                          </div>
                        </div>
                        <p className="text-sm text-white/80">
                          {new Date(meeting.time).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </motion.div>

                    <AnimatePresence>
                      {expandedMeeting === idx && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-white border border-gray-200 rounded-xl p-4 space-y-4"
                        >
                          {/* Meeting Description */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <RiInformationLine className="w-4 h-4" />
                              <span className="font-medium">Description</span>
                            </div>
                            <p className="text-sm text-gray-700 pl-6">
                              {meeting.description || "No description provided"}
                            </p>
                          </div>

                          {/* Meeting Details */}
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <RiLinkM className="w-4 h-4" />
                              <a
                                href={meeting.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                Join Meeting
                              </a>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <RiTimeLine className="w-4 h-4" />
                              <span>
                                {new Date(meeting.time).toLocaleString(
                                  "en-US",
                                  {
                                    dateStyle: "full",
                                    timeStyle: "short",
                                  }
                                )}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <RiUserLine className="w-4 h-4" />
                              <span>
                                Created by {meeting.createdBy || "John Doe"}
                              </span>
                            </div>
                          </div>

                          {/* Minutes of Meeting Section */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <RiFileTextLine className="w-4 h-4" />
                                <span>Minutes of Meeting</span>
                              </div>
                              <button
                                onClick={handleEditClick}
                                className="flex items-center gap-1 px-3 py-1 bg-gfgsc-green text-white rounded-lg text-sm hover:bg-gfgsc-green-600 transition-colors"
                              >
                                <RiEditLine className="w-4 h-4" />
                                {momEditedBy ? "Edit MoM" : "Create MoM"}
                              </button>
                            </div>

                            {/* Show last edited by if MoM exists */}
                            {momEditedBy && !showEditor && (
                              <div className="text-sm text-gray-500">
                                Last edited by {momEditedBy}
                              </div>
                            )}

                            {/* mom Content Preview (when not editing) */}
                            {momContent && !showEditor && (
                              <div className="prose prose-sm max-w-none p-4 bg-gray-50 rounded-lg">
                                <div className="mom-preview">
                                  {momContent}
                                </div>
                              </div>
                            )}

                            {/* MoM Editor */}
                            {showEditor && (
                              <div className="space-y-3">
                                <div className="flex flex-col w-full gap-4">
                                  <div className="space-y-2">
                                    <div className="text-sm text-gray-500 font-medium">
                                      Editor
                                    </div>
                                    <textarea
                                      className="w-full h-64 p-3 border border-gray-200 rounded-lg text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-gfgsc-green"
                                      placeholder="Write your MOM here..."
                                      value={momContent}
                                      onChange={(e) =>
                                        setMomContent(e.target.value)
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="flex justify-end">
                                  <button
                                    onClick={handleSave}
                                    className="flex items-center gap-1 px-4 py-2 bg-gfgsc-green text-white rounded-lg text-sm hover:bg-gfgsc-green-600 transition-colors"
                                  >
                                    <RiSaveLine className="w-4 h-4" />
                                    Save
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
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
      type: PropTypes.oneOf(['meeting', 'contest']).isRequired,
      name: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
      // For meetings
      description: PropTypes.string,
      attendees: PropTypes.oneOf(['ALL', 'CORE']),
      createdBy: PropTypes.string,
      // For contests
      platform: PropTypes.oneOf(['leetcode', 'codechef', 'codeforces']),
      endTime: PropTypes.string
    })
  ).isRequired,
  onClose: PropTypes.func.isRequired
};

export default EventModal;
