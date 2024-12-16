const Users = require("./userSchema");
const Team = require("./teamSchema");
const DailyContests = require("./dailyContestSchema");
const Resources = require("./resourcesSchema");
const Notices = require("./noticeBoardSchema");
const AllowedEmail = require("./allowedEmailsSchema");

module.exports = {
  Users,
  Team,
  DailyContests,
  Resources,
  Notices,
  AllowedEmail,
};
