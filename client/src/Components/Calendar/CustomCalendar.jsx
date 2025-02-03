import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiCalendarLine,
  RiCloseLine,
  RiVideoLine,
  RiTrophyLine,
  RiTeamLine,
} from "react-icons/ri";
import { platformIcons } from "../../Constants";
import { IoPeople } from "react-icons/io5";

const EventModal = ({ selectedDate, events, onClose }) => {
  const meetings = events.filter((e) => e.type === "meeting");
  const contests = events.filter((e) => e.type === "contest");

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
        className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
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
          <motion.button
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl"
          >
            <RiCloseLine className="w-5 h-5 text-gray-500" />
          </motion.button>
        </div>

        <div className="space-y-6">
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
                  <motion.a
                    key={idx}
                    href={meeting.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-4 p-4 bg-gradient-to-br from-[#00895e] to-[#00b377] text-white rounded-2xl shadow-lg"
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
                  </motion.a>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const TodayView = ({ events }) => {
  const todayEvents = events
    .filter((event) => {
      const eventDate = new Date(event.time);
      return eventDate.toDateString() === new Date().toDateString();
    })
    .sort((a, b) => new Date(a.time) - new Date(b.time));

  return todayEvents.length > 0 ? (
    todayEvents.map((event, idx) => (
      <motion.a
        key={idx}
        href={event.link}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.02, x: 4 }}
        className={`flex items-center gap-4 p-4 rounded-2xl shadow-lg ${
          event.type === "contest"
            ? "bg-gradient-to-br from-[#002b46] to-[#004b7c] text-white"
            : "bg-gradient-to-br from-[#00895e] to-[#00b377] text-white"
        }`}
      >
        <div className="p-2 bg-white/10 rounded-xl">
          {event.type === "contest" ? (
            <RiTrophyLine className="w-5 h-5" />
          ) : (
            <RiVideoLine className="w-5 h-5" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h5 className="font-medium">{event.name}</h5>
            {event.type === "meeting" && (
              <div className="flex items-center gap-1 px-2 py-1 bg-white/10 rounded-full text-xs">
                <IoPeople className="w-3 h-3" />
                <span>{event.attendees}</span>
              </div>
            )}
          </div>
          <p className="text-sm text-white/80">
            {new Date(event.time).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </motion.a>
    ))
  ) : (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-8 text-center"
    >
      <div className="w-24 h-24 mb-4 text-gfgsc-green">
        <RiCalendarLine className="w-full h-full" />
      </div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        All Clear Today!
      </h3>
      <p className="text-gray-500">
        No meetings or contests scheduled. Time to focus on your practice!
      </p>
    </motion.div>
  );
};

const CustomCalendar = ({ events }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentView, setCurrentView] = useState("month");

  const getCurrentMonthDates = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const days = [];

    const firstDayOfWeek = firstDay.getDay();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push(null);
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(today.getFullYear(), today.getMonth(), i));
    }

    return days;
  };

  const getEventsForDate = (date) => {
    if (!date) return { meetings: 0, contests: 0, events: [] };

    const dayEvents = events.filter((event) => {
      const eventDate = new Date(event.time);
      return eventDate.toDateString() === date.toDateString();
    });

    return {
      meetings: dayEvents.filter((e) => e.type === "meeting").length,
      contests: dayEvents.filter((e) => e.type === "contest").length,
      events: dayEvents,
    };
  };

  const days = getCurrentMonthDates();

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl p-6 md:p-8 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gfg-black">
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <p className="text-gray-500 mt-1">Plan your coding journey</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 p-1 rounded-2xl">
            <button
              onClick={() => setCurrentView("month")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                currentView === "month"
                  ? "bg-white text-gfg-black shadow-sm"
                  : "text-gray-500"
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setCurrentView("day")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                currentView === "day"
                  ? "bg-white text-gfg-black shadow-sm"
                  : "text-gray-500"
              }`}
            >
              Today
            </button>
          </div>
        </div>
      </div>

      {currentView === "month" ? (
        <div className="grid grid-cols-7 gap-4">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-400"
            >
              {day}
            </div>
          ))}

          {days.map((date, idx) => {
            const { meetings, contests } = getEventsForDate(date);
            const isToday =
              date && date.toDateString() === new Date().toDateString();
            const hasEvents = meetings > 0 || contests > 0;

            return (
              <motion.button
                key={idx}
                whileHover={date ? { scale: 1.05 } : {}}
                onClick={() => date && hasEvents && setSelectedDate(date)}
                className={`relative aspect-square p-2 rounded-2xl ${
                  date ? "hover:bg-gray-100" : "bg-gray-50/50"
                } ${
                  isToday
                    ? "bg-gfgsc-green-200/20 ring-2 ring-gfgsc-green"
                    : idx % 7 === 6 && date // Check if Sunday and has date
                    ? "bg-gfgsc-green-200/50"
                    : ""
                }`}
                disabled={!date || !hasEvents}
              >
                {date && (
                  <div className="h-full flex flex-col">
                    <span
                      className={`text-sm ${
                        isToday ? "font-bold text-gfgsc-green" : "text-gray-700"
                      }`}
                    >
                      {date.getDate()}
                    </span>
                    {hasEvents && (
                      <div className="absolute inset-x-2 bottom-2 flex flex-col gap-1">
                        {contests > 0 && (
                          <div className="flex items-center gap-1 text-xs bg-[#002b46] text-white rounded-full px-2 py-0.5">
                            <RiTrophyLine className="w-3 h-3" />
                            <span className="hidden md:inline">{contests}</span>
                          </div>
                        )}
                        {meetings > 0 && (
                          <div className="flex items-center gap-1 text-xs bg-[#00895e] text-white rounded-full px-2 py-0.5">
                            <RiVideoLine className="w-3 h-3" />
                            <span className="hidden md:inline">{meetings}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      ) : (
        <TodayView events={events} />
      )}

      <AnimatePresence>
        {selectedDate && (
          <EventModal
            selectedDate={selectedDate}
            events={getEventsForDate(selectedDate).events}
            onClose={() => setSelectedDate(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomCalendar;
