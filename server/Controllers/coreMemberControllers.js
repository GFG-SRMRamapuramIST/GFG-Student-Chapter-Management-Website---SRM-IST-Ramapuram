const chalk = require("chalk");

const { verifyAuthToken } = require("../Utilities");
const { DailyContests, Notices, ConstantValue } = require("../Models");

/*
************************** APIs **************************

1. Create a contest API

3. Delete a contest API
4. Create a Meeting on Notice Board API

6. Delete meeting on Notice Board API
7. Create MoM for a Meeting on Notice Board API

9. Delete MoM for a Meeting on Notice Board API

**********************************************************
*/

// Verify and Authorize Auth Token
const verifyAndAuthorize = async (token, allowedRoles) => {
  const authResult = await verifyAuthToken(token);

  if (authResult.status === "expired") {
    return { status: 401, message: "Token expired" };
  }
  if (authResult.status === "invalid") {
    return { status: 403, message: "Access denied. Invalid token." };
  }
  if (!allowedRoles.includes(authResult.role)) {
    return { status: 403, message: "Access denied. Unauthorized role." };
  }

  return { status: 200, userId: authResult.userId };
};

/***************************** CONTEST APIs *******************************/
//1. Create a contest API
exports.createContest = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header
    const { contestName, contestLink, platform, startTime, endTime, date } =
      req.body;

    // Use the helper function for authorization
    const authResult = await verifyAndAuthorize(token, [
      "ADMIN",
      "COREMEMBER",
      "VICEPRESIDENT",
      "PRESIDENT",
    ]);
    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    // Validate input
    if (
      !contestName ||
      !contestLink ||
      !platform ||
      !startTime ||
      !endTime ||
      !date
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate platform
    const allowedPlatforms = ["CodeChef", "Codeforces", "LeetCode"];
    if (!allowedPlatforms.includes(platform)) {
      return res.status(400).json({
        message: `Invalid platform. Allowed values are: ${allowedPlatforms.join(
          ", "
        )}`,
      });
    }

    // Validate date and time
    const currentDateTime = new Date();
    const contestStartDateTime = new Date(`${date}T${startTime}`);
    const contestEndDateTime = new Date(`${date}T${endTime}`);

    if (contestStartDateTime < currentDateTime) {
      return res.status(400).json({
        message: "Contest start date and time must be in the future.",
      });
    }

    if (contestEndDateTime <= contestStartDateTime) {
      return res.status(400).json({
        message: "Contest end date and time must be after the start time.",
      });
    }

    // Ensure the contest date is within the current month
    const contestDate = new Date(date);
    if (
      contestDate.getFullYear() !== currentDateTime.getFullYear() ||
      contestDate.getMonth() !== currentDateTime.getMonth()
    ) {
      return res.status(400).json({
        message: "The contest date must be within the current month.",
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
      contestLink,
      platform,
      startTime: contestStartDateTime,
      endTime: contestEndDateTime,
      participants: [],
      createdBy: authResult.userId,
    });

    // Save the updated document
    await dailyContest.save();

    // Find the ConstantValue document and increment totalContests by 1
    await ConstantValue.findOneAndUpdate(
      {}, // Match the first document (assuming there's only one document)
      { $inc: { totalContests: 1 } }, // Increment totalContests by 1
      { new: true, upsert: true } // Return the updated document, create if not exists
    );

    return res.status(200).json({
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

//3. Delete a contest API
exports.deleteContest = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const { dateId, contestId } = req.body;

    // Use the helper function for authorization
    const authResult = await verifyAndAuthorize(token, ["ADMIN", "COREMEMBER"]);
    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
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
      return res.status(404).json({
        message: "Contest not found for the given contest ID on given date",
      });
    }

    // Remove the contest from the contests array
    dailyContest.contests.pull(contestId);

    // If the number of contests becomes 0, delete the date entry
    if (dailyContest.contests.length === 0) {
      await DailyContests.findByIdAndDelete(dateId);

      // Find the ConstantValue document and increment totalContests by 1
      await ConstantValue.findOneAndUpdate(
        {}, // Match the first document (assuming there's only one document)
        { $inc: { totalContests: -1 } }, // Increment totalContests by 1
        { new: true, upsert: true } // Return the updated document, create if not exists
      );

      return res.status(200).json({
        message:
          "Contest deleted successfully, and the date entry was removed as no contests remain.",
      });
    }

    // Save the updated document
    await dailyContest.save();

    // Find the ConstantValue document and increment totalContests by 1
    await ConstantValue.findOneAndUpdate(
      {}, // Match the first document (assuming there's only one document)
      { $inc: { totalContests: -1 } }, // Increment totalContests by 1
      { new: true, upsert: true } // Return the updated document, create if not exists
    );

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
/**************************************************************************/

/***************************** NOTICE BOARD APIs **************************/
//4. Create a Meeting on Notice Board API
exports.createNotice = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const {
      title,
      description,
      meetingLink,
      meetingDate,
      meetingTime,
      compulsory,
    } = req.body;

    // Use the helper function for authorization
    const authResult = await verifyAndAuthorize(token, [
      "ADMIN",
      "COREMEMBER",
      "VICEPRESIDENT",
      "PRESIDENT",
    ]);
    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    // Validate required fields
    if (!title || !meetingLink || !meetingDate || !meetingTime || !compulsory) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Validate date and time
    const currentDateTime = new Date();
    const meetingDateTime = new Date(`${meetingDate}T${meetingTime}`);
    if (meetingDateTime < currentDateTime) {
      return res
        .status(400)
        .json({ message: "Meeting date and time must be in the future." });
    }

    // Validate `compulsory` field
    const allowedValues = ["ALL", "MEMBER", "COREMEMBER"];
    if (!allowedValues.includes(compulsory)) {
      return res.status(400).json({
        message: `Invalid value for compulsory. Allowed values are ${allowedValues.join(
          ", "
        )}.`,
      });
    }

    // Check for meeting time conflicts on the same date
    const sameDateMeetings = await Notices.find({
      meetingDate: new Date(meetingDate),
    });
    for (const meeting of sameDateMeetings) {
      const existingMeetingTime = new Date(
        `${meeting.meetingDate.toISOString().split("T")[0]}T${
          meeting.meetingTime
        }`
      );
      const timeDifference =
        Math.abs(meetingDateTime - existingMeetingTime) / (1000 * 60); // Difference in minutes

      if (timeDifference < 15) {
        return res.status(400).json({
          message:
            "There must be at least a 15-minute gap between two meetings on the same date.",
          conflictingMeeting: meeting,
        });
      }
    }

    // Create new notice
    const newNotice = new Notices({
      title,
      description,
      meetingLink,
      meetingDate,
      meetingTime,
      compulsory,
      createdBy: authResult.userId,
    });

    // Save notice to database
    await newNotice.save();

    return res.status(200).json({
      message: "Meeting created successfully.",
      data: newNotice,
    });
  } catch (error) {
    console.error(
      chalk.bgRed.bold.red("Error creating meeting:"),
      error.message
    );
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

//6. Delete meeting on Notice Board API
exports.deleteNotice = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const { meetingId } = req.body;

    // Use the helper function for authorization
    const authResult = await verifyAndAuthorize(token, ["ADMIN", "COREMEMBER"]);
    if (authResult.status !== 200) {
      return res.status(authResult.status).json({ message: authResult.message });
    }

    // Validate meetingId
    if (!meetingId) {
      return res.status(400).json({ message: "Meeting ID is required." });
    }

    // Find the meeting
    const meeting = await Notices.findById(meetingId);
    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found." });
    }

    // Delete the meeting
    const deletedMeeting = await Notices.findByIdAndDelete(meetingId);

    if (!deletedMeeting) {
      return res.status(500).json({ message: "Failed to delete the meeting." });
    }

    res.status(200).json({
      message: "Meeting deleted successfully.",
      data: deletedMeeting,
    });
  } catch (error) {
    console.error(chalk.bgRed.bold.red("Error deleting meeting:"), error);
    res.status(500).json({ message: "Internal server error." });
  }
};

