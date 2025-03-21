const cron = require("node-cron");
const chalk = require("chalk");
const moment = require("moment");
const { Users } = require("../../Models");

// Initialize dailyActivity for the current month
const initializeDailyActivity = async (user) => {
  const startDate = moment().startOf("month"); // 1st of the current month
  const today = moment().startOf("day"); // Today at midnight
  const dailyActivity = [];

  for (
    let date = startDate;
    date.isSameOrBefore(today, "day");
    date.add(1, "day")
  ) {
    dailyActivity.push({ date: date.toDate(), count: 0 });
  }

  user.dailyActivity = dailyActivity;
  await user.save();
};
// Update dailyActivity every midnight
const updateDailyActivity = async () => {
  try {
    console.log(chalk.blue("Starting HeatMap Scheduler..."));
    const users = await Users.find({});

    for (const user of users) {
      user.dailyActivity = []; // Reset dailyActivity
      await user.save();

      const today = moment().startOf("day").toDate();

      if (!user.dailyActivity || user.dailyActivity.length === 0) {
        await initializeDailyActivity(user);
      } else {
        const firstEntryMonth = moment(user.dailyActivity[0]?.date).month();
        const currentMonth = moment().month();

        if (firstEntryMonth !== currentMonth) {
          await initializeDailyActivity(user);
        }

        if (
          !user.dailyActivity.some((entry) =>
            moment(entry.date).isSame(today, "day")
          )
        ) {
          user.dailyActivity.push({ date: today, count: 0 });
          await user.save();
        }
      }
    }

    console.log(chalk.green("HeatMap Scheduler completed."));
  } catch (error) {
    console.error(chalk.red("Error in HeatMap Scheduler:"), error.message);
  }
};

// Schedule the job to run every day at midnight
cron.schedule("0 0 * * *", updateDailyActivity);
console.log(chalk.bgMagenta.bold("HeatMap Scheduler Initialized."));

module.exports = { updateDailyActivity };
