const PlatformLinkPlaceholder = ({ platform, username }) => {
  const platformUrls = {
    leetcode: {
      base: "https://leetcode.com/u/",
      display: "leetcode.com/u/",
    },
    codechef: {
      base: "https://codechef.com/users/",
      display: "codechef.com/users/",
    },
    codeforces: {
      base: "https://codeforces.com/profile/",
      display: "codeforces.com/profile/",
    },
    linkedin: {
      base: "https://linkedin.com/in/",
      display: "linkedin.com/in/",
    },
    codolio: {
      base: "https://codolio.com/profile/",
      display: "codolio.com/profile/",
    },
  };

  if (!username) return null;

  const { base, display } = platformUrls[platform];

  return (
    <a
      href={`${base}${username}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-xs text-gray-500 hover:text-gfgsc-green hover:underline"
    >
      {display}
      {username}
    </a>
  );
};

export default PlatformLinkPlaceholder;
