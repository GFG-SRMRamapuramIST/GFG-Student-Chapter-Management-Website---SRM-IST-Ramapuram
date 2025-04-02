import { CgCodeSlash } from "react-icons/cg";
import {
  SiCodechef,
  SiCodeforces,
  SiGoogle,
  SiLeetcode,
  SiGeeksforgeeks,
} from "react-icons/si";

export const platformIcons = {
  LeetCode: SiLeetcode,
  CodeChef: SiCodechef,
  Codeforces: SiCodeforces,
  GeeksforGeeks: SiGeeksforgeeks,
  leetcode: SiLeetcode,
  codechef: SiCodechef,
  codeforces: SiCodeforces,
  geeksforgeeks: SiGeeksforgeeks,
  gmeet: SiGoogle,
  others: CgCodeSlash,
};

export const platformColors = {
  leetcode: "#FFA116",
  hackerrank: "#00EA64",
  codechef: "#5B4638",
  codeforces: "#1F8ACB",
  geeksforgeeks: "#308d46",
};

export const getPlatformUrl = (platform) => {
  switch (platform) {
    case "leetcode":
      return "leetcode.com";
    case "codechef":
      return "codechef.com/users";
    case "codeforces":
      return "codeforces.com/profile";
    case "geeksforgeeks":
      return "geeksforgeeks.org/user";
    default:
      return "";
  }
};
