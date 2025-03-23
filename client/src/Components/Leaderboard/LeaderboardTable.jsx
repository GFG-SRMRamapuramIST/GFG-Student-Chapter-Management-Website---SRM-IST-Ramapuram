import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Importing Icons
import { IoChevronForwardOutline } from "react-icons/io5";
import { GfgCoin } from "../../Assets";

const LeaderboardTable = ({ data, isTeam = false, minimumPassingMark }) => {
  const navigate = useNavigate();

  const columns = isTeam
    ? [
        { key: "rank", label: "Rank" },
        { key: "name", label: "Team" },
        { key: "members", label: "Members" },
        { key: "points", label: "Points", align: "right" },
      ]
    : [
        { key: "rank", label: "Rank" },
        { key: "name", label: "Name" },
        { key: "position", label: "Position" },
        { key: "academicYear", label: "Academic Year" },
        // { key: 'team', label: 'Team' },
        { key: "points", label: "Points", align: "right" },
      ];

  const getPositionStyle = (position) => {
    // Core leadership positions
    if (position.includes("ADMIN")) {
      return "bg-gradient-to-r from-red-600 to-red-400 text-white";
    }
    if (position.includes("PRESIDENT") || position.includes("VICEPRESIDENT")) {
      return "bg-gradient-to-r from-purple-600 to-purple-400 text-white";
    }
    if (position.includes("COREMEMBER")) {
      return "bg-gradient-to-r from-blue-600 to-blue-400 text-white";
    }

    // Regular member
    if (position === "MEMBER") {
      return "bg-gfgsc-green/20 text-gfgsc-green";
    }

    // Default/USER
    return "bg-transparent border border-gfgsc-green text-gfgsc-green";
  };


  return (
    <div className="!z-10 bg-white rounded-xl shadow-md overflow-x-scroll overflow-y-hidden">
      <table className="w-full ">
        <thead className="bg-gfgsc-green-200">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-xs font-medium text-gfg-black uppercase tracking-wider
                            ${
                              col.align === "right" ? "text-right" : "text-left"
                            }`}
              >
                {col.label}
              </th>
            ))}
            {!isTeam && <th className="px-4 py-3"></th>}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            const isInDanger = item.points < minimumPassingMark;
            return (
              <motion.tr
                key={item.id}
                onClick={() => navigate(`/profile/${item.id}`)}
                whileHover={{
                  backgroundColor: isInDanger ? "#ffcccc" : "#b3e6d4",
                  transition: { duration: 0.1 },
                }}
                className={`border-b border-gfgsc-green-200 hover:cursor-pointer group
                          ${isInDanger ? "bg-red-100 text-red-800" : ""}`}
              >
                {isTeam ? (
                  <>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {item.rank}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {item.name}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        {item.members.slice(0, 3).map((pfp, i) => (
                          <img
                            key={i}
                            src={pfp}
                            alt=""
                            className="w-8 h-8 rounded-full -ml-2 first:ml-0 border-2 border-white"
                          />
                        ))}
                        {item.additionalMembers > 0 && (
                          <span className="ml-1 text-sm text-gray-500">
                            +{item.additionalMembers}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="flex items-center justify-center px-2 py-4 whitespace-nowrap text-right text-sm font-medium ">
                      {item.points}
                      <img
                        src={GfgCoin}
                        alt="GfgCoin"
                        className="w-6 h-6 ml-1"
                      />
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {item.rank}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap flex items-center space-x-3">
                      <img
                        src={item.pfp}
                        alt={item.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <span>{item.name}</span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`
                        px-3 py-1.5 rounded-full text-xs font-medium
                        ${getPositionStyle(item.position)}
                        transition-all duration-300 hover:shadow-md
                      `}
                      >
                        {item.position}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {item.academicYear}
                    </td>
                    {/* <td className="px-4 py-4 whitespace-nowrap text-sm">{item.team}</td> */}
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="inline-flex items-center justify-center">
                        {item.points}
                        <img
                          src={GfgCoin}
                          alt="GfgCoin"
                          className="w-6 h-6 ml-1"
                        />
                      </div>
                    </td>
                    <td className="pr-4 py-4 whitespace-nowrap text-right">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-gfgsc-green hover:text-gfg-green "
                      >
                        <IoChevronForwardOutline className="w-5 h-5 opacity-0 group-hover:opacity-100" />
                      </motion.button>
                    </td>
                  </>
                )}
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardTable;
