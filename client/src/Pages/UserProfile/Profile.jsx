import { OverviewSection, ProfileHero, UpcomingEvents } from "../../Components";
import { platformIcons } from "../../Constants";

const userProfile = {
  name: "Ananya Sharma",
  email: "ananya.sharma@college.edu",
  year: "3rd Year",
  department: "Computer Science",
  profilePic: "/api/placeholder/200/200",
  platforms: {
    leetcode: { handle: "ananya_codes", rating: 1872 },
    codeforces: { handle: "geekgirl", rating: 1625 },
    github: { handle: "ananyasharma", repos: 24 },
  },
  stats: {
    totalQuestions: 512,
    contestsParticipated: 18,
    currentStreak: 42,
  },
};

const platformData = {
  leetcode: {
    name: "LeetCode",
    profile: "https://leetcode.com/ananya_codes",
    rating: 1872,
    contestsParticipated: 24,
    totalProblems: 214,
    rank: 3245,
    potd: {
      title: "Two Sum",
      difficulty: "Easy"
    },
    progressData: [
      { name: "Easy", solved: 100, total: 150, color: "green" },
      { name: "Medium", solved: 80, total: 100, color: "yellow" },
      { name: "Hard", solved: 34, total: 50, color: "red" }
    ]
  },
  codeforces: {
    name: "Codeforces",
    profile: "https://codeforces.com/profile/geekgirl",
    rating: 1625,
    contestsParticipated: 18,
    totalProblems: 312,
    rank: 2987,
    potd: {
      title: "Div 2 A",
      difficulty: "Medium"
    },
    progressData: [
      { name: "Easy", solved: 120, total: 200, color: "green" },
      { name: "Medium", solved: 150, total: 200, color: "yellow" },
      { name: "Hard", solved: 42, total: 60, color: "red" }
    ]
  },
  codechef: {
    name: "CodeChef",
    profile: "https://codechef.com/users/ananyasharma",
    rating: 1450,
    contestsParticipated: 12,
    totalProblems: 156,
    rank: 1876,
    potd: {
      title: "Chef and Strings",
      difficulty: "Hard"
    },
    progressData: [
      { name: "Easy", solved: 50, total: 100, color: "green" },
      { name: "Medium", solved: 60, total: 80, color: "yellow" },
      { name: "Hard", solved: 46, total: 60, color: "red" }
    ]
  }
};

const contestData = [
  {
    id: 1,
    platform: 'LeetCode',
    name: 'Weekly Contest 342',
    date: '2024-02-10',
    time: '19:30 IST',
    difficulty: 'Medium',
    registeredParticipants: 54,
    icon: <platformIcons.leetcode className="text-purple-600" />
  },
  {
    id: 2,
    platform: 'CodeChef',
    name: 'GFGSC College Challenge',
    date: '2024-02-15',
    time: '20:00 IST',
    difficulty: 'Hard',
    registeredParticipants: 42,
    icon: <platformIcons.codechef className="text-orange-600" />
  },
  {
    id: 3,
    platform: 'Codeforces',
    name: 'Div 2 Round',
    date: '2024-02-18',
    time: '21:00 IST',
    difficulty: 'Advanced',
    registeredParticipants: 36,
    icon: <platformIcons.codeforces className="text-blue-600" />
  }
];

const Profile = () => {
  return (
    <div className="container px-16 pt-16 min-h-screen bg-gradient-to-br from-gfgsc-green-200/20 to-white">
      <ProfileHero userProfile={userProfile} />
      <OverviewSection platformData={platformData} />
      <UpcomingEvents contestData={contestData} />
    </div>
  );
};

export default Profile;