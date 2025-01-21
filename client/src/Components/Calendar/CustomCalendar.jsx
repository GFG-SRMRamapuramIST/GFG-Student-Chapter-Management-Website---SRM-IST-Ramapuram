import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdClose, MdVideoCall } from 'react-icons/md';
import { SiLeetcode, SiCodechef, SiCodeforces, SiGoogle } from 'react-icons/si';

// Platform icons mapping
const platformIcons = {
  leetcode: SiLeetcode,
  codechef: SiCodechef,
  codeforces: SiCodeforces,
  gmeet: SiGoogle
};

const EventModal = ({ selectedDate, events, onClose }) => {
  const meetings = events.filter(e => e.type === 'meeting');
  const contests = events.filter(e => e.type === 'contest');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/20 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gfg-black">
            {selectedDate.toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <MdClose className="text-xl text-gray-500" />
          </button>
        </div>

        {/* Contests Section */}
        {contests.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Contests</h4>
            {contests.map((contest, idx) => {
              const Icon = platformIcons[contest.platform];
              return (
                <motion.a
                  key={idx}
                  href={contest.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 p-3 bg-[#002b46] text-white rounded-xl mb-2"
                >
                  {Icon && <Icon className="text-xl" />}
                  <div className="flex-1">
                    <h5 className="font-medium">{contest.name}</h5>
                    <p className="text-sm">
                      {new Date(contest.time).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </motion.a>
              );
            })}
          </div>
        )}

        {/* Meetings Section */}
        {meetings.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Meetings</h4>
            {meetings.map((meeting, idx) => (
              <motion.a
                key={idx}
                href={meeting.link}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ x: 4 }}
                className="flex items-center gap-3 p-3 bg-[#00895e] text-white rounded-xl mb-2"
              >
                <MdVideoCall className="text-xl" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h5 className="font-medium">{meeting.name}</h5>
                    <span className="px-2 py-0.5 text-xs font-medium bg-white text-[#00895e] rounded-full">
                      {meeting.attendees}
                    </span>
                  </div>
                  <p className="text-sm">
                    {new Date(meeting.time).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

const CustomCalendar = ({ events }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentView, setCurrentView] = useState('month'); // 'month' or 'day'
  
  // Get current month's dates
  const getCurrentMonthDates = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const days = [];
    
    // Add previous month's days to complete the first week
    const firstDayOfWeek = firstDay.getDay();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push(null); // Empty cells for previous month
    }
    
    // Add current month's days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(today.getFullYear(), today.getMonth(), i));
    }
    
    return days;
  };

  // Get events for a specific date
  const getEventsForDate = (date) => {
    if (!date) return { meetings: 0, contests: 0, events: [] };
    
    const dayEvents = events.filter(event => {
      const eventDate = new Date(event.time);
      return eventDate.toDateString() === date.toDateString();
    });
    
    return {
      meetings: dayEvents.filter(e => e.type === 'meeting').length,
      contests: dayEvents.filter(e => e.type === 'contest').length,
      events: dayEvents
    };
  };

  const days = getCurrentMonthDates();

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 max-w-3xl mx-auto">
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gfg-black">
          {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentView('month')}
            className={`px-3 py-1 rounded-lg text-sm ${
              currentView === 'month'
                ? 'bg-gfgsc-green text-white'
                : 'bg-gfgsc-green-200 text-gfgsc-green'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setCurrentView('day')}
            className={`px-3 py-1 rounded-lg text-sm ${
              currentView === 'day'
                ? 'bg-gfgsc-green text-white'
                : 'bg-gfgsc-green-200 text-gfgsc-green'
            }`}
          >
            Day
          </button>
        </div>
      </div>

      {currentView === 'month' ? (
        /* Month View */
        <div className="grid grid-cols-7 gap-2">
          {/* Weekday headers */}
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {days.map((date, idx) => {
            const { meetings, contests } = getEventsForDate(date);
            const isToday = date && date.toDateString() === new Date().toDateString();
            const hasEvents = meetings > 0 || contests > 0;
            
            return (
              <motion.button
                key={idx}
                whileHover={date ? { scale: 1.05 } : {}}
                onClick={() => date && hasEvents && setSelectedDate(date)}
                className={`aspect-square p-2 rounded-xl ${
                  date 
                    ? 'hover:bg-gfgsc-green-200/20' 
                    : 'bg-gray-50'
                } ${
                  isToday 
                    ? 'border-2 border-gfgsc-green' 
                    : ''
                }`}
                disabled={!date || !hasEvents}
              >
                {date && (
                  <div className="h-full flex flex-col">
                    <span className={`text-sm ${
                      isToday ? 'font-bold text-gfgsc-green' : 'text-gray-600'
                    }`}>
                      {date.getDate()}
                    </span>
                    {hasEvents && (
                      <div className="flex-1 flex flex-col justify-end gap-1">
                        {contests > 0 && (
                          <div className="text-xs bg-[#002b46] text-white rounded-full px-2 py-0.5 flex flex-row items-center ">
                            +{contests}
                            <span className='hidden md:flex ml-1'>Contest</span>
                          </div>
                        )}
                        {meetings > 0 && (
                          <div className="text-xs bg-[#00895e] text-white rounded-full px-2 py-0.5 flex flex-row items-center ">
                            +{meetings}
                            <span className='hidden md:flex ml-1'>Meeting</span>
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
        /* Day View */
        <div className="space-y-4">
          {events
            .filter(event => {
              const eventDate = new Date(event.time);
              return eventDate.toDateString() === new Date().toDateString();
            })
            .sort((a, b) => new Date(a.time) - new Date(b.time))
            .map((event, idx) => (
              <motion.a
                key={idx}
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 p-3 rounded-xl ${
                  event.type === 'contest' 
                    ? 'bg-[#002b46] text-white' 
                    : 'bg-[#00895e] text-white'
                }`}
              >
                {/* {event.type === 'contest' ? (
                  platformIcons[event.platform] && 
                  <platformIcons[event.platform] className="text-xl" />
                ) : (
                  <MdVideoCall className="text-xl" />
                )} */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h5 className="font-medium">{event.name}</h5>
                    {event.type === 'meeting' && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-white text-[#00895e] rounded-full">
                        {event.attendees}
                      </span>
                    )}
                  </div>
                  <p className="text-sm">
                    {new Date(event.time).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </motion.a>
            ))}
        </div>
      )}

      {/* Event Modal */}
      <AnimatePresence>
        {selectedDate && (
          <EventModal
            selectedDate={selectedDate}
            events={getEventsForDate(selectedDate).events}
            onClose={() => setSelectedDate(null)}
          />
        )}
      </AnimatePresence>

      {/* Key for colors */}
      <div className="mt-4 flex md:hidden justify-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#002b46] rounded-full"></div>
          <span>Contest</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#00895e] rounded-full"></div>
          <span>Meeting</span>
        </div>
      </div>
    </div>
  );
};

export default CustomCalendar;