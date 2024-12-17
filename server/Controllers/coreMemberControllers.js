const chalk = require("chalk");

const { verifyAuthToken } = require("../Utilities");
const { DailyContests } = require("../Models");

// Create a contest API
exports.createContest = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header
    const { contestName, platform, startTime, endTime, date } = req.body;

    // Verify the token
    const authResult = await verifyAuthToken(token);
    if (authResult.status === "expired") {
      return res.status(401).json({ message: "Token expired" });
    }

    if (
      authResult.status === "invalid" ||
      !["ADMIN", "COREMEMBER"].includes(authResult.role)
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Validate input
    if (!contestName || !platform || !startTime || !endTime || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate platform
    const allowedPlatforms = [
      "CodeChef",
      "Codeforces",
      "GeeksForGeeks",
      "HackerEarth",
      "HackerRank",
      "LeetCode",
    ];
    if (!allowedPlatforms.includes(platform)) {
      return res.status(400).json({
        message: `Invalid platform. Allowed values are: ${allowedPlatforms.join(
          ", "
        )}`,
      });
    }

    const contestDate = new Date(date);
    const currentDate = new Date();

    // Ensure the contest is in the current month
    if (
      contestDate.getFullYear() !== currentDate.getFullYear() ||
      contestDate.getMonth() !== currentDate.getMonth()
    ) {
      return res.status(400).json({
        message: "The contest date must be within the current month",
      });
    }

    // Check if the contest date already exists in the database
    let dailyContest = await DailyContests.findOne({ date: contestDate });

    if (!dailyContest) {
      // If the date does not exist, create a new document
      dailyContest = new DailyContests({
        date: contestDate,
        contests: [],
      });
    }

    // Add the contest to the contests array for the given date
    dailyContest.contests.push({
      contestName,
      platform,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      participants: [],
      createdBy: authResult.userId,
    });

    // Save the updated document
    await dailyContest.save();

    return res.status(201).json({
      message: "Contest created successfully!",
      data: dailyContest,
    });
  } catch (error) {
    console.error(
      chalk.bgRed.bold.red("Error creating contest:"),
      error.message
    );
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Edit a contest API
exports.editContest = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const {
      dateId,
      contestId,
      newDate,
      contestName,
      platform,
      startTime,
      endTime,
    } = req.body;

    // Verify the token
    const authResult = await verifyAuthToken(token);
    if (authResult.status === "expired") {
      return res.status(401).json({ message: "Token expired" });
    }

    if (
      authResult.status === "invalid" ||
      !["ADMIN", "COREMEMBER"].includes(authResult.role)
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Validate required fields
    if (
      !dateId ||
      !contestId ||
      !newDate ||
      !contestName ||
      !platform ||
      !startTime ||
      !endTime
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate platform
    const allowedPlatforms = [
      "CodeChef",
      "Codeforces",
      "GeeksForGeeks",
      "HackerEarth",
      "HackerRank",
      "LeetCode",
    ];
    if (!allowedPlatforms.includes(platform)) {
      return res.status(400).json({
        message: `Invalid platform. Allowed values are: ${allowedPlatforms.join(
          ", "
        )}`,
      });
    }

    const currentDate = new Date();

    // Find the document by date ID
    const dailyContest = await DailyContests.findById(dateId);
    if (!dailyContest) {
      return res
        .status(404)
        .json({ message: "No entry found for the given date ID" });
    }

    // Check if the date for this contest has passed
    if (dailyContest.date < currentDate) {
      return res.status(400).json({
        message: "The date associated with this contest has already passed",
      });
    }

    // Find the specific contest by ID
    const contest = dailyContest.contests.id(contestId);
    if (!contest) {
      return res.status(404).json({
        message: "Contest not found for the given contest_id and date",
      });
    }

    // Validate if the new date for the contest is in the future
    const newContestDate = new Date(newDate);
    if (newContestDate < currentDate) {
      return res.status(400).json({
        message: "The new date for the contest must be in the future",
      });
    }

    // If the new date is different from the current date
    if (dailyContest.date.toISOString() !== newContestDate.toISOString()) {
      // Find or create a document for the new date
      let newDailyContest = await DailyContests.findOne({
        date: newContestDate,
      });
      if (!newDailyContest) {
        newDailyContest = new DailyContests({
          date: newContestDate,
          contests: [],
        });
      }

      // Remove the contest from the old date and add it to the new date
      dailyContest.contests.pull(contestId);

      // If the old date now has no contests, delete it
      if (dailyContest.contests.length === 0) {
        await DailyContests.findByIdAndDelete(dateId);
      } else {
        await dailyContest.save();
      }

      // Add the updated contest to the new date's document
      newDailyContest.contests.push({
        contestName,
        platform,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        createdBy: authResult.userId,
      });
      await newDailyContest.save();

      return res.status(200).json({
        message: "Contest updated and moved to the new date successfully!",
        newDateId: newDailyContest._id,
        contest,
      });
    } else {
      // Update the contest details if the date hasn't changed
      contest.contestName = contestName;
      contest.platform = platform;
      contest.startTime = new Date(startTime);
      contest.endTime = new Date(endTime);
      contest.createdBy = authResult.userId;

      // Save the updated document
      await dailyContest.save();

      return res.status(200).json({
        message: "Contest updated successfully!",
        data: contest,
      });
    }
  } catch (error) {
    console.error(
      chalk.bgRed.bold.red("Error editing contest:"),
      error.message
    );
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Delete a contest API
exports.deleteContest = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const { dateId, contestId } = req.body;

    // Verify the token
    const authResult = await verifyAuthToken(token);
    if (authResult.status === "expired") {
      return res.status(401).json({ message: "Token expired" });
    }

    if (
      authResult.status === "invalid" ||
      !["ADMIN", "COREMEMBER"].includes(authResult.role)
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Validate required fields
    if (!dateId || !contestId) {
      return res
        .status(400)
        .json({ message: "Both dateId and contestId are required" });
    }

    // Find the document by date ID
    const dailyContest = await DailyContests.findById(dateId);
    if (!dailyContest) {
      return res
        .status(404)
        .json({ message: "No entry found for the given date ID" });
    }

    // Find the specific contest by ID
    const contest = dailyContest.contests.id(contestId);
    if (!contest) {
      return res
        .status(404)
        .json({
          message: "Contest not found for the given contest ID on given date",
        });
    }

    // Remove the contest from the contests array
    dailyContest.contests.pull(contestId);

    // If the number of contests becomes 0, delete the date entry
    if (dailyContest.contests.length === 0) {
      await DailyContests.findByIdAndDelete(dateId);
      return res.status(200).json({
        message:
          "Contest deleted successfully, and the date entry was removed as no contests remain.",
      });
    }

    // Save the updated document
    await dailyContest.save();

    return res.status(200).json({
      message: "Contest deleted successfully!",
    });
  } catch (error) {
    console.error(
      chalk.bgRed.bold.red("Error deleting contest:"),
      error.message
    );
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