//7. Create MoM for a Meeting on Notice Board API
exports.createMoM = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const { meetingId, MoMLink } = req.body;

    // Use the helper function for authorization
    const authResult = await verifyAndAuthorize(token, ["ADMIN", "COREMEMBER"]);
    if (authResult.status !== 200) {
      return res.status(authResult.status).json({ message: authResult.message });
    }

    // Validate input
    if (!meetingId || !MoMLink) {
      return res
        .status(400)
        .json({ message: "Meeting ID and MoM link are required." });
    }

    // Validate MoM link format
    const urlRegex = /^https?:\/\/.+/;
    if (!urlRegex.test(MoMLink)) {
      return res
        .status(400)
        .json({ message: "Invalid URL format for MoM link." });
    }

    // Find the meeting
    const meeting = await Notices.findById(meetingId);
    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found." });
    }

    // Check if the meeting is in the past
    const currentDateTime = new Date();
    const meetingDateTime = new Date(
      `${meeting.meetingDate.toISOString().split("T")[0]}T${
        meeting.meetingTime
      }:00`
    );

    if (meetingDateTime > currentDateTime) {
      return res
        .status(400)
        .json({ message: "MoM can only be created for past meetings." });
    }

    // Update the meeting with MoM details
    meeting.MoMLink = MoMLink;
    meeting.MoMCreatedBy = authResult.userId;
    meeting.MoMCreatedAt = currentDateTime;

    const updatedMeeting = await meeting.save();

    res.status(200).json({
      message: "MoM created successfully.",
      data: updatedMeeting,
    });
  } catch (error) {
    console.error(chalk.bgRed.bold.red("Error creating MoM:"), error);
    res.status(500).json({ message: "Internal server error." });
  }
};

//9. Delete MoM for a Meeting on Notice Board API
exports.deleteMoMLink = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const { meetingId } = req.body;

     // Use the helper function for authorization
     const authResult = await verifyAndAuthorize(token, ["ADMIN", "COREMEMBER"]);
     if (authResult.status !== 200) {
       return res.status(authResult.status).json({ message: authResult.message });
     }

    // Validate input
    if (!meetingId) {
      return res.status(400).json({ message: "Meeting ID is required." });
    }

    // Fetch the meeting
    const meeting = await Notices.findById(meetingId);
    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found." });
    }

    // Update MoMLink and related fields to null
    meeting.MoMLink = null;
    meeting.MoMCreatedBy = null;
    meeting.MoMCreatedAt = null;

    await meeting.save();

    res.status(200).json({
      message: "MoMLink deleted successfully.",
      data: meeting,
    });
  } catch (error) {
    console.error(chalk.bgRed.bold.red("Error deleting MoMLink:"), error);
    res.status(500).json({ message: "Internal server error." });
  }
};
/**************************************************************************/