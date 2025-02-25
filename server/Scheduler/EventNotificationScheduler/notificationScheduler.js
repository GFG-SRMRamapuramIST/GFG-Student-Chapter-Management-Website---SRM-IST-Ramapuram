const cron = require("node-cron");
const chalk = require("chalk");

const { peekTopEvent, removeTopEvent } = require("./eventMinHeap");

const sendMeetingNotification = require("./meetingNotificationFunction");
const sendContestNotification = require("./contestNotificationFunction");

let currentTask = null;

/**
 * Converts a given date and time into a cron expression for 1 hour before.
 * @param {string} date - Event date in YYYY-MM-DD format.
 * @param {string} startTime - Event start time in HH:MM format.
 * @returns {string} Cron expression.
 */
function getCronExpression(date, startTime) {
  if (!date || !startTime || isNaN(new Date(startTime).getTime())) {
    return "0 * * * *"; // Default to run every hour if invalid input
  }

  const eventTime = new Date(startTime); // startTime is already a Date object

  // Subtract 1 hour for notification
  eventTime.setHours(eventTime.getHours() - 1);

  // Convert UTC time to local system time
  const localMinute = eventTime.getMinutes();
  const localHour = eventTime.getHours();
  const localDay = eventTime.getDate();
  const localMonth = eventTime.getMonth() + 1; // Months are 0-based

  return `${localMinute} ${localHour} ${localDay} ${localMonth} *`;
}

/**
 * Schedules the next notification based on the top event in the heap.
 */
function scheduleNextEvent() {
  if (currentTask) {
    currentTask.stop(); // Stop any existing scheduled task
  }

  const nextEvent = peekTopEvent();
  if (!nextEvent) {
    console.log("No upcoming events to schedule.");
    return;
  }

  const { date, startTime, type, eventId } = nextEvent;
  const cronExpression = getCronExpression(date, startTime);

  console.log(
    `Scheduling notification for event ${eventId} (${type}) at cron: ${cronExpression}`
  );

  currentTask = cron.schedule(cronExpression, async () => {
    try {
      console.log(`Executing notification for event ID: ${eventId} (${type})`);

      if (type === "contest") {
        await sendContestNotification(date, eventId);
      } else if (type === "meeting") {
        await sendMeetingNotification(date, eventId);
      } else {
        console.warn(chalk.yellow(`Unknown event type: ${type}`));
      }
    } catch (error) {
      console.error(
        chalk.bgRed.bold("Error executing notification:") + error.message
      );
    }

    removeTopEvent(); // Remove the executed event from the heap
    scheduleNextEvent(); // Schedule the next event
  });
}

console.log(chalk.bgMagenta.bold("Event Notification Scheduler Initialized."));

// Export necessary functions
module.exports = {
  scheduleNextEvent,
};
