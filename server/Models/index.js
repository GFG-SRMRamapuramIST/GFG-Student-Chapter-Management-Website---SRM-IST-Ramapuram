const Users = require("./userSchema");
const DailyContests = require("./dailyContestSchema");
const Resources = require("./resourcesSchema");
const Notice = require("./noticeBoardSchema");
const AllowedEmail = require("./allowedEmailsSchema");
const BlockedEmails = require("./blockedEmailsSchema");
const ConstantValue = require("./constantSchema");

module.exports = {
  Users,
  DailyContests,
  Resources,
  Notice,
  AllowedEmail,
  BlockedEmails,
  ConstantValue,
};
