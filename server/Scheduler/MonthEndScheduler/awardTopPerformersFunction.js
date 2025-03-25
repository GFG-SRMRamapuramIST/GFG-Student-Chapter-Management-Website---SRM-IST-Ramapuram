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
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

    // Fetch top 3 users based on the best currentRank (lower rank is better)
    const topPerformers = await Users.find({ currentRank: { $ne: null } })
      .sort({ currentRank: 1 })
      .limit(3);

    // Award top 3 performers
    const medalTypes = ["gold", "silver", "bronze"];
    for (let i = 0; i < topPerformers.length; i++) {
      const user = topPerformers[i];
      user.achievement[medalTypes[i]].push({
        month: currentMonth,
        year: currentYear,
      });
      await user.save();
    }

    console.log(
      chalk.bgGreen.bold("Top performers have been updated successfully!")
    );

    // Award user with the highest avgPerDay
    const maxAvgUser = await Users.findOne().sort({ avgPerDay: -1 });
    if (maxAvgUser) {
      maxAvgUser.achievement.maxAvgPerDay.push({
        month: currentMonth,
        year: currentYear,
      });
      await maxAvgUser.save();
      console.log(chalk.bgCyan.bold("User with highest avgPerDay awarded!"));
    }

    // Award users who solved questions every day of the month (maxStreak = total days in month)
    const dailyActiveUsers = await Users.find({ maxStreak: daysInMonth });
    if (!dailyActiveUsers.length) {
      console.log(
        chalk.bgMagenta.bold("No user solved questions every day of the month.")
      );
    } else {
      for (const user of dailyActiveUsers) {
        user.achievement.dailyActiveStreak.push({
          month: currentMonth,
          year: currentYear,
        });
        await user.save();
      }
      console.log(
        chalk.bgMagenta.bold("Daily active users have been awarded!")
      );
    }

    console.log(
      chalk.bgBlue.bold(
        "Monthly Top Performers Award Function Successfully Over."
      )
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
