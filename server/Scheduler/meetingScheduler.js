const cron = require("node-cron");
const chalk = require("chalk");

const { Notices, Users } = require("../Models");
const { getSubscribedUsers } = require("../Utilities");
const { sendEmail } = require("../Utilities");

const task = cron.schedule("0 * * * *", async () => {
  console.log(chalk.blue("Meeting scheduler running every hour..."));

  const currentTime = new Date();
  const oneHourLater = new Date(currentTime.getTime() + 60 * 60 * 1000);

  try {
    // Fetch meetings within the next hour for the current date
    const meetings = await Notices.find({
      meetingDate: currentTime.toISOString().split("T")[0], // Match today's date
      meetingTime: {
        $gte: `${currentTime.getHours()}:${String(
          currentTime.getMinutes()
        ).padStart(2, "0")}`, // Current time
        $lt: `${oneHourLater.getHours()}:${String(
          oneHourLater.getMinutes()
        ).padStart(2, "0")}`, // One hour later
      },
    });

    if (!meetings.length) {
      console.log(chalk.yellow("No meetings found within the next hour."));
      return;
    }

    console.log(
      chalk.green(`Found ${meetings.length} meeting(s) in the next hour.`)
    );

    // Loop through each meeting
    for (const meeting of meetings) {
      // Get emails of users allowed to receive notifications for the meeting
      const emailsToNotify = await getAllowedEmails(meeting.compulsory);

      if (emailsToNotify.length) {
        console.log(
          chalk.green(`Sending emails for meeting: ${meeting.title}`)
        );

        const emailSubject = `Meeting Reminder: ${meeting.title}`;
        const emailBody = `
            <h1>${meeting.title}</h1>
            <p>${meeting.description || "No additional details provided."}</p>
            <p><strong>Date:</strong> ${meeting.meetingDate.toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${meeting.meetingTime}</p>
            <p><strong>Link:</strong> <a href="${
              meeting.meetingLink
            }">Join Meeting</a></p>
          `;

        // Send email to all allowed users
        await sendEmail(emailsToNotify, emailSubject, emailBody);
        console.log(
          chalk.green(`Emails sent to: ${emailsToNotify.join(", ")}`)
        );
      } else {
        console.log(
          chalk.yellow(`No users to notify for meeting: ${meeting.title}`)
        );
      }
    }
  } catch (error) {
    console.error(chalk.red("Error in meeting scheduler:"), error);
  }
});

// Helper function to get allowed emails based on the meeting's `compulsory` field
async function getAllowedEmails(compulsory) {
  const rolesToNotify = getAllowedRoles(compulsory);
  const subscribedUsersEmails = await getSubscribedUsers();
  const users = await Users.find({
    subscribed: true,
    role: { $in: rolesToNotify },
    email: { $in: subscribedUsersEmails },
  }).select("email");

  return users.map((user) => user.email);
}

// Helper function to determine allowed roles
function getAllowedRoles(compulsory) {
  switch (compulsory) {
    case "ALL":
      return ["USER", "MEMBER", "COREMEMBER", "ADMIN"];
    case "MEMBER":
      return ["MEMBER", "COREMEMBER", "ADMIN"];
    case "COREMEMBER":
      return ["COREMEMBER", "ADMIN"];
    default:
      return [];
  }
}

exports.task = task;
