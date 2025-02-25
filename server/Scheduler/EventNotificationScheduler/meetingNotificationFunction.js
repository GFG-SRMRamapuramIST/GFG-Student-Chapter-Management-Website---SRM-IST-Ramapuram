const { Notice } = require("../../Models");

const { sendEmail, getSubscribedUsers } = require("../../Utilities");

require("dotenv").config();

const sendMeetingNotification = async (date, meetingId) => {
  try {
    // Find the notice for the given date
    const noticeGroup = await Notice.findOne({
      meetingDate: new Date(date),
    }).lean();
    if (!noticeGroup) {
      throw new Error("No meetings found for the given date.");
    }

    // Find the specific meeting within the notice group
    const meeting = noticeGroup.notices.find(
      (notice) => notice._id.toString() === meetingId.toString()
    );
    if (!meeting) {
      throw new Error("Meeting not found with the given ID.");
    }

    // Get the list of compulsory roles for the meeting
    const compulsoryRole = meeting.compulsory;

    // Get the subscribed users' emails based on the compulsory role
    const recipients = await getSubscribedUsers(compulsoryRole);

    if (recipients.length === 0) {
      console.log("No subscribed users to notify.");
      return;
    }

    // Construct the email content
    const subject = `Reminder: Upcoming Meeting - ${meeting.title}`;
    const message = `
      <h3>${meeting.title}</h3>
      <p>${meeting.description}</p>
      <p><strong>Meeting Date:</strong> ${date}</p>
      <p><strong>Meeting Time:</strong> ${meeting.meetingTime}</p>
      <p><strong>Meeting Link:</strong> <a href="${meeting.meetingLink}">${meeting.meetingLink}</a></p>
      <p><strong>Compulsory For:</strong> ${compulsoryRole}</p>
      <p>Please make sure to attend on time.</p>
    `;

    // Send email notification
    await sendEmail(recipients, subject, message);
  } catch (error) {
    console.error("Error sending meeting notification:", error.message);

    // Notify admin in case of failure
    await sendEmail(
      process.env.EMAIL,
      "Meeting Notification Function Failed",
      `<p>The meeting notification function failed due to the following error:</p>
       <p><strong>Error:</strong> ${error.message}</p>`
    );
  }
};

module.exports = sendMeetingNotification;
