const chalk = require("chalk");

const { verifyAuthToken } = require("../Utilities");
const { DailyContests, Notices } = require("../Models");

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
// Create a contest API
exports.createContest = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header
    const { contestName, platform, startTime, endTime, date } = req.body;

    // Use the helper function for authorization
    const authResult = await verifyAndAuthorize(token, ["ADMIN", "COREMEMBER"]);
    if (authResult.status !== 200) {
      return res.status(authResult.status).json({ message: authResult.message });
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

    // Use the helper function for authorization
    const authResult = await verifyAndAuthorize(token, ["ADMIN", "COREMEMBER"]);
    if (authResult.status !== 200) {
      return res.status(authResult.status).json({ message: authResult.message });
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

    // Use the helper function for authorization
    const authResult = await verifyAndAuthorize(token, ["ADMIN", "COREMEMBER"]);
    if (authResult.status !== 200) {
      return res.status(authResult.status).json({ message: authResult.message });
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
/**************************************************************************/

/***************************** NOTICE BOARD APIs **************************/
// Create a Meeting on Notice Board API
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
    const authResult = await verifyAndAuthorize(token, ["ADMIN", "COREMEMBER"]);
    if (authResult.status !== 200) {
      return res.status(authResult.status).json({ message: authResult.message });
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

    return res.status(201).json({
      message: "Notice created successfully.",
      data: newNotice,
    });
  } catch (error) {
    console.error(
      chalk.bgRed.bold.red("Error creating notice:"),
      error.message
    );
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Edit meeting on Notice Board API
exports.editNotice = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const {
      meetingId,
      title,
      description,
      meetingLink,
      meetingDate,
      meetingTime,
      compulsory,
    } = req.body;

    // Use the helper function for authorization
    const authResult = await verifyAndAuthorize(token, ["ADMIN", "COREMEMBER"]);
    if (authResult.status !== 200) {
      return res.status(authResult.status).json({ message: authResult.message });
    }

    // Validate required fields
    if (!title || !meetingLink || !meetingDate || !meetingTime || !compulsory) {
      return res
        .status(400)
        .json({ message: "All fields must be provided for editing." });
    }

    // Validate date and time
    const currentDateTime = new Date();
    const newMeetingDateTime = new Date(`${meetingDate}T${meetingTime}:00`);
    if (isNaN(newMeetingDateTime)) {
      return res.status(400).json({ message: "Invalid date or time format." });
    }
    if (newMeetingDateTime <= currentDateTime) {
      return res
        .status(400)
        .json({ message: "Meeting date and time must be in the future." });
    }

    // Validate compulsory value
    const allowedCompulsoryValues = ["ALL", "MEMBER", "COREMEMBER"];
    if (!allowedCompulsoryValues.includes(compulsory)) {
      return res.status(400).json({
        message: `Compulsory must be one of: ${allowedCompulsoryValues.join(
          ", "
        )}`,
      });
    }

    // Check if the new meeting time overlaps with existing meetings on the same date
    const sameDateMeetings = await Notices.find({
      meetingDate: new Date(meetingDate),
      _id: { $ne: meetingId }, // Exclude the current meeting
    });

    for (const meeting of sameDateMeetings) {
      const existingMeetingTime = new Date(
        `${meeting.meetingDate.toISOString().split("T")[0]}T${
          meeting.meetingTime
        }:00`
      );

      const timeDifference = Math.abs(
        (newMeetingDateTime - existingMeetingTime) / (1000 * 60)
      );
      if (timeDifference < 15) {
        return res.status(400).json({
          message:
            "Another meeting is scheduled at the same time or within 15 minutes.",
          meeting,
        });
      }
    }

    // Update the meeting
    const updatedMeeting = await Notices.findByIdAndUpdate(
      meetingId,
      {
        title,
        description,
        meetingLink,
        meetingDate,
        meetingTime,
        compulsory,
        createdBy: authResult.userId, // Update the createdBy field
      },
      { new: true } // Return the updated document
    );

    if (!updatedMeeting) {
      return res.status(404).json({ message: "Meeting not found." });
    }

    res.status(200).json({
      message: "Meeting updated successfully.",
      data: updatedMeeting,
    });
  } catch (error) {
    console.error(chalk.bgRed.bold.red("Error editing meeting:"), error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Delete meeting on Notice Board API
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

// Create MoM for a Meeting on Notice Board API
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

// Edit MoM for a Meeting on Notice Board API
exports.editMoMLink = async (req, res) => {
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
        .json({ message: "Both meetingId and MoMLink are required." });
    }
    if (!/^https?:\/\/.+/.test(MoMLink)) {
      return res.status(400).json({ message: "Invalid MoMLink format." });
    }

    // Fetch the meeting
    const meeting = await Notices.findById(meetingId);
    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found." });
    }

    // Ensure the meeting is in the past
    const currentDateTime = new Date();
    const meetingDateTime = new Date(
      `${meeting.meetingDate.toISOString().split("T")[0]}T${
        meeting.meetingTime
      }:00`
    );

    if (meetingDateTime > currentDateTime) {
      return res
        .status(400)
        .json({ message: "MoMLink can only be edited for past meetings." });
    }

    // Update the MoMLink and related fields
    meeting.MoMLink = MoMLink;
    meeting.MoMCreatedBy = authResult.userId;
    meeting.MoMCreatedAt = new Date();

    await meeting.save();

    res.status(200).json({
      message: "MoMLink updated successfully.",
      data: meeting,
    });
  } catch (error) {
    console.error(chalk.bgRed.bold.red("Error editing MoMLink:"), error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Delete MoM for a Meeting on Notice Board API
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