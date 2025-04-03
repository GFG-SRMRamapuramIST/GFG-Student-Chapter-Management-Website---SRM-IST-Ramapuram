const {
  verifyAuthToken,
  sendEmail,
  getSubscribedUsers,
} = require("../Utilities");

// Importing required models and schedulers and contest min heap and contest data update scheduler
const {
  addContest,
} = require("../Scheduler/CodingPlatformScheduler/contestMinHeap");
const {
  updateContestDataScheduler,
} = require("../Scheduler/CodingPlatformScheduler/ContestDataScheduler");

const {
  DailyContests,
  Notice,
  Resources,
  Announcement,
  VideoResources,
} = require("../Models");
/*
************************** APIs **************************

1. Create a contest API

3. Delete a contest API
4. Create a Meeting on Notice Board API

6. Delete meeting on Notice Board API
7. Create MoM for a Meeting on Notice Board API

9. Delete MoM for a Meeting on Notice Board API

10. Create a resource API
11. Add a question to a resource API
12. Delete a question of a resource API
13. Delete a resource API
14. Edit a resource API
15. Fetch all resources API
16. Fetch all questions of a resource API

17. Create announcement API
18. Delete announcement API
19. Get Announcement API

20. Get contest & meeting data API

21. Create a video resource API
22. Add a video to a video resource API
23. Delete a video of a video resource API
24. Delete a video resource API
25. Edit a video resource API
26. Fetch all video resource API
27. Fetch all videos of a video resource API

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

//***************************** CONTEST APIs *******************************/
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
    //! startTime & endTime should be in the format HH:MM:SS, then only the notificationScheduler and platformDataScheduler will work
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

    // Define allowed platforms as a dictionary
    const platformMap = {
      codechef: "CodeChef",
      codeforces: "Codeforces",
      leetcode: "LeetCode",
    };

    // Validate platform (case-insensitive)
    const lowerCasePlatform = platform.toLowerCase();
    if (!platformMap[lowerCasePlatform]) {
      return res.status(400).json({
        message: `Invalid platform. Allowed values are: ${Object.values(
          platformMap
        ).join(", ")}`,
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
    const newContest = {
      contestName,
      contestLink,
      platform: platformMap[lowerCasePlatform], // Store formatted platform name
      startTime: contestStartDateTime,
      endTime: contestEndDateTime,
      createdBy: authResult.userId,
    };

    dailyContest.contests.push(newContest);

    // Save the updated document
    await dailyContest.save();

    /* *********** Contest Scheduler starts here ************** */
    // const adjustedContestDate =
    //   lowerCasePlatform === "codeforces"
    //     ? new Date(contestDate.setDate(contestDate.getDate() + 1))
    //     : contestDate;

    addContest(contestName, contestDate, contestEndDateTime, lowerCasePlatform);

    // Schedule the next contest data update system
    updateContestDataScheduler();
    /* *********** Contest Scheduler ends here ************** */

    /* *********** Contest notification system starts here ************ */
    // Get the subscribed users' emails based on the compulsory role
    const recipients = await getSubscribedUsers("ALL");

    // Send email notification
    const subject = "Contest Added";
    const message = `
            <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Contest Added</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border-radius: 10px;
          }
          .header {
            text-align: center;
            padding: 20px;
          }
          .header img {
            height: 80px;
          }
          .content {
            padding: 20px;
            text-align: left;
          }
          .content h2 {
            color: #00895e;
            text-align: center;
          }
          .content p {
            color: #555;
            line-height: 1.5;
          }
          .footer {
            text-align: center;
            padding: 20px;
            background-color: #f8f8f8;
            font-size: 14px;
            color: #666;
          }
          .footer a {
            color: #00895e;
            text-decoration: none;
            font-weight: bold;
          }
          .social-icons {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-top: 10px;
          }
          .social-icons img {
            width: 24px;
            height: 24px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img
              src="https://res.cloudinary.com/du1b2thra/image/upload/v1739372825/dyq9xw2oatp9rjthimf4.png"
              alt="GFG SRM RMP"
            />
          </div>

          <div class="content">
            <h2>Contest Added</h2>
            <p>Dear user,</p>
            <p>We are writing to inform you about a newly added contest on our calender. Details given below:</p>

            <h3 style="color: #00895e">${contestName}</h3>
            <p>Which will be conducted on ${platformMap[lowerCasePlatform]} at ${contestStartDateTime}</p>

            <p>Participating in this contest would help you learn and grow as a compitative coder, so don't miss out.</p>

            <p>
              For more details, please visit
              our official website:
            </p>
            <p style="text-align: center">
              <a
                href="https://gfgsc-management-website-srm-ist-ramapuram-testing.vercel.app/"
                style="
                  background-color: #00895e;
                  color: #ffffff;
                  padding: 10px 20px;
                  border-radius: 5px;
                  text-decoration: none;
                  display: inline-block;
                "
                >Visit Our Website</a
              >
            </p>
          </div>

          <div class="footer">
            <p>Join our ever-growing community!</p>
            <div class="social-icons">
              <a href="https://www.instagram.com/geeksforgeeks_srm_rmp/"
                ><img
                  src="https://res.cloudinary.com/du1b2thra/image/upload/v1739607885/wudcidksorrlsc43i0hn.png"
                  alt="Instagram"
              /></a>
              <a href="https://www.linkedin.com/company/geeksforgeeks-srm-rmp"
                ><img
                  src="https://res.cloudinary.com/du1b2thra/image/upload/v1739608002/lpdxsqycyrszaufpfrap.png"
                  alt="LinkedIn"
              /></a>
              <a href="https://x.com/GFG_SRM_RMP"
                ><img
                  src="https://res.cloudinary.com/du1b2thra/image/upload/v1739608105/dnbjvcdmxstrj9yhoy7e.png"
                  alt="Twitter/X"
              /></a>
              <a href="https://gfgsrmrmp.vercel.app/"
                ><img
                  src="https://res.cloudinary.com/du1b2thra/image/upload/v1739608156/iorqcssxpnwvgftktnkt.png"
                  alt="Website"
              /></a>
            </div>
           <div class="footer-bottom" style="height: 200px; overflow: hidden;">
                          <div>Queries? We're just one email away: <span style="color: #00895e;">geeksforgeeks.srmistrmp@gmail.com</span> </div>
                          <div>© 2025 GFG Student Chapter. All rights reserved.</div>
                      </div>
          </div>
        </div>
      </body>
    </html>
    `;
    await sendEmail(recipients, subject, message);

    // Delay for 5 seconds before sending the next email
    await new Promise((resolve) => setTimeout(resolve, 5000));
    /* *********** Contest notification system ends here ************ */

    return res.status(200).json({
      message: "Contest created successfully!",
      data: dailyContest,
    });
  } catch (error) {
    console.error("Error creating contest:", error.message);
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
        message: "Contest not found for the given contest ID on the given date",
      });
    }

    // Remove the contest from the contests array
    dailyContest.contests.pull(contestId);

    // If the number of contests becomes 0, delete the date entry
    if (dailyContest.contests.length === 0) {
      await DailyContests.findByIdAndDelete(dateId);
      return res.status(200).json({
        message: "Contest deleted successfully and date entry removed",
      });
    }

    // Save the updated document
    await dailyContest.save();

    return res.status(200).json({
      message: "Contest deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting contest:", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
//**************************************************************************/

//***************************** NOTICE BOARD APIs **************************/
//4. Create a Meeting on Notice Board API
exports.createNotice = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    //! meetingTime should be in the format HH:MM:SS, then only the notificationScheduler will work
    const {
      title,
      description,
      meetingLink,
      meetingDate,
      meetingTime,
      compulsory,
    } = req.body;

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

    if (!title || !meetingLink || !meetingDate || !meetingTime || !compulsory) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const currentDateTime = new Date();
    const meetingDateTime = new Date(`${meetingDate}T${meetingTime}`);
    if (meetingDateTime < currentDateTime) {
      return res
        .status(400)
        .json({ message: "Meeting date and time must be in the future." });
    }

    const allowedValues = ["ALL", "MEMBER", "COREMEMBER"];
    const compulsoryTo = compulsory.toUpperCase();
    if (!allowedValues.includes(compulsoryTo)) {
      return res.status(400).json({
        message: `Invalid value for compulsory. Allowed values are ${allowedValues.join(
          ", "
        )}.`,
      });
    }

    let dailyNotices = await Notice.findOne({
      meetingDate: new Date(meetingDate),
    });
    if (!dailyNotices) {
      dailyNotices = new Notice({
        meetingDate: new Date(meetingDate),
        notices: [],
      });
    }

    const newNotice = {
      title,
      description,
      meetingLink,
      meetingTime,
      compulsory: compulsoryTo,
      createdBy: authResult.userId,
    };

    dailyNotices.notices.push(newNotice);
    await dailyNotices.save();

    // Get the subscribed users' emails based on the compulsory role
    const recipients = await getSubscribedUsers(compulsoryTo);

    // Send email notification
    const subject = "Meeting Scheduled";
    const message = `
            <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Meeting Scheduled</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border-radius: 10px;
          }
          .header {
            text-align: center;
            padding: 20px;
          }
          .header img {
            height: 80px;
          }
          .content {
            padding: 20px;
            text-align: left;
          }
          .content h2 {
            color: #00895e;
            text-align: center;
          }
          .content p {
            color: #555;
            line-height: 1.5;
          }
          .footer {
            text-align: center;
            padding: 20px;
            background-color: #f8f8f8;
            font-size: 14px;
            color: #666;
          }
          .footer a {
            color: #00895e;
            text-decoration: none;
            font-weight: bold;
          }
          .social-icons {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-top: 10px;
          }
          .social-icons img {
            width: 24px;
            height: 24px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img
              src="https://res.cloudinary.com/du1b2thra/image/upload/v1739372825/dyq9xw2oatp9rjthimf4.png"
              alt="GFG SRM RMP"
            />
          </div>

          <div class="content">
            <h2>Meeting Scheduled</h2>
            <p>Dear user,</p>
            <p>We are writing to inform you that a meeting is scheduled for you to attend. Details given below:</p>

            <h3 style="color: #00895e">${title}</h3>
            <p>${description}</p>
            <p>Meeting Link: <a href="${meetingLink}"}>Link</a></p>
            <p>Start Time: ${meetingTime}</p>

            <p>We would appriciate your participation in the meeting.</p>

            <p>
              For more details, please visit
              our official website:
            </p>
            <p style="text-align: center">
              <a
                href="https://gfgsc-management-website-srm-ist-ramapuram-testing.vercel.app/"
                style="
                  background-color: #00895e;
                  color: #ffffff;
                  padding: 10px 20px;
                  border-radius: 5px;
                  text-decoration: none;
                  display: inline-block;
                "
                >Visit Our Website</a
              >
            </p>
          </div>

          <div class="footer">
            <p>Join our ever-growing community!</p>
            <div class="social-icons">
              <a href="https://www.instagram.com/geeksforgeeks_srm_rmp/"
                ><img
                  src="https://res.cloudinary.com/du1b2thra/image/upload/v1739607885/wudcidksorrlsc43i0hn.png"
                  alt="Instagram"
              /></a>
              <a href="https://www.linkedin.com/company/geeksforgeeks-srm-rmp"
                ><img
                  src="https://res.cloudinary.com/du1b2thra/image/upload/v1739608002/lpdxsqycyrszaufpfrap.png"
                  alt="LinkedIn"
              /></a>
              <a href="https://x.com/GFG_SRM_RMP"
                ><img
                  src="https://res.cloudinary.com/du1b2thra/image/upload/v1739608105/dnbjvcdmxstrj9yhoy7e.png"
                  alt="Twitter/X"
              /></a>
              <a href="https://gfgsrmrmp.vercel.app/"
                ><img
                  src="https://res.cloudinary.com/du1b2thra/image/upload/v1739608156/iorqcssxpnwvgftktnkt.png"
                  alt="Website"
              /></a>
            </div>
           <div class="footer-bottom" style="height: 200px; overflow: hidden;">
                          <div>Queries? We're just one email away: <span style="color: #00895e;">geeksforgeeks.srmistrmp@gmail.com</span> </div>
                          <div>© 2025 GFG Student Chapter. All rights reserved.</div>
                      </div>
          </div>
        </div>
      </body>
    </html>
    `;
    await sendEmail(recipients, subject, message);

    // Delay for 5 seconds before sending the next email
    await new Promise((resolve) => setTimeout(resolve, 5000));

    res
      .status(200)
      .json({ message: "Meeting created successfully.", data: dailyNotices });
  } catch (error) {
    console.error("Error creating meeting:", error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

//6. Delete meeting on Notice Board API
exports.deleteNotice = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const { dateId, noticeId } = req.body;

    const authResult = await verifyAndAuthorize(token, ["ADMIN", "COREMEMBER"]);
    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    const dailyNotices = await Notice.findById(dateId);
    if (!dailyNotices) {
      return res
        .status(404)
        .json({ message: "No entry found for the given date ID" });
    }

    // Check if the notice exists
    const notice = dailyNotices.notices.id(noticeId);
    if (!notice) {
      return res.status(404).json({
        message: "Notice not found for the given ID on the given date",
      });
    }

    // Remove the notice from the array
    dailyNotices.notices.pull(noticeId);

    // If no notices remain, delete the entire date entry
    if (dailyNotices.notices.length === 0) {
      await Notice.findByIdAndDelete(dateId);
      return res
        .status(200)
        .json({ message: "Notice deleted and date entry removed." });
    }

    await dailyNotices.save();
    res.status(200).json({ message: "Notice deleted successfully!" });
  } catch (error) {
    console.error("Error deleting notice:", error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

//7. Create MoM for a Meeting on Notice Board API
exports.createMoM = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const { dateId, noticeId, MoMLink } = req.body;
    //console.log(req.body);

    const authResult = await verifyAndAuthorize(token, ["ADMIN", "COREMEMBER"]);
    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    const dailyNotices = await Notice.findById(dateId);
    if (!dailyNotices) {
      return res
        .status(404)
        .json({ message: "No entry found for the given date ID" });
    }

    // Check if the notice exists
    const notice = dailyNotices.notices.id(noticeId);
    if (!notice) {
      return res.status(404).json({
        message: "Notice not found for the given ID on the given date",
      });
    }
    notice.MoMLink = MoMLink;
    notice.MoMCreatedBy = authResult.userId;
    notice.MoMCreatedAt = new Date();

    await dailyNotices.save();
    res
      .status(200)
      .json({ message: "MoM created successfully.", data: notice });
  } catch (error) {
    console.error("Error creating MoM:", error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

//9. Delete MoM for a Meeting on Notice Board API
exports.deleteMoMLink = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const { dateId, noticeId } = req.body;

    const authResult = await verifyAndAuthorize(token, ["ADMIN", "COREMEMBER"]);
    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    const dailyNotices = await Notice.findById(dateId);
    if (!dailyNotices) {
      return res
        .status(404)
        .json({ message: "No entry found for the given date ID" });
    }

    const notice = dailyNotices.notices.id(noticeId);
    if (!notice) {
      return res.status(404).json({ message: "Notice not found." });
    }

    notice.MoMLink = null;
    notice.MoMCreatedBy = null;
    notice.MoMCreatedAt = null;

    await dailyNotices.save();
    res
      .status(200)
      .json({ message: "MoMLink deleted successfully.", data: notice });
  } catch (error) {
    console.error("Error deleting MoMLink:", error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

//20. Get contest & meetind data API
exports.fetchDashboardCalenderData = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    const contests = await DailyContests.find({
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const meetings = await Notice.find({
      meetingDate: { $gte: startOfMonth, $lte: endOfMonth },
    });

    res.status(200).json({
      message: "Dashboard Calender data fetched successfully!",
      contests,
      meetings,
    });
  } catch (error) {
    console.error("Error fetching Dashboard Calender data:", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

//*************************************************************************/

//*************************** Resource API ******************************** */
//10. Create a resource API
exports.createResource = async (req, res) => {
  try {
    const { title, description } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided." });
    }

    const allowedRoles = ["COREMEMBER", "VICEPRESIDENT", "PRESIDENT", "ADMIN"];
    const authResult = await verifyAndAuthorize(token, allowedRoles);

    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    const newResource = new Resources({
      title,
      description,
    });

    await newResource.save();

    return res.status(200).json({
      message: "Resource created successfully.",
      resource: newResource,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

//11. Add Question to Resource API
exports.addQuestionToResource = async (req, res) => {
  try {
    const { resourceId, title, link, difficulty, platform } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided." });
    }

    const allowedRoles = ["COREMEMBER", "VICEPRESIDENT", "PRESIDENT", "ADMIN"];
    const authResult = await verifyAndAuthorize(token, allowedRoles);

    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    // Validate difficulty level
    const validDifficulties = ["EASY", "MEDIUM", "HARD"];
    if (!validDifficulties.includes(difficulty.toUpperCase())) {
      return res.status(400).json({ message: "Invalid difficulty level." });
    }

    // Validate platform (case-insensitive) & normalize it
    const validPlatforms = [
      "LeetCode",
      "CodeChef",
      "Codeforces",
      "GeeksforGeeks",
    ];
    const normalizedPlatform = validPlatforms.find(
      (p) => p.toUpperCase() === platform.toUpperCase()
    );

    if (!normalizedPlatform) {
      return res.status(400).json({ message: "Invalid platform." });
    }

    // Find the resource
    const resource = await Resources.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found." });
    }

    // Add platform if not already in the resource's platform list
    if (!resource.platform.includes(platform)) {
      resource.platform.push(platform);
    }

    // Add the new question
    resource.questions.push({ title, link, difficulty, platform });

    // Update last updated time
    resource.createdAt = new Date();

    // Save the updated resource
    await resource.save();

    return res
      .status(200)
      .json({ message: "Question added successfully.", resource });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

//12. Delete Question from Resource API
exports.deleteQuestionFromResource = async (req, res) => {
  try {
    const { resourceId, questionId } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided." });
    }

    const allowedRoles = ["COREMEMBER", "VICEPRESIDENT", "PRESIDENT", "ADMIN"];
    const authResult = await verifyAndAuthorize(token, allowedRoles);

    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    // Find the resource
    const resource = await Resources.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found." });
    }

    // Find the question index
    const questionIndex = resource.questions.findIndex(
      (q) => q._id.toString() === questionId
    );
    if (questionIndex === -1) {
      return res
        .status(404)
        .json({ message: "Question not found in the resource." });
    }

    // Get the platform of the question being deleted
    const questionPlatform = resource.questions[questionIndex].platform;

    // Remove the question from the array
    resource.questions.splice(questionIndex, 1);

    // Check if there are any remaining questions with the same platform
    const isPlatformStillUsed = resource.questions.some(
      (q) => q.platform === questionPlatform
    );

    // If no other question belongs to this platform, remove the platform from the resource
    if (!isPlatformStillUsed) {
      resource.platform = resource.platform.filter(
        (p) => p !== questionPlatform
      );
    }

    // Update last updated time
    resource.createdAt = new Date();

    // Save the updated resource
    await resource.save();

    return res
      .status(200)
      .json({ message: "Question deleted successfully.", resource });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

//13. Delete Resource API
exports.deleteResource = async (req, res) => {
  try {
    const { resourceId } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided." });
    }

    const allowedRoles = ["COREMEMBER", "VICEPRESIDENT", "PRESIDENT", "ADMIN"];
    const authResult = await verifyAndAuthorize(token, allowedRoles);

    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    // Find and delete the resource
    const resource = await Resources.findByIdAndDelete(resourceId);

    if (!resource) {
      return res.status(404).json({ message: "Resource not found." });
    }

    return res.status(200).json({ message: "Resource deleted successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

//14. Edit Resource API
exports.editResource = async (req, res) => {
  try {
    const { resourceId, title, description } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided." });
    }

    const allowedRoles = ["COREMEMBER", "VICEPRESIDENT", "PRESIDENT", "ADMIN"];
    const authResult = await verifyAndAuthorize(token, allowedRoles);

    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    // Find and update the resource
    const updatedResource = await Resources.findByIdAndUpdate(
      resourceId,
      { title, description, createdAt: new Date() }, // Update createdAt timestamp
      { new: true, runValidators: true }
    );

    if (!updatedResource) {
      return res.status(404).json({ message: "Resource not found." });
    }

    return res.status(200).json({
      message: "Resource updated successfully.",
      resource: updatedResource,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

//15. Fetch All Resources API
exports.fetchAllResources = async (req, res) => {
  try {
    // Extract token and validate
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const allowedRoles = [
      "USER",
      "MEMBER",
      "COREMEMBER",
      "VICEPRESIDENT",
      "PRESIDENT",
      "ADMIN",
    ];
    const authResult = await verifyAndAuthorize(token, allowedRoles);
    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    // Extract query params (page and search)
    let { page = 1, search = "" } = req.body;
    page = parseInt(page, 10);
    const limit = 6; // Fixed limit

    const searchFilter = search ? { title: new RegExp(search, "i") } : {}; // Case-insensitive search

    const skip = (page - 1) * limit;

    // Fetch resources and total count concurrently
    const [resources, totalResources] = await Promise.all([
      Resources.find(searchFilter).skip(skip).limit(limit).lean(), // Optimized query performance
      Resources.countDocuments(searchFilter),
    ]);

    // Transform response data
    const formattedResources = resources.map((resource) => ({
      id: resource._id,
      title: resource.title,
      description: resource.description,
      platforms: resource.platform || [],
      totalQuestions: resource.questions.length,
      lastUpdatedAt: resource.createdAt, // Same as createdAt
    }));

    return res.status(200).json({
      message: "Resources fetched successfully!",
      data: formattedResources,
      totalPages: Math.ceil(totalResources / limit),
      currentPage: page,
      limit,
    });
  } catch (error) {
    console.error("Error fetching resources:", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

//16. Fetch All Questions of a Resource API with Filtering
exports.fetchAllQuestionsOfResource = async (req, res) => {
  try {
    // Extract token and validate
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const allowedRoles = [
      "USER",
      "MEMBER",
      "COREMEMBER",
      "VICEPRESIDENT",
      "PRESIDENT",
      "ADMIN",
    ];
    const authResult = await verifyAndAuthorize(token, allowedRoles);
    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    // Extract parameters
    const { resourceId, difficulty, platform } = req.body;
    if (!resourceId) {
      return res.status(400).json({ message: "Resource ID is required." });
    }

    // Find the resource
    const resource = await Resources.findById(resourceId).lean();
    if (!resource) {
      return res.status(404).json({ message: "Resource not found." });
    }

    // Apply filtering
    let filteredQuestions = resource.questions;

    if (difficulty && difficulty.toLowerCase() !== "all") {
      filteredQuestions = filteredQuestions.filter(
        (q) => q.difficulty.toUpperCase() === difficulty.toUpperCase()
      );
    }

    if (platform && platform.toLowerCase() !== "all") {
      filteredQuestions = filteredQuestions.filter(
        (q) => q.platform.toUpperCase() === platform.toUpperCase()
      );
    }

    // Format response
    const formattedQuestions = filteredQuestions.map((q) => ({
      id: q._id, // Add question ID
      questionTitle: q.title,
      difficulty: q.difficulty,
      platform: q.platform,
      link: q.link,
    }));

    // Return resource info along with questions
    return res.status(200).json({
      message: "Questions fetched successfully!",
      resourceInfo: {
        id: resource._id,
        title: resource.title,
        description: resource.description,
        platforms: resource.platform || [],
        lastModifiedAt: resource.updatedAt || resource.createdAt,
        totalQuestions: resource.questions.length,
      },
      questions: formattedQuestions,
      totalQuestions: formattedQuestions.length,
    });
  } catch (error) {
    console.error("Error fetching questions:", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
//************************************************************************ */

//*************************** Announcement API ******************************** */

//17. Create Announcement API
exports.createAnnouncement = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const { title, description, date, time, links } = req.body;

    // Verify and authorize user roles
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
    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required." });
    }

    // Validate links array
    let formattedLinks = [];
    if (Array.isArray(links)) {
      formattedLinks = links.filter(
        (linkObj) => linkObj.link && linkObj.linkText
      );
    }

    // Create announcement
    const newAnnouncement = new Announcement({
      title,
      description,
      date: date ? new Date(date) : new Date(), // Default to current date if not provided
      time,
      links: formattedLinks,
    });

    await newAnnouncement.save();

    // Get the subscribed users' emails based on the compulsory role
    const recipients = await getSubscribedUsers("ALL", true);

    // Send email notification
    const subject = "Official Announcement";
    const message = `
            <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Official Announcement</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border-radius: 10px;
          }
          .header {
            text-align: center;
            padding: 20px;
          }
          .header img {
            height: 80px;
          }
          .content {
            padding: 20px;
            text-align: left;
          }
          .content h2 {
            color: #00895e;
            text-align: center;
          }
          .content p {
            color: #555;
            line-height: 1.5;
          }
          .footer {
            text-align: center;
            padding: 20px;
            background-color: #f8f8f8;
            font-size: 14px;
            color: #666;
          }
          .footer a {
            color: #00895e;
            text-decoration: none;
            font-weight: bold;
          }
          .social-icons {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-top: 10px;
          }
          .social-icons img {
            width: 24px;
            height: 24px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img
              src="https://res.cloudinary.com/du1b2thra/image/upload/v1739372825/dyq9xw2oatp9rjthimf4.png"
              alt="GFG SRM RMP"
            />
          </div>

          <div class="content">
            <h2>Official Announcement</h2>
            <p>Dear user,</p>
            <p>We are writing to inform you about an important announcement:</p>

            <h3 style="color: #00895e">${title}</h3>
            <p>${description}</p>

            <p>
              For more details and updates regarding this announcement, please visit
              our official website:
            </p>
            <p style="text-align: center">
              <a
                href="https://gfgsc-management-website-srm-ist-ramapuram-testing.vercel.app/"
                style="
                  background-color: #00895e;
                  color: #ffffff;
                  padding: 10px 20px;
                  border-radius: 5px;
                  text-decoration: none;
                  display: inline-block;
                "
                >Visit Our Website</a
              >
            </p>
          </div>

          <div class="footer">
            <p>Join our ever-growing community!</p>
            <div class="social-icons">
              <a href="https://www.instagram.com/geeksforgeeks_srm_rmp/"
                ><img
                  src="https://res.cloudinary.com/du1b2thra/image/upload/v1739607885/wudcidksorrlsc43i0hn.png"
                  alt="Instagram"
              /></a>
              <a href="https://www.linkedin.com/company/geeksforgeeks-srm-rmp"
                ><img
                  src="https://res.cloudinary.com/du1b2thra/image/upload/v1739608002/lpdxsqycyrszaufpfrap.png"
                  alt="LinkedIn"
              /></a>
              <a href="https://x.com/GFG_SRM_RMP"
                ><img
                  src="https://res.cloudinary.com/du1b2thra/image/upload/v1739608105/dnbjvcdmxstrj9yhoy7e.png"
                  alt="Twitter/X"
              /></a>
              <a href="https://gfgsrmrmp.vercel.app/"
                ><img
                  src="https://res.cloudinary.com/du1b2thra/image/upload/v1739608156/iorqcssxpnwvgftktnkt.png"
                  alt="Website"
              /></a>
            </div>
           <div class="footer-bottom" style="height: 200px; overflow: hidden;">
                          <div>Queries? We're just one email away: <span style="color: #00895e;">geeksforgeeks.srmistrmp@gmail.com</span> </div>
                          <div>© 2025 GFG Student Chapter. All rights reserved.</div>
                      </div>
          </div>
        </div>
      </body>
    </html>
    `;
    await sendEmail(recipients, subject, message);

    // Delay for 5 seconds before sending the next email
    await new Promise((resolve) => setTimeout(resolve, 5000));

    return res.status(200).json({
      message: "Announcement created successfully.",
      data: newAnnouncement,
    });
  } catch (error) {
    console.error("Error creating announcement:", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//18. Delete Announcement API
exports.deleteAnnouncement = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const { announcementId } = req.body;

    // Verify and authorize user roles
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

    // Find and delete the announcement
    const deletedAnnouncement = await Announcement.findByIdAndDelete(
      announcementId
    );

    if (!deletedAnnouncement) {
      return res.status(404).json({ message: "Announcement not found." });
    }

    return res.status(200).json({
      message: "Announcement deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting announcement:", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// 19. Get Announcement API
exports.fetchAllAnnouncement = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Verify the auth token
    const authResult = await verifyAuthToken(token);
    if (authResult.status !== "not expired") {
      return res.status(400).json({ message: authResult.message });
    }

    // Fetch all announcements
    const announcements = await Announcement.find().sort({
      date: -1,
      time: -1,
    });

    return res.status(200).json({
      message: "Announcements fetched successfully",
      data: announcements,
    });
  } catch (error) {
    console.error("Error fetching Announcement: ", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
//**************************************************************************** */

//*************************** Video Resource API ******************************** */

//21. Create a video resource API
exports.createVideoResource = async (req, res) => {
  try {
    const { title, description } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided." });
    }

    const allowedRoles = ["COREMEMBER", "VICEPRESIDENT", "PRESIDENT", "ADMIN"];
    const authResult = await verifyAndAuthorize(token, allowedRoles);

    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    const newVideoResource = new VideoResources({
      title,
      description,
    });

    await newVideoResource.save();

    return res.status(200).json({
      message: "Video Resource created successfully!",
      resource: newVideoResource,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

//22. Add a video to a video resource API
exports.addVideoToVideoResource = async (req, res) => {
  try {
    const { vidoeResourceId, title, description, link } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided." });
    }

    const allowedRoles = ["COREMEMBER", "VICEPRESIDENT", "PRESIDENT", "ADMIN"];
    const authResult = await verifyAndAuthorize(token, allowedRoles);

    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    // Find the resource
    const videoResource = await VideoResources.findById(vidoeResourceId);
    if (!videoResource) {
      return res.status(404).json({ message: "Vido Resource not found!" });
    }

    // Add the new question
    videoResource.videos.push({ title, description, link });

    // Update last updated time
    videoResource.createdAt = new Date();

    // Save the updated resource
    await videoResource.save();

    return res
      .status(200)
      .json({ message: "Video added successfully!", videoResource });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

//23. Delete a video of a video resource API
exports.deleteVideoFromVideoResource = async (req, res) => {
  try {
    const { videoResourceId, videoId } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided." });
    }

    const allowedRoles = ["COREMEMBER", "VICEPRESIDENT", "PRESIDENT", "ADMIN"];
    const authResult = await verifyAndAuthorize(token, allowedRoles);

    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    // Find the resource
    const videoResource = await VideoResources.findById(videoResourceId);
    if (!videoResource) {
      return res.status(404).json({ message: "Video Resource not found!" });
    }

    // Find the video index
    const videoIndex = videoResource.videos.findIndex(
      (q) => q._id.toString() === videoId
    );
    if (videoIndex === -1) {
      return res
        .status(404)
        .json({ message: "Video not found in the video resource!" });
    }

    // Remove the video from the array
    videoResource.videos.splice(videoIndex, 1);

    // Update last updated time
    videoResource.createdAt = new Date();

    // Save the updated resource
    await videoResource.save();

    return res
      .status(200)
      .json({ message: "Video deleted successfully!", videoResource });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

//24. Delete a video resource API
exports.deleteVideoResource = async (req, res) => {
  try {
    const { videoResourceId } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided." });
    }

    const allowedRoles = ["COREMEMBER", "VICEPRESIDENT", "PRESIDENT", "ADMIN"];
    const authResult = await verifyAndAuthorize(token, allowedRoles);

    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    // Find and delete the resource
    const videoResource = await VideoResources.findByIdAndDelete(
      videoResourceId
    );

    if (!videoResource) {
      return res.status(404).json({ message: "Video Resource not found!" });
    }

    return res
      .status(200)
      .json({ message: "Video Resource deleted successfully!" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

//25. Edit a video resource API
exports.editVideoResource = async (req, res) => {
  try {
    const { videoResourceId, title, description } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided." });
    }

    const allowedRoles = ["COREMEMBER", "VICEPRESIDENT", "PRESIDENT", "ADMIN"];
    const authResult = await verifyAndAuthorize(token, allowedRoles);

    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    // Find and update the video resource
    const updatedVideoResource = await VideoResources.findByIdAndUpdate(
      videoResourceId,
      { title, description, createdAt: new Date() }, // Update createdAt timestamp
      { new: true, runValidators: true }
    );

    if (!updatedVideoResource) {
      return res.status(404).json({ message: "Video Resource not found!" });
    }

    return res.status(200).json({
      message: "Video Resource updated successfully!",
      resource: updatedVideoResource,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

//26. Fetch all video resource API
exports.fetchAllVideoResources = async (req, res) => {
  try {
    // Extract token and validate
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const allowedRoles = [
      "USER",
      "MEMBER",
      "COREMEMBER",
      "VICEPRESIDENT",
      "PRESIDENT",
      "ADMIN",
    ];
    const authResult = await verifyAndAuthorize(token, allowedRoles);
    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    // Extract query params (page and search)
    let { page = 1, search = "" } = req.body;
    page = parseInt(page, 10);
    const limit = 6; // Fixed limit

    const searchFilter = search ? { title: new RegExp(search, "i") } : {}; // Case-insensitive search

    const skip = (page - 1) * limit;

    // Fetch resources and total count concurrently
    const [resources, totalResources] = await Promise.all([
      VideoResources.find(searchFilter).skip(skip).limit(limit).lean(), // Optimized query performance
      VideoResources.countDocuments(searchFilter),
    ]);

    // Transform response data
    const formattedVideoResources = resources.map((resource) => ({
      id: resource._id,
      title: resource.title,
      description: resource.description,
      totalVideos: resource.videos.length,
      lastUpdatedAt: resource.createdAt, // Same as createdAt
    }));

    return res.status(200).json({
      message: "Video Resources fetched successfully!",
      data: formattedVideoResources,
      totalPages: Math.ceil(totalResources / limit),
      currentPage: page,
      limit,
    });
  } catch (error) {
    console.error("Error fetching resources:", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

//27. Fetch all videos of a video resource API
exports.fetchAllVideosOfVideoResource = async (req, res) => {
  try {
    // Extract token and validate
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const allowedRoles = [
      "USER",
      "MEMBER",
      "COREMEMBER",
      "VICEPRESIDENT",
      "PRESIDENT",
      "ADMIN",
    ];
    const authResult = await verifyAndAuthorize(token, allowedRoles);
    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    // Extract parameters
    const { videoResourceId } = req.body;
    //console.log(videoResourceId);
    if (!videoResourceId) {
      return res
        .status(400)
        .json({ message: "Video Resource ID is required!" });
    }

    // Find the resource
    const videoResource = await VideoResources.findById(videoResourceId).lean();
    if (!videoResource) {
      return res.status(404).json({ message: "Video Resource not found!" });
    }

    // Apply filtering
    let filteredVideos = videoResource.videos;

    // Format response
    const formattedVideos = filteredVideos.map((q) => ({
      id: q._id, // Add question ID
      videoTitle: q.title,
      videoDescription: q.description,
      videoLink: q.link,
    }));

    // Return resource info along with questions
    return res.status(200).json({
      message: "Videos fetched successfully!",
      resourceInfo: {
        id: videoResource._id,
        title: videoResource.title,
        description: videoResource.description,
        lastModifiedAt: videoResource.updatedAt || videoResource.createdAt,
        totalVideos: videoResource.videos.length,
      },
      videos: formattedVideos,
      totalVideos: formattedVideos.length,
    });
  } catch (error) {
    console.error("Error fetching questions:", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

//****************************************************************************** */
