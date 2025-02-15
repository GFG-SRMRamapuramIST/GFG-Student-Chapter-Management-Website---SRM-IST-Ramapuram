import { AakashPfp } from "../../Assets";
import { PlatformPOTDs, ProfileHero, ProfileSecondary } from "../../Components";

const userProfile = {
  name: "Aakash Kumar",
  email: "aakashkumar@gfg.com",
  role: "President",
  academic_year: "3rd Year",
  profilePic: AakashPfp,
  bio: "Full-stack developer passionate about algorithms and competitive programming. Core team member @TechCommunity.",
  
  // Social media links
  social: [
    {
      platform: "codolio",
      url: "https://codolio.com/profile/sarahchen"
    },
    {
      platform: "linkedin",
      url: "https://linkedin.com/in/sarahchen"
    }
  ],

  // Quick stats for the Overview tab
  stats: {
    questions: 847,
    individualRank: 34,
    previousRank: 142
  },

  // Coding platform profiles
  profiles: {
    leetcode: {
      handle: "aakashyadav",
      rating: 2134,
      rank: 1542,
      lastActive: "2024-02-01",
      contests: 24,
      questions: 214
    },
    codechef: {
      handle: "aakashkumar",
      rating: 1876,
      rank: 2341,
      lastActive: "2024-01-28",
      contests: 12,
      questions: 156
    },
    codeforces: {
      handle: "aakashkyadav",
      rating: 1654,
      rank: 3421,
      lastActive: "2024-01-30",
      contests: 18,
      questions: 312
    }
  },

  badges: [
    {
      id: 1,
      name: "Gold Medal",
      type: "gold",
      date: "2023-12-01",
      description: "Awarded for outstanding performance in coding contests."
    },
    {
      id: 2,
      name: "Silver Medal",
      type: "silver",
      date: "2023-11-15",
      description: "Awarded for excellent performance in coding contests."
    },
    {
      id: 3,
      name: "Bronze Medal",
      type: "bronze",
      date: "2023-10-20",
      description: "Awarded for good performance in coding contests."
    },
    {
      id: 4,
      name: "Top Coder",
      type: "gold",
      date: "2023-09-10",
      description: "Recognized as a top coder in the community."
    }
  ]
};

const updatesAndAnnouncements = {
  updates: [
    {
      id: 1,
      message: "Participated in LeetCode Weekly Contest 342.",
      date: "2024-02-10"
    },
    {
      id: 2,
      message: "Solved 50 problems on Codeforces.",
      date: "2024-01-30"
    },
    {
      id: 3,
      message: "Achieved a new rating on CodeChef.",
      date: "2024-01-28"
    }
  ],

  // Announcements
  announcements: [
    {
      id: 1,
      title: "Upcoming Coding Contest",
      date: "2024-02-15"
    },
    {
      id: 2,
      title: "New Features Released",
      date: "2024-01-25"
    }
  ]
}

// Example usage:
const platformPOTDs = [
  {
    platform: 'LeetCode',
    title: 'Maximum Subarray Sum',
    description: 'Find the contiguous subarray within an array that has the largest sum.',
    difficulty: 'Medium',
    timeLimit: '1 sec',
    timeLeft: '16h 30m',
    tags: ['Array', 'Dynamic Programming', 'Divide and Conquer'],
    date: 'Feb 2, 2025',
    solved: true,
    url: '#'
  },
  {
    platform: 'CodeChef',
    title: 'Chef and Strings',
    description: 'Chef has a string S consisting of lowercase English characters. Help Chef calculate the value of his string.',
    difficulty: 'Easy',
    timeLimit: '2 sec',
    timeLeft: '20h 45m',
    tags: ['Strings', 'Implementation'],
    date: 'Feb 2, 2025',
    solved: false,
    url: '#'
  },
  {
    platform: 'GeeksForGeeks',
    title: 'Binary Tree Level Order Traversal',
    description: 'Given a binary tree, return the level order traversal of its nodes values.',
    difficulty: 'Hard',
    timeLimit: '1.5 sec',
    timeLeft: '12h 15m',
    tags: ['Tree', 'BFS', 'Queue'],
    date: 'Feb 2, 2025',
    solved: false,
    url: '#'
  }
];


const Profile = () => {
  return (
    <div className="min-h-screen ">
      <ProfileHero userProfile={userProfile} />
      <ProfileSecondary userProfile={userProfile} updatesAndAnnouncements={updatesAndAnnouncements} />
      <PlatformPOTDs problems={platformPOTDs} />
    </div>
  );
};

export default Profile;