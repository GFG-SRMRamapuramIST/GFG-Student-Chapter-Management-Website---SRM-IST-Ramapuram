const cron = require("node-cron");
const chalk = require("chalk");

const { DailyContests } = require("../Models");
const { getSubscribedUsers } = require("../Utilities");
const { sendEmail } = require("../Utilities");

// Scheduler that runs every hour
const task = cron.schedule("0 * * * *", async () => {
  console.log(chalk.bgGreen.bold("Scheduler running every hour."));
  try {
    const currentTime = new Date();
    const oneHourLater = new Date(currentTime.getTime() + 60 * 60 * 1000);

    const contests = await DailyContests.aggregate([
      {
        $unwind: "$contests",
      },
      {
        $match: {
          date: { $eq: new Date(currentTime.toISOString().split("T")[0]) },
          "contests.startTime": { $gt: currentTime, $lt: oneHourLater },
        },
      },
      {
        $project: {
          contestName: "$contests.contestName",
          platform: "$contests.platform",
          startTime: "$contests.startTime",
          endTime: "$contests.endTime",
        },
      },
    ]);

    if (contests.length > 0) {
      const subscribedUsersEmails = await getSubscribedUsers();

      if (subscribedUsersEmails.length > 0) {
        contests.forEach((contest) => {
          const message = `
              Contest Alert!
              Contest Name: ${contest.contestName}
              Platform: ${contest.platform}
              Start Time: ${new Date(contest.startTime).toLocaleString()}
              End Time: ${new Date(contest.endTime).toLocaleString()}
            `;

          sendEmail(subscribedUsersEmails, "Upcoming Contest Alert", message);
        });
      }
    } else {
      console.log(
        chalk.bgYellow.bold(
          "No contests starting within the next hour for today."
        )
      );
    }
  } catch (error) {
    console.error(chalk.bgRed.bold("Error in scheduler:"), error.message);
  }
});

exports.task = task;
