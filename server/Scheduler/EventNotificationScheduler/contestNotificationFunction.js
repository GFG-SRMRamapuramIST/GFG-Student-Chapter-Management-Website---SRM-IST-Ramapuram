const { DailyContests } = require("../../Models");
const sendEmail = require("../../Utilities/sendEmail");
const getSubscribedUsers = require("../../Utilities/getSubscribedUsers");

require("dotenv").config();

const sendContestNotification = async (date, contestId) => {
  try {
    // Ensure the date is a valid Date object
    const contestDate = new Date(date);
    if (isNaN(contestDate.getTime())) {
      throw new Error("Invalid date format provided.");
    }

    // Find the contest for the given date
    const dailyContest = await DailyContests.findOne({ date: contestDate });

    if (!dailyContest) {
      console.error(`No contest found for date: ${date}`);
      return;
    }

    // Find the specific contest in the contests array
    const contest = dailyContest.contests.find(
      (c) => c._id.toString() === contestId.toString()
    );

    if (!contest) {
      console.error(`Contest with ID ${contestId} not found for date: ${date}`);
      return;
    }

    // Fetch emails of subscribed users
    const recipients = await getSubscribedUsers("ALL");

    if (!recipients.length) {
      console.log("No subscribed users found.");
      return;
    }

    // Email subject and content
    const subject = `Upcoming Contest: ${contest.contestName}`;
    const message = `
      <h2>Upcoming Contest: ${contest.contestName}</h2>
      <p><strong>Date:</strong> ${contestDate.toDateString()}</p>
      <p><strong>Start Time:</strong> ${contest.startTime}</p>
      <p><strong>End Time:</strong> ${contest.endTime}</p>
      <p><strong>Platform:</strong> ${contest.platform}</p>
      <p><strong>Contest Link:</strong> <a href="${
        contest.contestLink
      }">Join Contest</a></p>
      <br />
      <p>Prepare well and all the best!</p>
    `;

    // Send email to users
    await sendEmail(recipients, subject, message);
    console.log(
      `Contest notification sent successfully for contest: ${contestId}`
    );
  } catch (error) {
    console.error("Error in sendContestNotification:", error.message);

    // Send failure notification to admin
    await sendEmail(
      process.env.EMAIL, // Admin email
      "sendContestNotification Function Failed",
      `<p>The sendContestNotification function failed due to the following error:</p>
      <p><strong>Error:</strong> ${error.message}</p>`
    );
  }
};

module.exports = sendContestNotification;
