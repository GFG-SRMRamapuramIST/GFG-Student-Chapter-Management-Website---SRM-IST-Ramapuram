import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { TeamCard, TeamDetailsModal, TeamHero } from "../Components";

const Teams = () => {
  const myTeam = {
    name: "Code Crusaders",
    rank: 1,
    totalQuestionsSolved: 1245,
    members: [
      { name: "Aarav Patel", solved: 342, rank: 18 },
      { name: "Sneha Sharma", solved: 298, rank: 17 },
      { name: "Rohan Gupta", solved: 276, rank: 16 },
      { name: "Priya Singh", solved: 249, rank: 12 },
      { name: "Vikram Reddy", solved: 180, rank: 14 },
    ],
  };
  const [selectedTeam, setSelectedTeam] = useState(null);

  const teams = [
    {
      name: "Code Wizards",
      rank: 2,
      membersCount: 5,
      totalQuestionsSolved: 1102,
      topMembers: [{ name: "Arjun" }, { name: "Meera" }, { name: "Rahul" }],
      averageRank: 1750,
      activeContests: 12,
      members: [
        { name: "Arjun Kumar", solved: 342, rank: 9 },
        { name: "Meera Patel", solved: 298, rank: 5 },
        { name: "Rahul Singh", solved: 276, rank: 10 },
        { name: "Neha Sharma", solved: 249, rank: 20 },
        { name: "Vikram Reddy", solved: 180, rank: 32 },
      ],
    },
    // Add more teams similarly
    {
      name: "Algo Architects",
      rank: 3,
      membersCount: 5,
      totalQuestionsSolved: 1045,
      topMembers: [{ name: "Sophia" }, { name: "Ethan" }, { name: "Zara" }],
      averageRank: 16,
      activeContests: 10,
      members: [
        // Member details
      ],
    },
  ];

  return (
    <div className=" min-h-screen p-6">
      <div className="container mx-auto">
        <TeamHero myTeam={myTeam} />

        <h2 className="text-3xl font-bold text-gfg-black mb-6">All Teams</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {teams.map((team, index) => (
            <TeamCard
              key={index}
              team={team}
              onDetails={() => setSelectedTeam(team)}
            />
          ))}
        </div>

        <AnimatePresence>
          {selectedTeam && (
            <TeamDetailsModal
              team={selectedTeam}
              onClose={() => setSelectedTeam(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Teams;
