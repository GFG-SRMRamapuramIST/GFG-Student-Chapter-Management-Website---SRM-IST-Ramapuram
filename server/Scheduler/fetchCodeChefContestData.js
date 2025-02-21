const cron = require("node-cron");
const chalk = require("chalk");
const axios = require("axios");

const { Users } = require("../Models");

let codeChefScheduler = null;
let scheduledContestName = null; // Store contest name

// Function to fetch CodeChef contest data for all users
const fetchCodeChefContestData = async () => {
  console.log(chalk.bgBlue.bold("Fetching CodeChef Contest Data..."));

  try {
    const users = await Users.find(
      { codechefUsername: { $ne: null } }, // Fetch users with a CodeChef username
      { codechefUsername: 1, email: 1 } // Fetch relevant fields
    );
    for (const user of users) {
      const { codechefUsername } = user;
      const url = `https://codechef-api-9jml.onrender.com/api/contest-data/${codechefUsername}`;

      try {
        const response = await axios.get(url);
        const contestData = response.data;
        if (contestData && contestData.contests) {
          const lastContestName = Object.keys(contestData.contests).pop(); // Get the last contest name
          console.log(lastContestName);

          if (lastContestName === scheduledContestName) {
            console.log(
              chalk.green.bold(
                `User: ${codechefUsername}, Last Contest: ${lastContestName}`
              )
            );
            console.log(
              chalk.yellow(
                `Solved Questions: ${contestData.contests[lastContestName].join(
                  ", "
                )}`
              )
            );
          } else {
            console.log(
              chalk.yellow.bold(
                `User with username ${codechefUsername} not participated in the contest ${lastContestName}`
              )
            );
          }
        }
      } catch (error) {
        console.error(
          chalk.bgRed.bold(`Error fetching data for user: ${codechefUsername}`),
          error.message
        );
      }
    }
  } catch (error) {
    console.error(
      chalk.bgRed.bold("Error fetching users from database:"),
      error.message
    );
  }
};

// Function to update the scheduler dynamically
const updateCodeChefScheduler = (endTime, contestName) => {
  if (codeChefScheduler) {
    codeChefScheduler.stop(); // Stop previous scheduled job if it exists
  }

  scheduledContestName = contestName; // Store contest name

  // Convert endTime to IST by adding 5 hours 30 minutes
  const contestEndDate = new Date(endTime);
  contestEndDate.setHours(contestEndDate.getHours() + 5);
  contestEndDate.setMinutes(contestEndDate.getMinutes() + 30);

  const cronExpression = `${contestEndDate.getUTCMinutes()} ${contestEndDate.getUTCHours()} ${contestEndDate.getUTCDate()} ${
    contestEndDate.getUTCMonth() + 1
  } *`;

  console.log(
    chalk.green.bold(
      `Updated CodeChef Scheduler for contest: ${contestName} to run at: ${contestEndDate.toUTCString()} (IST) with cron expression: ${cronExpression}`
    )
  );

  codeChefScheduler = cron.schedule(cronExpression, async () => {
    await fetchCodeChefContestData();
  });
};

module.exports = {
  fetchCodeChefContestDataScheduler: fetchCodeChefContestData,
  updateCodeChefScheduler,
};
