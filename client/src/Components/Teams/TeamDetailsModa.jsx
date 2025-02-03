import {motion } from "framer-motion";
import { IoClose, IoCodeWorking, IoPeople, IoPersonCircle, IoTrophy } from "react-icons/io5";

const TeamDetailsModal = ({ team, onClose }) => {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 
                    flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          className="bg-white rounded-2xl max-w-2xl w-full 
                      max-h-[90vh] overflow-auto p-6 relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gfg-black 
                       hover:text-gfg-green transition-colors"
          >
            <IoClose className="text-3xl" />
          </button>
  
          <div className="flex items-center mb-6">
            <h2 className="text-3xl font-bold text-gfg-black mr-4">
              {team.name}
            </h2>
            <div className="flex items-center space-x-2">
              <IoTrophy className="text-gfg-green text-2xl" />
              <span className="font-semibold text-xl">#{team.rank}</span>
            </div>
          </div>
  
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gfgsc-green-200 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-3">
                <IoPeople className="text-gfg-green text-2xl" />
                <h3 className="font-bold">Team Statistics</h3>
              </div>
              <p>Total Members: {team.membersCount}</p>
              <p>Problems Solved: {team.totalQuestionsSolved}</p>
            </div>
            <div className="bg-gfgsc-green-200 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-3">
                <IoCodeWorking className="text-gfg-green text-2xl" />
                <h3 className="font-bold">Performance</h3>
              </div>
              <p>Average Rank: {team.averageRank}</p>
              <p>Active Contests: {team.activeContests}</p>
            </div>
          </div>
  
          <div className="mt-6">
            <h3 className="text-2xl font-bold mb-4">Team Members</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {team.members.map((member, index) => (
                <div
                  key={index}
                  className="bg-white border border-gfgsc-green-200 
                              rounded-xl p-4 text-center"
                >
                  <IoPersonCircle className="text-6xl mx-auto text-gfg-green mb-2" />
                  <h4 className="font-bold text-gfg-black">{member.name}</h4>
                  <p className="text-sm text-gray-500">Rank: {member.rank}</p>
                  <p className="text-sm">Problems Solved: {member.solved}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  export default TeamDetailsModal;