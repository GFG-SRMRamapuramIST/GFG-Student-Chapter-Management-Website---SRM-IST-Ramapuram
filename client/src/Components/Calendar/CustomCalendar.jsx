import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Importing icons
import {
  RiCalendarLine,
  RiVideoLine,
  RiTrophyLine,
  RiAddLine,
} from "react-icons/ri";
import { IoPeople } from "react-icons/io5";

import EventModal from "./EventModal";
import EventCreationModal from "./EventCreationModal";

import { ToastMsg } from "../../Utilities";

// Importing APIs
import { CoreMemberServices } from "../../Services";
import { useUser } from "../../Context/UserContext";
import { hasMinimumRole, ROLES } from "../../Utilities/roleUtils";
import { GiPartyPopper } from "react-icons/gi";

const TodayView = ({ events, onEventClick }) => {
  const todayEvents = events
    .filter((event) => {
      const eventDate = new Date(event.start_time || event.date);
      return eventDate.toDateString() === new Date().toDateString();
    })
    .sort((a, b) => {
      const dateA = new Date(a.start_time || a.date);
      const dateB = new Date(b.start_time || b.date);
      return dateA - dateB;
    });

  return todayEvents.length > 0 ? (
    todayEvents.map((event, idx) => (
      <motion.div
        key={idx}
        onClick={() => onEventClick(new Date())}
        whileHover={{ scale: 1.02, x: 4 }}
        className={`flex items-center gap-4 p-4 rounded-2xl shadow-lg cursor-pointer ${
          event.type === "contest"
            ? "bg-gradient-to-br from-[#002b46] to-[#004b7c] text-white"
            : event.type === "festival"
            ? "bg-gradient-to-br from-[#8a2387] to-[#e94057] text-white"
            : "bg-gradient-to-br from-[#00895e] to-[#00b377] text-white"
        }`}
      >
        <div className="p-2 bg-white/10 rounded-xl">
          {event.type === "contest" ? (
            <RiTrophyLine className="w-5 h-5" />
          ) : event.type === "festival" ? (
            <GiPartyPopper className="w-5 h-5" />
          ) : (
            <RiVideoLine className="w-5 h-5" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h5 className="font-medium">
              {event.type === "festival" && "🎉 "}{event.name}
            </h5>
            {event.type === "meeting" && (
              <div className="flex items-center gap-1 px-2 py-1 bg-white/10 rounded-full text-xs">
                <IoPeople className="w-3 h-3" />
                <span>{event.attendees}</span>
              </div>
            )}
          </div>
          <p className="text-sm text-white/80">
            {event.type === "festival" ? "All Day Event"
            : new Date(event.start_time).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </motion.div>
    ))
  ) : (
    // No events message remains the same
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

// Simple confetti effect component
const Confetti = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full animate-confetti"
          style={{
            backgroundColor: ['#ff0', '#f0f', '#0ff', '#f00', '#0f0'][i % 5],
            left: `${Math.random() * 100}%`,
            top: `-5%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${Math.random() * 2 + 2}s`,
          }}
        />
      ))}
    </div>
  );
};

