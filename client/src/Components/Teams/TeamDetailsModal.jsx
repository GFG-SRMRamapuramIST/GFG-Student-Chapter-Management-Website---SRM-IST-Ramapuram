import { motion } from "framer-motion";
import {
  IoAlertCircleOutline,
  IoClose,
  IoCodeWorking,
  IoCreateOutline,
  IoExitOutline,
  IoPeople,
  IoPersonAddOutline,
  IoPersonCircle,
  IoStatsChart,
  IoTrophy,
} from "react-icons/io5";
import { RotatingCloseButton } from "../../Utilities";

const TeamDetailsModal = ({ team, onClose }) => {

  const userActions = [
    {
      icon: <IoExitOutline className="text-red-500" />,
      text: "Leave Team",
      onClick: () => {/* Implementation */},
      className: "text-red-500 hover:bg-red-50"
    },
    {
      icon: <IoPersonAddOutline className="text-gfgsc-green" />,
      text: "Join Team",
      onClick: () => {/* Implementation */},
      className: "text-gfgsc-green hover:bg-gfgsc-green-50"
    },
    {
      icon: <IoCreateOutline className="text-blue-500" />,
      text: "Change Team Name",
      onClick: () => {/* Implementation */},
      className: "text-blue-500 hover:bg-blue-50"
    },
    {
      icon: <IoAlertCircleOutline className="text-yellow-500" />,
      text: "Report Issue",
      onClick: () => {/* Implementation */},
      className: "text-yellow-500 hover:bg-yellow-50"
    }
  ];

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
        <div
          className="absolute top-4 right-4 "
        >
          <RotatingCloseButton onClick={onClose} color="gfgsc-green" />
        </div>

        <div className="flex items-center mb-6">
          <h2 className="text-3xl font-bold text-gfg-black mr-4">
            {team.name}
          </h2>
        </div>

        <div className="flex flex-col w-full bg-gfgsc-green-200 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-4">
            <IoStatsChart className="text-gfgsc-green text-2xl" />
            <h3 className="font-bold">Team Statistics</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/50 rounded-xl p-4 hover:bg-white/70 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-[#002b46] rounded-lg">
                  <IoTrophy className="text-white text-xl" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Team Rank</p>
                  <p className="text-xl font-bold text-gfg-black">
                    #{team.rank}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/50 rounded-xl p-4 hover:bg-white/70 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gfgsc-green rounded-lg">
                  <IoPeople className="text-white text-xl" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Members</p>
                  <p className="text-xl font-bold text-gfg-black">
                    {team.membersCount}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/50 rounded-xl p-4 hover:bg-white/70 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gfgsc-green rounded-lg">
                  <IoCodeWorking className="text-white text-xl" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Points</p>
                  <p className="text-xl font-bold text-gfg-black">
                    {team.totalPoints}
                  </p>
                </div>
              </div>
            </div>
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
                <IoPersonCircle className="text-6xl mx-auto text-gfgsc-green mb-2" />
                <h4 className="font-bold text-gfg-black">{member.name}</h4>
                <p className="text-sm text-gray-500">Rank: {member.rank}</p>
                <p className="text-sm">Points: {member.points}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 border-t pt-4">
          <div className="flex justify-center space-x-4">
            {userActions.map((action, index) => (
              <motion.button
                key={index}
                onClick={action.onClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  flex items-center space-x-2 px-3 py-2 
                  rounded-lg text-sm transition-all duration-300
                  ${action.className}
                `}
              >
                {action.icon}
                <span>{action.text}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TeamDetailsModal;
