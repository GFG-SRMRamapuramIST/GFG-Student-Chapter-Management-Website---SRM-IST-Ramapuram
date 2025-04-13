const chalk = require("chalk");

const { sendEmail } = require("../../Utilities");

const { Users, DailyContests, Notice } = require("../../Models");

// Function to reset user data
async function resetData() {
  console.log(chalk.blue("Running reset data function..."));

  try {
    // Fetch all users
    const users = await Users.find();

    // Update each user
    for (const user of users) {
      user.prevMonthData = {
        totalQuestionsSolved: user.totalQuestionSolved,
        prevRank: user.currentRank,
      };
      user.currentRank = null;
      user.totalQuestionSolved = 0;

      user.subscribed = true;
      user.protected = false;

      user.avgPerDay = 0;
      user.maxStreak = 0;
      user.dailyActivity = [];

      await user.save();
    }

    console.log(chalk.green("User data has been reset successfully."));

    await DailyContests.deleteMany();
    await Notice.deleteMany();
    console.log(
      chalk.green(
        "All then entries for DailyContests and Notice have been deleted."
      )
    );
  } catch (error) {
    console.error(
      chalk.red("Error during reset data function:"),
      error.message
    );
    await sendEmail(
      "geeksforgeeks.srmistrmp@gmail.com",
      "Monthly Reset Data Function Error",
      `The monthly reset data function failed with the following error: ${error.message}`
    );
  }
}

module.exports = resetData;
