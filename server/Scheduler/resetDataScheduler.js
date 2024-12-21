const cron = require("node-cron");
const chalk = require("chalk");

const { Users, Team, ConstantValue } = require("../Models"); // Importing Users and Teams schemas

// Scheduler to reset data every second last date of the month at 00:00
const task = cron.schedule(`30 3 22 * *`, async () => {
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

    // Step 3: Reset totalContests in ConstantValue schema
    await ConstantValue.findOneAndUpdate(
      {}, // Match the first document
      { $set: { totalContests: 0 } } // Set totalContests to 0
    );
    console.log(
      chalk.green("Total contests in ConstantValue schema reset successfully.")
    );

    // Step 4: Create new empty teams
    const constantValue = await ConstantValue.findOne();
    const teamSize = constantValue?.teamSize || 5; // Default to 5 if not set

    const users = await Users.find({}, "_id"); // Fetch all user IDs
    const totalUsers = users.length;

    // Calculate the number of teams to create
    const totalTeams = Math.ceil(totalUsers / teamSize);
    console.log(chalk.green(`Creating ${totalTeams} empty teams...`));

    // Create empty teams
    for (let i = 1; i <= totalTeams; i++) {
      await Team.create({
        teamName: `Team ${i}`,
      });
    }
    console.log(chalk.green(`${totalTeams} empty teams created successfully.`));

    console.log(chalk.green("Reset data scheduler completed successfully."));
  } catch (error) {
    console.error(
      chalk.red("Error during reset data scheduler:"),
      error.message
    );
  }
});

module.exports = task;
