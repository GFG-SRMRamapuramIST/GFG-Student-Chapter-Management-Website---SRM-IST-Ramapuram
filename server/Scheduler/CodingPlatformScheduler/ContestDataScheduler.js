const cron = require("node-cron");
const chalk = require("chalk");

const { updateLeaderboardRankings } = require("./LeaderBoardSorting");
const {
  peekTopContest,
  removeTopContest,
  addContest,
} = require("./contestMinHeap");
const {
  fetchCodeChefContestData,
} = require("./CodeChef/CodeChefContestDataFunction");
const {
  fetchLeetCodeContestData,
} = require("./LeetCode/LeetCodeContestDataFunction");
const {
  fetchCodeforcesContestData,
} = require("./CodeForces/CodeForcesContestDataFunction");

const { Users, DailyContests } = require("../../Models");

let currentTask = null;

/**
 * Generates a cron expression for the contest start time.
 * @param {string} date - Contest date in YYYY-MM-DD format.
 * @param {string} endTime - Contest end time in ISO format.
 * @returns {string} Cron expression.
 */
function getCronExpression(date, endTime) {
  if (!date || !endTime) {
    return "0 * * * *"; // Default to run every hour if invalid input
  }

  const contestTime = new Date(endTime);
  contestTime.setMinutes(contestTime.getMinutes() + 2); // Add 2 minutes

  const localMinute = contestTime.getMinutes();
  const localHour = contestTime.getHours();
  const localDay = contestTime.getDate();
  const localMonth = contestTime.getMonth() + 1; // Months are 0-based

  return `${localMinute} ${localHour} ${localDay} ${localMonth} *`;
}

/**
 * Loads contests from the database into the contest min heap on server start.
 */
async function loadContestsIntoHeap() {
  try {
    //console.log(chalk.blue("Fetching upcoming contests from the database..."));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const contests = await DailyContests.find({ date: { $gte: today } });

    if (!contests.length) {
      console.log(chalk.yellow("No upcoming contests found in the database."));
      return;
    }

    contests.forEach(({ date, contests }) => {
      contests.forEach(({ contestName, endTime, platform }) => {
        addContest(contestName, date, endTime, platform.toLowerCase());
        console.log(
          chalk.green(
            `Added contest '${contestName}' (${platform}) to the contest min heap, scheduled at ${endTime}`
          )
        );
      });
    });
  } catch (error) {
    console.error(
      chalk.red("Error loading contests into heap:"),
      error.message
    );
  }
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
    console.log(chalk.yellow("No upcoming contests to schedule."));
    return;
  }

  const { contestName, date, endTime, type } = nextContest;
  const cronExpression = getCronExpression(date, endTime);

  console.log(
    chalk.cyan(
      `Scheduling contest data update for '${contestName}' (${type}) at cron: ${cronExpression}`
    )
  );

  currentTask = cron.schedule(cronExpression, async () => {
    try {
      console.log(
        chalk.magenta(`Fetching contest data for '${contestName}' (${type})...`)
      );

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
          console.log(
            chalk.green(`Updated contest data for ${user.email} (${type})`)
          );
        }
      }

      console.log(chalk.blue("Updating leaderboard rankings..."));
      await updateLeaderboardRankings();
    } catch (error) {
      console.error(
        chalk.red("Error executing contest data update:"),
        error.message
      );
    }

    removeTopContest(); // Remove the executed contest from the heap
    updateContestDataScheduler(); // Schedule the next contest
  });
}

(async () => {
  await loadContestsIntoHeap(); // Load contests from DB on startup
  updateContestDataScheduler(); // Start the scheduler
})();

console.log(chalk.bgMagenta.bold("Contest Data Scheduler Initialized."));

module.exports = {
  updateContestDataScheduler,
};
