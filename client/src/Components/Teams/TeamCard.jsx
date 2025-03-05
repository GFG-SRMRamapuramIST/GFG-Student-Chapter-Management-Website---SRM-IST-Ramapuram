import { motion } from "framer-motion";
import { IoCodeWorking, IoPeople, IoTrophy } from "react-icons/io5";
import { GfgCoin } from "../../Assets";

const TeamCard = ({ team, onDetails }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-2xl p-5 shadow-lg 
                    border-2 border-transparent hover:border-gfgsc-green 
                    transition-all duration-300 cursor-pointer"
      onClick={onDetails}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold text-gfg-black">{team.name}</h3>
        <div className="flex items-center space-x-2">
          <IoTrophy className="text-gfg-green text-xl" />
          <span className="font-semibold">#{team.rank}</span>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <IoPeople className="text-gfg-green text-xl" />
          <span>{team.membersCount} Members</span>
        </div>
        <div className="flex items-center space-x-2">
          <IoCodeWorking className="text-gfg-green text-xl" />
          <span>{team.totalPoints} 
            <img src={GfgCoin} alt="GfgCoin" className="w-4 h-4 ml-1" />
          </span>
        </div>
      </div>
      <div className="mt-4 flex space-x-2">
        {team.topMembers.map((member, index) => (
          <div
            key={index}
            className="w-10 h-10 bg-gfgsc-green-200 
                          rounded-full flex items-center justify-center 
                          text-sm font-bold text-gfg-black"
          >
            {member.name.charAt(0)}
          </div>
        ))}
        {team.topMembers.length < team.membersCount && (
          <div
            className="w-10 h-10 bg-gfgsc-green-200 
                            rounded-full flex items-center justify-center 
                            text-sm font-bold text-gfg-black"
          >
            +{team.membersCount - team.topMembers.length}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TeamCard;