const CustomCalendar = ({ events, fetchDashBoardCalenderData }) => {
  const { userRole } = useUser();
  
  const {
    meetingCreationFunction,
    contestCreationFunction,
    createFestivalFunction,
  } = CoreMemberServices();

  const [selectedDate, setSelectedDate] = useState(null);
  const [currentView, setCurrentView] = useState("month");
  const [showEventCreation, setShowEventCreation] = useState(false);

  // *************** Event Creation Handler Starts Here *******************

  const handleShowEventCreation = async () => {
    if (hasMinimumRole(userRole, ROLES.COREMEMBER)) {
      setShowEventCreation(true);
    } else {
      ToastMsg("You need CORE member access to create events", "error");
    }
  };

  // Meeting creation function
  const handleMeetingCreationFunction = async (meetingData) => {
    //console.log(meetingData)
    try {
      const response = await meetingCreationFunction(meetingData);
      //console.log(response)

      if (response.status == 200) {
        ToastMsg(response.data.message, "success");
      } else {
        ToastMsg(response.response.data.message, "error");
        console.log(response.response.data.message);
      }
    } catch (error) {
      ToastMsg("Internal Server Error!", "error");
      console.error("Meeting creation error:", error);
    } finally {
      fetchDashBoardCalenderData();
    }
  };

  // Contest creation function
  const handleContestCreationFunction = async (contestData) => {
    try {
      // Check if contest is scheduled for last day of the month
      const contestDate = new Date(contestData.date);
      const lastDayOfMonth = new Date(
        contestDate.getFullYear(),
        contestDate.getMonth() + 1,
        0
      ).getDate();

      if (contestDate.getDate() === lastDayOfMonth) {
        ToastMsg(
          "Contests cannot be scheduled on the last day of the month",
          "error"
        );
        return;
      }

      const response = await contestCreationFunction(contestData);
      //console.log(response);

      if (response.status == 200) {
        ToastMsg(response.data.message, "success");
      } else {
        ToastMsg(response.response.data.message, "error");
        console.log(response.response.data.message);
      }
    } catch (error) {
      ToastMsg("Internal Server Error!", "error");
      console.error("Meeting creation error:", error);
    } finally {
      fetchDashBoardCalenderData();
    }
  };

  // Festival creation function
  const handleFestivalCreationFunction = async (festivalData) => {
    try {
      const response = await createFestivalFunction(festivalData);
      //console.log(response);

      if (response.status == 200) {
        ToastMsg(response.data.message, "success");
      } else {
        ToastMsg(response.response.data.message, "error");
        console.log(response.response.data.message);
      }
    } catch (error) {
      ToastMsg("Internal Server Error!", "error");
      console.error("Festival creation error:", error);
    } finally {
      fetchDashBoardCalenderData();
    }
  };

  const handleAddEvent = async (eventData) => {
    //console.log(eventData);
    if (eventData.type == "meeting") {
      const formatedMeetingData = {
        title: eventData.name,
        description: eventData.description,
        meetingLink: eventData.link,
        meetingDate: eventData.date,
        meetingTime:
          eventData.time.length === 5 ? `${eventData.time}:00` : eventData.time,
        compulsory: eventData.attendees,
        toSendEmail: eventData.sendEmail,
      };
      await handleMeetingCreationFunction(formatedMeetingData);
    } else if (eventData.type == "contest") {
      const formatedContestData = {
        contestName: eventData.name,
        contestLink: eventData.link,
        platform: eventData.platform,
        startTime:
          eventData.time.length === 5 ? `${eventData.time}:00` : eventData.time,
        endTime:
          eventData.endTime.length === 5
            ? `${eventData.endTime}:00`
            : eventData.endTime,
        date: eventData.date,
        toSendEmail: eventData.sendEmail,
      };

      console.log("Formatted Contest Data:", formatedContestData);
      await handleContestCreationFunction(formatedContestData);
    } else {
      const formatedEventData = {
        title: eventData.name,
        date: eventData.date,
      };

      console.log("Formatted Event Data:", formatedEventData);
      await handleFestivalCreationFunction(formatedEventData);
    }
  };
  // *************** Event Creation Handler Ends Here *********************

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
    if (!date) return { meetings: 0, contests: 0, festivals: 0, events: [] };

    const dayEvents = events?.filter((event) => {
      if (event.type === "festival") {
        const festivalDate = new Date(event.date);
        return festivalDate.toDateString() === date.toDateString();
      } else {
        const eventDate = new Date(event.start_time);
        return eventDate.toDateString() === date.toDateString();
      }
    });

    return {
      meetings: dayEvents.filter((e) => e.type === "meeting").length,
      contests: dayEvents.filter((e) => e.type === "contest").length,
      festivals: dayEvents.filter((e) => e.type === "festival").length,
      events: dayEvents,
    };
  };

  // Check if a date is the last day of the month
  const isLastDayOfMonth = (date) => {
    if (!date) return false;
    return (
      new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate() ===
      date.getDate()
    );
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
        <div className="flex items-center gap-4">
          <button
            onClick={handleShowEventCreation}
            disabled={!hasMinimumRole(userRole, ROLES.COREMEMBER)}
            className={`flex items-center gap-2 rounded-xl ${
              hasMinimumRole(userRole, ROLES.COREMEMBER)
                ? "text-gfgsc-green hover:underline cursor-pointer"
                : "text-gray-400 cursor-not-allowed opacity-50"
            }`}
          >
            <RiAddLine className="w-4 h-4" />
            <span>Add Event</span>
          </button>

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
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-400"
            >
              {day}
            </div>
          ))}

          {days.map((date, idx) => {
            const { meetings, contests, festivals } = getEventsForDate(date);
            const isToday =
              date && date.toDateString() === new Date().toDateString();
            const hasEvents = meetings > 0 || contests > 0 || festivals > 0;
            const isLastDay = date && isLastDayOfMonth(date);
            const hasFestival = festivals > 0;

            return (
              <motion.button
                key={idx}
                whileHover={date ? { scale: 1.05 } : {}}
                onClick={() => date && hasEvents && setSelectedDate(date)}
                className={`relative aspect-square p-2 rounded-2xl group ${
                  date ? "hover:bg-gray-100" : "bg-gray-50/50"
                } ${
                  isToday
                    ? "bg-gfgsc-green-200/20 ring-2 ring-gfgsc-green"
                    : hasFestival
                    ? "bg-gradient-to-br from-purple-50 to-pink-50 border border-pink-200"
                    : isLastDay
                    ? "bg-red-100"
                    : idx % 7 === 0 && date // Check if Sunday and has date
                    ? "bg-gfgsc-green-200/50"
                    : ""
                }`}
                disabled={!date || !hasEvents}
                title={
                  isLastDay 
                    ? "No activity day" 
                    : hasFestival
                    ? "Festival day! 🎉"
                    : ""
                }
              >
                {date && (
                  <div className="h-full flex flex-col">
                    <span
                      className={`text-sm ${
                        isToday ? "font-bold text-gfgsc-green" : 
                        hasFestival ? "font-bold text-pink-600" : "text-gray-700"
                      }`}
                    >
                      {date.getDate()}
                      {hasFestival && <span> 🎉</span>}
                    </span>
                    
                    {/* Confetti effect for festival dates */}
                    {/* {hasFestival && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0"
                      >
                        <Confetti />
                      </motion.div>
                    )} */}
                    
                    {isLastDay && (
                      <div className="hidden group-hover:flex absolute top-0 left-0 right-0 bottom-0 bg-red-100/80 rounded-2xl justify-center items-center">
                        <span className="text-xs text-red-700 font-medium">
                          No activity day
                        </span>
                      </div>
                    )}
                    
                    {hasEvents && (
                      <div className="absolute sm:inset-x-2 bottom-0 sm:bottom-1 md:bottom-2 flex sm:flex-col gap-1">
                        {contests > 0 && (
                          <div className="flex items-center gap-1 text-xs bg-[#002b46] text-white rounded-full px-1 sm:px-2 py-1 sm:py-0.5">
                            <RiTrophyLine className="hidden sm:inline w-3 h-3" />
                            <span className="hidden md:inline">{contests}</span>
                          </div>
                        )}
                        {meetings > 0 && (
                          <div className="flex items-center gap-1 text-xs bg-[#00895e] text-white rounded-full px-1 sm:px-2 py-0.5">
                            <RiVideoLine className="hidden sm:inline w-3 h-3" />
                            <span className="hidden md:inline">{meetings}</span>
                          </div>
                        )}
                        {festivals > 0 && (
                          <div className="flex items-center gap-1 text-xs bg-gfgsc-pink text-white rounded-full px-1 sm:px-2 py-0.5">
                            <GiPartyPopper className="hidden sm:inline w-3 h-3" />
                            <span className="hidden md:inline">
                              {festivals}
                            </span>
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
        <TodayView
          events={events}
          onEventClick={(date) => setSelectedDate(date)}
        />
      )}

      <AnimatePresence>
        {selectedDate && (
          <EventModal
            selectedDate={selectedDate}
            events={getEventsForDate(selectedDate).events}
            onClose={() => setSelectedDate(null)}
            fetchDashBoardCalenderData={fetchDashBoardCalenderData}
          />
        )}
      </AnimatePresence>

      <EventCreationModal
        isOpen={showEventCreation}
        onClose={() => setShowEventCreation(false)}
        onSave={handleAddEvent}
      />
    </div>
  );
};

export default CustomCalendar;