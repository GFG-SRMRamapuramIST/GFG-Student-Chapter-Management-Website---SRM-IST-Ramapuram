const cron = require("node-cron");
const chalk = require("chalk");

const {
  fetchLeetcodeDetails,
} = require("./LeetCode/LeetCodeProfileDataFunction");

const { updateLeaderboardRankings } = require("./LeaderBoardSorting");

const { Users } = require("../../Models");

// Function to calculate the increment based on the difference
const calculateIncrement = (diff) => {
  if (diff >= 1 && diff <= 3) return 1;
  if (diff >= 4 && diff <= 6) return 2;
  if (diff >= 7 && diff <= 9) return 3;
  return 3; // If more than 9, just add 3 and leave it
};

// Function to update practice question counts
const updatePracticeQuestionsCount = async () => {
  try {
    console.log(chalk.blue("Starting Practice Questions Count Scheduler..."));

    const users = await Users.find({ leetcodeUsername: { $ne: null } });
    for (const user of users) {
      const { leetcodeUsername } = user;
      const leetcodeData = await fetchLeetcodeDetails(
        leetcodeUsername,
        user.email
      );

      if (!leetcodeData) continue; // Skip if no valid data

      const { badgesCount, ranking, totalProblemSolved } = leetcodeData;
      const diff =
        totalProblemSolved - (user.platforms.leetcode.totalProblemSolved || 0);
      const increment = calculateIncrement(diff);

      user.totalQuestionSolved += increment;
      user.platforms.leetcode = { badgesCount, ranking, totalProblemSolved };
      await user.save();

      console.log(
        chalk.green(
          `Updated ${user.email} - LeetCode Solved: ${totalProblemSolved}, Increment: ${increment}`
        )
      );
    }

    console.log(chalk.blue("Updating leaderboard rankings..."));
    await updateLeaderboardRankings();
    console.log(chalk.green("Practice Questions Count Scheduler completed."));
  } catch (error) {
    console.error(
      chalk.red("Error in Practice Questions Count Scheduler:"),
      error.message
    );
  }
};

// Schedule the job to run at midnight
cron.schedule("0 0 * * *", updatePracticeQuestionsCount);

console.log(
  chalk.bgMagenta.bold("Practice Questions Count Scheduler Initialized.")
);

module.exports = { updatePracticeQuestionsCount };
