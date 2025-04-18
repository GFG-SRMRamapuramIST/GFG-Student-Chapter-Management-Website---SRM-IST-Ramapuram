const Users = require("./userSchema");
const DailyContests = require("./dailyContestSchema");
const Resources = require("./resourcesSchema");
const Notice = require("./noticeBoardSchema");
const AllowedEmail = require("./allowedEmailsSchema");
const BlockedEmails = require("./blockedEmailsSchema");
const ConstantValue = require("./constantSchema");
const potdSchema = require("./potdSchema");
const Announcement = require("./announcementSchema");
const VideoResources = require("./videoResourceSchema");
const Festival = require("./festicalSchema");

module.exports = {
  Users,
  DailyContests,
  Resources,
  Notice,
  AllowedEmail,
  BlockedEmails,
  ConstantValue,
  potdSchema,
  Announcement,
  VideoResources,
  Festival,
};
