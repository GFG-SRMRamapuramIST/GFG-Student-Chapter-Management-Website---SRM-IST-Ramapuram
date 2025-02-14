import { SiCodechef, SiCodeforces, SiGoogle, SiLeetcode } from "react-icons/si";

export const platformIcons = {
  leetcode: SiLeetcode,
  codechef: SiCodechef,
  codeforces: SiCodeforces,
  gmeet: SiGoogle,
};

// Sample resources data
export const resources = [
  {
    id: "75-leetcode", // String/Number - unique ID - used in routes
    title: "75 LeetCode Questions to Ace Your Interview",
    platform: "leetcode",
    category: "pro",
    count: 75,
    lastUpdated: "2025-02-10",
    description: "Curated list of interview-focused problems",
  },
  {
    id: 2,
    title: "CodeChef Beginner's Essential Problems",
    platform: "codechef",
    category: "noob",
    count: 50,
    lastUpdated: "2025-02-08",
    description: "Perfect starting point for competitive programming",
  },
];
