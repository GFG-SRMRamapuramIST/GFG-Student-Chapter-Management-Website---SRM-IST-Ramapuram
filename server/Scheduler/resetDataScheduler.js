const cron = require("node-cron");
const chalk = require("chalk");

const { Users, Team } = require("../Models"); // Importing Users and Teams schemas

// Scheduler to reset data every second last date of the month at 00:00
const task = cron.schedule(`43 13 21 * *`, async () => {
  console.log(chalk.blue("Running reset data scheduler..."));

  try {
    // Step 1: Reset Users' data
    await Users.updateMany(
      {}, // Match all users
      {
        $set: {
          teamId: null,
          solvedQuestionsCount: 0,
          totalContestsParticipated: 0,
        },
      }
    );
    console.log(chalk.green("Users' data reset successfully."));

    // Step 2: Delete all Teams data
    const deletedTeams = await Team.deleteMany({});
    console.log(
      chalk.green(
        `Deleted all team records. Count: ${deletedTeams.deletedCount}`
      )
    );

    console.log(chalk.green("Reset data scheduler completed successfully."));
  } catch (error) {
    console.error(
      chalk.red("Error during reset data scheduler:"),
      error.message
    );
  }
});

module.exports = task;
