const cron = require("node-cron");
const chalk = require("chalk");
const moment = require("moment");
const { Users } = require("../../Models");

// Initialize dailyActivity for the current month
const initializeDailyActivity = async (user) => {
  const startDate = moment().startOf("month");
  const today = moment().startOf("day");
  const dailyActivity = [];

  for (
    let date = startDate;
    date.isSameOrBefore(today, "day");
    date.add(1, "day")
  ) {
    dailyActivity.push({ date: date.toDate(), count: 0 });
  }

  user.dailyActivity = dailyActivity;
  user.maxStreak = 0;
  user.avgPerDay = 0;
  await user.save();
};

// Function to calculate max streak
const calculateMaxStreak = (dailyActivity) => {
  let maxStreak = 0;
  let currentStreak = 0;

  for (const entry of dailyActivity) {
    if (entry.count > 0) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }
  return maxStreak;
};

// Function to calculate avg per day
const calculateAvgPerDay = (dailyActivity) => {
  const now = new Date();
  const totalDays = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0
  ).getDate(); // Get total days in the current month

  if (totalDays === 0) return 0;

  const totalCount = dailyActivity.reduce((sum, entry) => sum + entry.count, 0);
  return (totalCount / totalDays).toFixed(2);
};


// Update dailyActivity every night at 12:30 AM
const updateDailyActivity = async () => {
  try {
    console.log(chalk.blue("Starting HeatMap Scheduler..."));
    const users = await Users.find({});

    for (const user of users) {
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
        }

        // Calculate and update max streak
        user.maxStreak = calculateMaxStreak(user.dailyActivity);

        // Calculate and update avg per day
        user.avgPerDay = calculateAvgPerDay(user.dailyActivity);

        console.log(
          `Updated daily activity for ${user.email} for the day ${today}, max streak: ${user.maxStreak}, avg per day: ${user.avgPerDay}`
        );

        await user.save();
      }
    }

    console.log(chalk.green("HeatMap Scheduler completed."));
  } catch (error) {
    console.error(chalk.red("Error in HeatMap Scheduler:"), error.message);
  }
};

// Schedule the job to run every day at 12:30 AM
cron.schedule("30 0 * * *", updateDailyActivity);
console.log(chalk.bgMagenta.bold("HeatMap Scheduler Initialized."));

module.exports = { updateDailyActivity };
