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
        const { codechefUsername, codeforcesUsername, email } = user;

        if (type === "codechef" && codechefUsername) {
          contestData = await fetchCodeChefContestData(
            codechefUsername,
            contestName
          );
        } else if (type === "codeforces" && codeforcesUsername) {
          contestData = await fetchCodeforcesContestData(
            codeforcesUsername,
            contestName,
            email
          );
        }

        if (contestData) {
          if (type === "codeforces") {
            if (user.platforms.codeforces.verified === true) {
              // 3 points for every question solved on codeforces contest
              user.totalQuestionSolved += contestData.totalQuestionsSolved * 3;
              console.log(
                `For the codeforces contest ${user.name} has solved ${
                  contestData.totalQuestionsSolved
                } questions, so user gets ${
                  contestData.totalQuestionsSolved * 3
                } points`
              );
            } else {
              console.log(
                `${user.name} has not verified his codeforces account, so no points will be added for contest.`
              );
            }
          } else if (type === "codechef") {
            if (user.platforms.codechef.verified === true) {
              const pointsPerStar = { 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7 };
              console.log(
                `${user.name} is a ${
                  user.platforms.codechef.rating
                } star coder on codechef, so per question user gets ${
                  pointsPerStar[user.platforms.codechef.rating]
                } points`
              );
              console.log(
                `For the codechef contest ${user.name} has solved ${
                  contestData.totalQuestionsSolved
                } questions, so user gets ${
                  contestData.totalQuestionsSolved *
                  pointsPerStar[user.platforms.codechef.rating]
                } points`
              );
              user.totalQuestionSolved +=
                contestData.totalQuestionsSolved *
                pointsPerStar[user.platforms.codechef.rating];
            } else {
              console.log(
                `${user.name} has not verified his codechef account, so no points will be added for contest.`
              );
            }
          }

          // Update today's activity
          if (user.dailyActivity.length > 0) {
            // if (type === "codeforces") {
            //   user.dailyActivity[user.dailyActivity.length - 2].count +=
            //     contestData.totalQuestionsSolved;
            // } else {
            //   user.dailyActivity[user.dailyActivity.length - 1].count +=
            //     contestData.totalQuestionsSolved;
            // }
            user.dailyActivity[user.dailyActivity.length - 1].count +=
              contestData.totalQuestionsSolved;
          }

          await user.save();
          console.log(
            chalk.green(`Updated contest data for ${user.email} (${type})`)
          );
        }

        // Delay for 5 seconds before fetching data for next user
        // This is to avoid hitting the API rate limit or getting our IP blocked
        await new Promise((resolve) => setTimeout(resolve, 5000));
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
