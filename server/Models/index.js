const Users = require("./userSchema");
const DailyContests = require("./dailyContestSchema");
const Resources = require("./resourcesSchema");
const Notice = require("./noticeBoardSchema");
const AllowedEmail = require("./allowedEmailsSchema");
const BlockedEmails = require("./blockedEmailsSchema");
const ConstantValue = require("./constantSchema");
const potdSchema = require("./potdSchema");

module.exports = {
  Users,
  DailyContests,
  Resources,
  Notice,
  AllowedEmail,
  BlockedEmails,
  ConstantValue,
  potdSchema,
};
