const cron = require("node-cron");
const chalk = require("chalk");

const { sendEmail } = require("../../Utilities");
const { ConstantValue } = require("../../Models");

const awardTopPerformers = require("./awardTopPerformersFunction");
const backUpDataFunction = require("./backUpDataFunction");
const resetDataFunction = require("./resetDataFunction");
const autoKickFunction = require("./autoKickFunction");

let monthEndScheduler; // Store reference to the scheduler

// Function to get cron expression for the last day of the month
function getLastDayCronExpression() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const lastDay = new Date(year, month + 1, 0).getDate();
  return `55 23 ${lastDay} * *`; // Runs at 23:55 on the last day of the month
}

// Function to run the month-end tasks
async function runMonthEndTasks() {
  console.log(chalk.blue("Running Month-End Scheduler..."));

  try {
    const config = await ConstantValue.findOne();
    if (!config) {
      throw new Error("No configuration found in ConstantValue schema.");
    }

    const {
      achievementScheduler,
      backupDataScheduler,
      resetDataScheduler,
      autoKickScheduler,
      passingMarks,
    } = config;

    if (achievementScheduler) {
      try {
        await awardTopPerformers();
      } catch (error) {
        console.error(
          chalk.red("Error in Award Top Performers:"),
          error.message
        );
        await sendEmail(
          "geeksforgeeks.srmistrmp@gmail.com",
          "Error in Award Top Performers",
          error.message
        );
      }
    }

    if (backupDataScheduler) {
      try {
        await backUpDataFunction();
      } catch (error) {
        console.error(
          chalk.red("Error in Backup Data Function:"),
          error.message
        );
        await sendEmail(
          "geeksforgeeks.srmistrmp@gmail.com",
          "Error in Backup Data Function",
          error.message
        );
      }
    }

    if (autoKickScheduler) {
      try {
        await autoKickFunction(passingMarks);
      } catch (error) {
        console.error(chalk.red("Error in Auto Kick Function:"), error.message);
        await sendEmail(
          "geeksforgeeks.srmistrmp@gmail.com",
          "Error in Auto Kick Function",
          error.message
        );
      }
    }

    if (resetDataScheduler) {
      try {
        await resetDataFunction();
      } catch (error) {
        console.error(
          chalk.red("Error in Reset Data Function:"),
          error.message
        );
        await sendEmail(
          "geeksforgeeks.srmistrmp@gmail.com",
          "Error in Reset Data Function",
          error.message
        );
      }
    }

    console.log(chalk.blue("Month-End Scheduler completed."));
  } catch (error) {
    console.error(chalk.red("Error in Month-End Scheduler:"), error.message);
    await sendEmail(
      "geeksforgeeks.srmistrmp@gmail.com",
      "Month-End Scheduler Error",
      error.message
    );
  }
}

// Function to schedule the month-end task dynamically
function scheduleMonthEndTask() {
  if (monthEndScheduler) {
    monthEndScheduler.stop(); // Stop the previous scheduler
  }

  const cronExpression = getLastDayCronExpression();
  console.log(chalk.blue(`Scheduling Month-End Task for: ${cronExpression}`));

  monthEndScheduler = cron.schedule(cronExpression, runMonthEndTasks);
}

// Initial scheduling on server start
scheduleMonthEndTask();

console.log(chalk.bgMagenta.bold("Month-End Scheduler Initialized."));

// Update the scheduler on the 1st of every month at 00:01
cron.schedule("1 0 1 * *", () => {
  console.log(chalk.green("Updating Month-End Scheduler for new month..."));
  scheduleMonthEndTask();
});

module.exports = monthEndScheduler;
