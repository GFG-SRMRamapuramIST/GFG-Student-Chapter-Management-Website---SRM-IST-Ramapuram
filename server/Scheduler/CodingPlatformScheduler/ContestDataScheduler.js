const cron = require("node-cron");
const chalk = require("chalk");

const { updateLeaderboardRankings } = require("./LeaderBoardSorting");

const { peekTopContest, removeTopContest } = require("./contestMinHeap");
const {
  fetchCodeChefContestData,
} = require("./CodeChef/CodeChefContestDataFunction");
const {
  fetchLeetCodeContestData,
} = require("./LeetCode/LeetCodeContestDataFunction");
const {
  fetchCodeforcesContestData,
} = require("./CodeForces/CodeForcesContestDataFunction");
const { Users } = require("../../Models");

let currentTask = null;

/**
 * Generates a cron expression for the contest start time.
 * @param {string} date - Contest date in YYYY-MM-DD format.
 * @param {string} endTime - Contest start time in HH:MM format.
 * @returns {string} Cron expression.
 */
function getCronExpression(date, endTime) {
  if (!date || !endTime) {
    return "0 * * * *"; // Default to run every hour if invalid input
  }

  const contestTime = new Date(endTime);

  // Convert UTC time to local system time
  const localMinute = contestTime.getMinutes();
  const localHour = contestTime.getHours();
  const localDay = contestTime.getDate();
  const localMonth = contestTime.getMonth() + 1; // Months are 0-based

  return `${localMinute} ${localHour} ${localDay} ${localMonth} *`;
}

/**
 * Schedules the next contest data update.
 */
function updateContestDataScheduler() {
  if (currentTask) {
    currentTask.stop(); // Stop any existing scheduled task
  }

  const nextContest = peekTopContest();
  if (!nextContest) {
    console.log("No upcoming contests to schedule.");
    return;
  }

  const { contestName, date, endTime, type } = nextContest;
  const cronExpression = getCronExpression(date, endTime);

  console.log(
    `Scheduling contest data update for ${contestName} (${type}) at cron: ${cronExpression}`
  );

  currentTask = cron.schedule(cronExpression, async () => {
    try {
      console.log(`Fetching contest data for ${contestName} (${type})`);

      //! have to filter our the ADMIN user from the list
      const users = await Users.find({});
      for (const user of users) {
        let contestData = null;
        const {
          leetcodeUsername,
          codechefUsername,
          codeforcesUsername,
          email,
        } = user;

        if (type === "codechef" && codechefUsername) {
          contestData = await fetchCodeChefContestData(
            codechefUsername,
            contestName
          );
        } else if (type === "leetcode" && leetcodeUsername) {
          contestData = await fetchLeetCodeContestData(
            leetcodeUsername,
            contestName,
            email
          );
        } else if (type === "codeforces" && codeforcesUsername) {
          contestData = await fetchCodeforcesContestData(
            codeforcesUsername,
            contestName,
            email
          );
        }

        if (contestData) {
          user.totalQuestionSolved += contestData.totalQuestionsSolved;
          await user.save();
          console.log(`Updated contest data for ${user.email} (${type})`);

          console.log("Updating leaderboard rankings...");
          await updateLeaderboardRankings();
        }
      }
    } catch (error) {
      console.error(
        chalk.bgRed.bold("Error executing contest data update:"),
        error.message
      );
    }

    removeTopContest(); // Remove the executed contest from the heap
    updateContestDataScheduler(); // Schedule the next contest
  });
}

console.log(chalk.bgMagenta.bold("Contest Data Scheduler Initialized."));

module.exports = {
  updateContestDataScheduler,
};
