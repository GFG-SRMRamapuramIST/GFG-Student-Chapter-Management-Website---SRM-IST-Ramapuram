// Month-end Scheduler performs (awardTopPerformers, backUpDataFunction, resetDataFunction) based on the configuration flags.
const monthEndScheduler = require("./MonthEndScheduler/monthEndScheduler");

// Notification scheduler for sending contest and meeting notifications
const {
  scheduleNextEvent,
} = require("./EventNotificationScheduler/notificationScheduler");

// Update all coding platfrom data for all users
const {
  updateUserCodingPlatformsDataScheduler,
} = require("./CodingPlatformScheduler/ProfileDataScheduler");

// Update all coding platform contest data for all users
const {
  updateContestDataScheduler,
} = require("./CodingPlatformScheduler/ContestDataScheduler");

const keepAliveJob = require("./KeepAliveJob");

module.exports = {
  keepAliveJob,
  monthEndScheduler,
  scheduleNextEvent,
  updateUserCodingPlatformsDataScheduler,
  updateContestDataScheduler,
};
