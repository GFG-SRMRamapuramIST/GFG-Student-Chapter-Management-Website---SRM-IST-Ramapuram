import { motion } from "framer-motion";
import { GfgCoin } from "../../Assets";

const LeaderboardHero = ({ topThree, isTeam=false, minimumPassingMark }) => {
  // Set minimum passing mark as a variable for later backend use
  
  const medalColors = [
    "bg-gradient-to-br from-[#C0C0C0] to-[#A9A9A9] border-[#C0C0C0]", // Silver (2nd Place)
    "bg-gradient-to-br from-[#FFD700] to-[#FFA500] border-[#FFD700]", // Gold (1st Place)
    "bg-gradient-to-br from-[#CD7F32] to-[#8B4513] border-[#CD7F32]"  // Bronze (3rd Place)
  ];

  const podiumHeights = [
    "h-36", // 2nd Place (Silver)
    "h-48", // 1st Place (Gold)
    "h-32"  // 3rd Place (Bronze)
  ];

  const [gold, silver, bronze] = topThree;
  const orderedMembers = [silver, gold, bronze];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-center items-end z-1 px-4 h-64 relative"
    >
      {orderedMembers.map((member, index) => (
        <motion.div
          key={member.id}
          className={`
            flex flex-col items-center justify-end pb-2 
            w-36 shadow-lg 
            ${podiumHeights[index]} 
            ${medalColors[index]}
            ${index === 0 ? "rounded-tl-lg" : index === 1 ? "rounded-t-lg" : "rounded-tr-lg"}
            relative
          `}
        >
          {!isTeam && (
            <img
              src={member.pfp}
              alt={member.name}
              className="absolute -top-8 left-1/2 transform -translate-x-1/2 
              w-20 h-20 rounded-full border-4 border-white shadow-md"
            />
          )}
          <div className="text-center pb-4">
            <h3 className="text-white font-bold">{member.name}</h3>
            <p className="text-white/90 text-sm inline-flex justify-center items-center px-2 py-0.5 bg-white/20 rounded-full">
              {member.points} 
              <img src={GfgCoin} alt="GfgCoin" className="w-6 h-6 ml-1" />
            </p>
          </div>
        </motion.div>
      ))}
      
      {/* Minimum passing mark indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="hidden md:flex absolute bottom-2 right-6 md:right-8 lg:right-12 bg-white/10 backdrop-blur-sm 
                   px-3 py-2 rounded-xl shadow-lg border border-black/60 
                   text-black text-xs md:text-sm font-medium z-10"
      >
        <span className="flex items-center">
          {/* <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span> */}
          Minimum Passing Mark: {minimumPassingMark}
          <img src={GfgCoin} alt="GfgCoin" className="w-4 h-4 ml-1" />
        </span>
      </motion.div>
    </motion.div>
  );
};

export default LeaderboardHero;