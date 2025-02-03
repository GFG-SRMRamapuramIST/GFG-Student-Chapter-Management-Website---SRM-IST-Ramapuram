import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaCalendarAlt, 
  FaTrophy, 
  FaCode, 
  FaBolt, 
  FaClock 
} from 'react-icons/fa';

const UpcomingEvents = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  const contestData = [
    {
      id: 1,
      platform: 'LeetCode',
      name: 'Weekly Contest 342',
      date: '2024-02-10',
      time: '19:30 IST',
      difficulty: 'Medium',
      registeredParticipants: 54,
      icon: <FaCode className="text-purple-600" />
    },
    {
      id: 2,
      platform: 'CodeChef',
      name: 'GFGSC College Challenge',
      date: '2024-02-15',
      time: '20:00 IST',
      difficulty: 'Hard',
      registeredParticipants: 42,
      icon: <FaTrophy className="text-orange-600" />
    },
    {
      id: 3,
      platform: 'Codeforces',
      name: 'Div 2 Round',
      date: '2024-02-18',
      time: '21:00 IST',
      difficulty: 'Advanced',
      registeredParticipants: 36,
      icon: <FaBolt className="text-blue-600" />
    }
  ];

  const renderContests = () => (
    <div className="grid gap-4 md:grid-cols-3">
      {contestData.map(contest => (
        <motion.div 
          key={contest.id}
          whileHover={{ scale: 1.05 }}
          className="bg-white shadow-lg rounded-xl p-5 border border-gfgsc-green-200"
        >
          <div className="flex justify-between items-center mb-3">
            {contest.icon}
            <span className="text-sm text-gray-500">{contest.platform}</span>
          </div>
          <h3 className="font-bold text-lg mb-2">{contest.name}</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <FaCalendarAlt />
              <span>{contest.date}</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaClock />
              <span>{contest.time}</span>
            </div>
            <div className="flex justify-between items-center mt-3">
              <span className={`
                px-3 py-1 rounded-full text-xs
                ${contest.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  contest.difficulty === 'Hard' ? 'bg-red-100 text-red-800' :
                  'bg-green-100 text-green-800'}
              `}>
                {contest.difficulty}
              </span>
              <span className="text-xs text-gray-500">
                {contest.registeredParticipants} Registered
              </span>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="w-full mt-4 bg-gfgsc-green text-white py-2 rounded-lg hover:bg-gfgsc-green-400 transition"
          >
            Register Now
          </motion.button>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="py-8 my-8 bg-gfg-white px-6 rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gfg-black">
          Upcoming Events/Meetings
        </h2>
        <div className="flex space-x-2">
          {['upcoming', 'past', 'internal'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                px-4 py-2 rounded-full text-sm capitalize
                ${activeTab === tab 
                  ? 'bg-gfgsc-green text-white' 
                  : 'bg-gray-100 text-gray-600'}
              `}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      
      {activeTab === 'upcoming' && renderContests()}
    </div>
  );
};

export default UpcomingEvents;