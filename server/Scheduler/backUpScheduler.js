const cron = require("node-cron");
const chalk = require("chalk");

const { Users, BackUp } = require("../Models");
const { resetDataScheduler } = require(".");

// Functions to get the second last date of the month
function getSecondLastDateOfMonth() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  // Get the last day of the current month
  const lastDay = new Date(year, month + 1, 0);

  // Subtract 1 day to get the second last date
  const secondLastDay = new Date(lastDay);
  secondLastDay.setDate(lastDay.getDate() - 1);

  console.log(secondLastDay);
  return secondLastDay;
}

// Schedule to run Data backing-up on the second last date of each month at 00:00
const task = cron.schedule(`41 13 21 * *`, async () => {
  console.log(chalk.blue("Running backup scheduler..."));

  try {
    // Delete all existing backup entries
    await BackUp.deleteMany({});
    console.log(chalk.green("Deleted all existing backup entries."));

    // Fetch all users from the Users schema
    const users = await Users.find();

    // Loop through each user and create a backup entry
    const backups = users.map((user) => ({
      name: user.name,
      email: user.email,
      codolioProfileLink: user.codolioProfileLink,
      solvedQuestionsCount: user.solvedQuestionsCount,
      teamId: user.teamId,
      totalContestsParticipated: user.totalContestsParticipated,
    }));

    // Insert all backups into the BackUp schema
    await BackUp.insertMany(backups);

    console.log(chalk.green("Backup scheduler completed successfully."));
  } catch (error) {
    console.error(chalk.red("Error during backup scheduler:"), error.message);
  }
});

exports.task = task;
