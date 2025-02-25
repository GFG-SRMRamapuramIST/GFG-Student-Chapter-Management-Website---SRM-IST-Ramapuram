const chalk = require("chalk");

const { sendEmail } = require("../../Utilities");

const { Users } = require("../../Models");

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
      await user.save();
    }

    console.log(chalk.green("User data has been reset successfully."));
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
