const Users = require("./userSchema");
const Team = require("./teamSchema");
const DailyContests = require("./dailyContestSchema");
const Resources = require("./resourcesSchema");
const Notices = require("./noticeBoardSchema");
const AllowedEmail = require("./allowedEmailsSchema");
const BlockedEmails = require("./blockedEmailsSchema");
const ConstantValue = require("./constantSchema");
const BackUp = require("./backUpSchema");

module.exports = {
  Users,
  Team,
  DailyContests,
  Resources,
  Notices,
  AllowedEmail,
  BlockedEmails,
  ConstantValue,
  BackUp,
};
