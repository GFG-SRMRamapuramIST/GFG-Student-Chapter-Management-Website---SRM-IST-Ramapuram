const cron = require("node-cron");
const chalk = require("chalk");

const {
  fetchLeetcodeDetails,
} = require("./LeetCode/LeetCodeProfileDataFunction");
const {
  fetchGeeksForGeeksDetails,
} = require("./GeeksForGeeks/GeeksForGeeksProfileDataFunction");

const { updateLeaderboardRankings } = require("./LeaderBoardSorting");

const { Users } = require("../../Models");

// Function to calculate increment based on the difference
const calculateIncrement = (diff) => {
  if (diff >= 1 && diff <= 3) return 1;
  if (diff >= 4 && diff <= 6) return 2;
  if (diff >= 7 && diff <= 9) return 3;
  if (diff > 9) return 3;
  return 0;
};

// Function to update practice question counts
const updatePracticeQuestionsCount = async () => {
  try {
    console.log(chalk.blue("Starting Practice Questions Count Scheduler..."));

    const users = await Users.find({
      $or: [
        { leetcodeUsername: { $ne: null } },
        { geeksforgeeksUsername: { $ne: null } },
      ],
    });

    for (const user of users) {
      let increment = 0;

      // Fetch LeetCode Data
      if (user.leetcodeUsername) {
        const leetcodeData = await fetchLeetcodeDetails(
          user.leetcodeUsername,
          user.email
        );
        if (leetcodeData) {
          const { badgesCount, ranking, totalProblemSolved } = leetcodeData;
          const leetcodeDiff =
            totalProblemSolved -
            (user.platforms.leetcode.totalProblemSolved || 0);

          if (user.platforms.leetcode.verified === true) {
            increment += calculateIncrement(leetcodeDiff);
            console.log(
              `Today the user has solved ${leetcodeDiff} questions on leetcode, so he get ${calculateIncrement(
                leetcodeDiff
              )} points`
            );
          } else {
            console.log(`${user.name} has not verified his leetcode account`);
          }

          user.platforms.leetcode = {
            badgesCount,
            ranking,
            totalProblemSolved,
            verified: user.platforms.leetcode.verified,
          };

          // Update today's activity
          if (user.dailyActivity.length > 0) {
            user.dailyActivity[user.dailyActivity.length - 1].count +=
              leetcodeDiff;
          }
        }
      }

      // Fetch GeeksForGeeks Data
      if (user.geeksforgeeksUsername) {
        const geeksforgeeksData = await fetchGeeksForGeeksDetails(
          user.geeksforgeeksUsername,
          user.email
        );
        if (geeksforgeeksData) {
          const { universityRank, codingScore, problemSolved } =
            geeksforgeeksData;
          const gfgDiff =
            problemSolved - (user.platforms.geeksforgeeks.problemSolved || 0);

          if (user.platforms.geeksforgeeks.verified === true) {
            increment += calculateIncrement(gfgDiff);
            console.log(
              `Today the user has solved ${gfgDiff} questions on gfg, so he get ${calculateIncrement(
                gfgDiff
              )} points`
            );
          } else {
            console.log(
              `${user.name} has not verified his GeeksForGeeks account`
            );
          }

          user.platforms.geeksforgeeks = {
            universityRank,
            codingScore,
            problemSolved,
            verified: user.platforms.geeksforgeeks.verified,
          };

          // Update today's activity
          if (user.dailyActivity.length > 0) {
            user.dailyActivity[user.dailyActivity.length - 1].count += gfgDiff;
          }
        }
      }

      user.totalQuestionSolved += increment;

      await user.save();

      console.log(
        chalk.green(`Updated ${user.email} - Increment: ${increment}`)
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

// Schedule the job to run at 11:50 pm every day
cron.schedule("50 23 * * *", updatePracticeQuestionsCount);

console.log(
  chalk.bgMagenta.bold("Practice Questions Count Scheduler Initialized.")
);

module.exports = { updatePracticeQuestionsCount };
