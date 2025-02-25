const chalk = require("chalk");

const { sendEmail } = require("../../Utilities");

const { Users } = require("../../Models");

const awardTopPerformers = async () => {
  console.log(
    chalk.bgBlue.bold("Running Monthly Top Performers Award Function.")
  );

  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-based
    const currentYear = currentDate.getFullYear();

    // Fetch top 3 users based on the best currentRank (lower rank is better)
    const topPerformers = await Users.find({ currentRank: { $ne: null } })
      .sort({ currentRank: 1 }) // Ascending order (lower rank is better)
      .limit(3);

    if (topPerformers.length === 0) {
      console.log(
        chalk.bgYellow.bold("No top performers found for this month.")
      );
      return;
    }

    // Assign medals
    const medalTypes = ["gold", "silver", "bronze"];
    for (let i = 0; i < topPerformers.length; i++) {
      topPerformers[i].achievement[medalTypes[i]].push({
        month: currentMonth,
        year: currentYear,
      });
      await topPerformers[i].save();
    }

    console.log(
      chalk.bgGreen.bold("Top performers have been updated successfully!")
    );
  } catch (error) {
    console.error(
      chalk.bgRed.bold("Error updating top performers:"),
      error.message
    );
    await sendEmail(
      "geeksforgeeks.srmistrmp@gmail.com",
      "Monthly Award Function Error",
      `The monthly top performers award function failed with the following error: ${error.message}`
    );
  }
};

module.exports = awardTopPerformers;
