const fs = require("fs");
const chalk = require("chalk");
const csv = require("csvtojson");

const {
  Users,
  AllowedEmail,
  BlockedEmails,
  ConstantValue,
} = require("../Models");
const { verifyAuthToken, sendEmail } = require("../Utilities");

const {
  updateLeaderboardRankings,
} = require("../Scheduler/CodingPlatformScheduler/LeaderBoardSorting");

/*
************************** APIs **************************

1. Add Emails using CSV file to register API
2. Add array of Emails to register API
3. Fetch all allowed emails API
4. Fetch all users API
5. Delete emails from AllowedEmail schema API
6. Block email/user from website API
7. Unblock email/user from website API
8. Delete Users from website API
9. Promote user one rank above API
10. Demote user one rank below API

11. Update team size API
12. Create team API
13. Delete team API
14. Edit team name API

15. Edit Constant Values API
16. Fetch Constant Values API

17. Reset achievement API

18. Toggle user's protected status
19. Update user's total solved questions

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

//1. Add Emails using CSV file to register API
exports.uploadCSVAllowedEmails = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const authResult = await verifyAndAuthorize(token, ["ADMIN"]);
    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const userEmails = [];
    const addedEmails = [];
    const skippedEmails = [];

    // Parse CSV file
    const csvData = await csv().fromFile(req.file.path);
    for (const row of csvData) {
      if (row.Email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.Email)) {
        userEmails.push(row.Email.trim());
      }
    }

    // Process emails
    for (const email of userEmails) {
      try {
        // Check if email exists in Users or AllowedEmail schema
        const existingEntry =
          (await Users.findOne({ email })) ||
          (await AllowedEmail.findOne({ email }));

        if (existingEntry) {
          skippedEmails.push(email);
          continue;
        }

        // Generate a random 6-digit OTP
        const OTP = Math.floor(100000 + Math.random() * 900000).toString();
        const subject =
          "Welcome to GeeksForGeeks Student Chapter SRM IST Ramapuram!";
        const message = `Hi ${email}, <br> Welcome to GeeksForGeeks Student Chapter SRM IST Ramapuram! Your OTP is ${OTP}. You can use this OTP to register to our website and access all the features. <br> Regards, <br> GFG SRM RMP Team`;

        await sendEmail(email, subject, message);
        console.log(chalk.bgGreen.bold.green("Email sent to: "), email);

        // Store email and OTP in AllowedEmail schema only if email is sent successfully
        await AllowedEmail.create({ email, OTP, createdAt: new Date() });
        addedEmails.push(email);

        console.log(chalk.bgGreen.bold.green("Email sent to: "), email);

        // Delay for 10 seconds before sending the next email
        await new Promise((resolve) => setTimeout(resolve, 10000));
      } catch (error) {
        console.error(
          chalk.bgRed.bold.red("Error processing email: "),
          email,
          error.message
        );
        skippedEmails.push(email);
      }
    }

    // Cleanup: Delete the uploaded CSV file after processing
    fs.unlinkSync(req.file.path);

    return res.status(200).json({
      message: "Emails processed successfully",
      addedCount: addedEmails.length,
      skippedCount: skippedEmails.length,
      addedEmails,
      skippedEmails,
    });
  } catch (error) {
    console.error(
      chalk.bgRed.bold.red("Error processing CSV: "),
      error.message
    );
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//2. Add array of Emails to register API
exports.addAllowedEmails = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Taking token from the header
  const { emails } = req.body; // Array of emails from the admin

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  if (!Array.isArray(emails) || emails.length === 0) {
    return res
      .status(400)
      .json({ message: "No emails provided or invalid input" });
  }

  try {
    // Use the helper function for authorization
    const authResult = await verifyAndAuthorize(token, ["ADMIN"]);
    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    const addedEmails = [];
    const skippedEmails = [];

    for (const email of emails) {
      // Check if the email is already registered
      const existingUser = await Users.findOne({ email });

      if (existingUser) {
        skippedEmails.push(email);
        continue;
      }

      const alreadyAllowed = await AllowedEmail.findOne({ email });
      if (!alreadyAllowed) {
        // Generate a random 6 digit OTP
        const OTP = Math.floor(100000 + Math.random() * 900000).toString();
        const subject =
          "Welcome to GeeksForGeeks Student Chapter SRM IST Ramapuram!";
        const message = `Hi ${email}, <br> Welcome to GeeksForGeeks Student Chapter SRM IST Ramapuram! Your OTP is ${OTP}. You can use this OTP to register to our website and access all the features. <br> Regards, <br> GFG SRM RMP Team`;

        try {
          // Add the email and OTP to the allowedEmail collection only after successful email
          await AllowedEmail.create({ email, OTP, createdAt: new Date() });
          addedEmails.push(email);

          await sendEmail(email, subject, message);
          console.log(chalk.bgGreen.bold.green("Email sent to: "), email);

          // Delay for 10 seconds before sending the next email
          await new Promise((resolve) => setTimeout(resolve, 10000));
        } catch (error) {
          console.error(
            chalk.bgRed.bold.red("Error sending email to: "),
            email,
            error
          );
          skippedEmails.push(email);
        }
      } else {
        skippedEmails.push(email);
      }
    }

    return res.status(200).json({
      message: "Emails processed successfully",
      addedCount: addedEmails.length,
      skippedCount: skippedEmails.length,
      addedEmails,
      skippedEmails,
    });
  } catch (error) {
    console.error(
      chalk.bgRed.bold.red("Error processing emails: "),
      error.message
    );
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//3. Fetch all allowed emails API
exports.fetchAllowedEmails = async (req, res) => {
  try {
    // Extract token and validate
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const authResult = await verifyAndAuthorize(token, ["ADMIN"]);
    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    // Extract query params with default values
    let { page = 1, limit = 10, search = "", sortOrder = 1 } = req.body;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    sortOrder = parseInt(sortOrder, 10);

    const searchFilter = search ? { email: new RegExp(search, "i") } : {};
    const skip = (page - 1) * limit;

    // Fetch emails and total count concurrently
    const [allowedEmails, totalEmails] = await Promise.all([
      AllowedEmail.find(searchFilter)
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(), // Optimized query performance
      AllowedEmail.countDocuments(searchFilter),
    ]);

    return res.status(200).json({
      message: "Allowed emails fetched successfully!",
      data: allowedEmails,
      totalPages: Math.ceil(totalEmails / limit),
      currentPage: page,
      limit,
      sortOrder,
    });
  } catch (error) {
    console.error("Error fetching allowed emails:", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

//4. Fetach all users API
exports.fetchAllUsers = async (req, res) => {
  try {
    // Extract token and validate
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const authResult = await verifyAndAuthorize(token, ["ADMIN"]);
    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    // Extract query params with default values
    let {
      page = 1,
      limit = 10,
      search = "",
      sortOrder = 1,
      roles = [],
      protected: isProtected,
    } = req.body;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    sortOrder = parseInt(sortOrder, 10);

    const searchFilter = search
      ? {
          $or: [
            { name: new RegExp(search, "i") },
            { email: new RegExp(search, "i") },
          ],
        }
      : {};

    const roleFilter =
      Array.isArray(roles) && roles.length > 0 ? { role: { $in: roles } } : {};

    const protectedFilter =
      typeof isProtected === "boolean" ? { protected: isProtected } : {};

    const finalFilter = {
      ...searchFilter,
      ...roleFilter,
      ...protectedFilter,
    };

    const skip = (page - 1) * limit;

    // Fetch users and total count simultaneously
    const [users, totalUsers] = await Promise.all([
      Users.find(finalFilter)
        .sort({ name: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      Users.countDocuments(finalFilter),
    ]);

    return res.status(200).json({
      message: "Filtered users fetched successfully!",
      data: users,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
      limit,
      sortOrder,
    });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

//5. Delete email from AllowedEmail schema API
exports.deleteAllowedEmail = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header
    const { userId } = req.body; // Single userId to delete

    // Validate input
    if (!userId) {
      return res.status(400).json({ message: "Invalid or missing userId" });
    }

    // Use the helper function for authorization
    const authResult = await verifyAndAuthorize(token, ["ADMIN"]);
    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    // Delete the specified userId
    const deletionResult = await AllowedEmail.deleteOne({ _id: userId });

    if (deletionResult.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "User not found or already deleted" });
    }

    // Respond with success
    return res.status(200).json({
      message: "Email deleted successfully!",
      deletedCount: deletionResult.deletedCount,
    });
  } catch (error) {
    console.error(
      chalk.bgRed.bold.red("Error deleting allowed email:"),
      error.message
    );
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

//6. Block email/user from website API
exports.blockEmail = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from header
  const { email } = req.body; // Email to be blocked

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  if (!email) {
    return res.status(400).json({ message: "No email provided" });
  }

  try {
    // Verify and authorize token
    const authResult = await verifyAndAuthorize(token, ["ADMIN"]);
    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    // Check if the email is already blocked
    const existingBlockedEmail = await BlockedEmails.findOne({ email });
    if (existingBlockedEmail) {
      return res.status(400).json({ message: "Email is already blocked" });
    }

    // Remove email from AllowedEmails if it exists
    const removedFromAllowed = await AllowedEmail.deleteOne({ email });
    if (removedFromAllowed.deletedCount > 0) {
      console.log(
        chalk.bgYellow.bold.yellow(`Email removed from AllowedEmails: ${email}`)
      );
    }

    // Remove email from Users if it exists
    const removedFromUsers = await Users.deleteOne({ email });
    if (removedFromUsers.deletedCount > 0) {
      console.log(
        chalk.bgYellow.bold.yellow(`Email removed from Users: ${email}`)
      );
    }

    // Add email to the BlockedEmails collection
    await BlockedEmails.create({ email });

    // Respond with success
    res.status(200).json({ message: "Email blocked successfully" });
  } catch (error) {
    console.error(chalk.bgRed.bold.red("Error blocking email:"), error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//7. Unblock email/user from website API
exports.unblockEmail = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from header
  const { email } = req.body; // Email to be unblocked

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  if (!email) {
    return res.status(400).json({ message: "No email provided" });
  }

  try {
    // Verify and authorize token
    const authResult = await verifyAndAuthorize(token, ["ADMIN"]);
    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    // Check if the email is blocked
    const existingBlockedEmail = await BlockedEmails.findOne({ email });
    if (!existingBlockedEmail) {
      return res.status(400).json({ message: "Email is not blocked" });
    }

    // Remove email from the BlockedEmails collection
    await BlockedEmails.deleteOne({ email });

    // Respond with success
    res.status(200).json({ message: "Email unblocked successfully" });
  } catch (error) {
    console.error(
      chalk.bgRed.bold.red("Error unblocking email:"),
      error.message
    );
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//8. Delete Users from website API
exports.deleteUser = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from header
  const { userId } = req.body; // Single userId to delete

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    // Verify and authorize token
    const authResult = await verifyAndAuthorize(token, ["ADMIN"]);
    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    // Extract admin's user ID from the token
    const adminUserId = authResult.userId.toString();

    // Prevent admin from deleting themselves
    if (userId.toString() === adminUserId) {
      return res
        .status(400)
        .json({ message: "You cannot delete your own account." });
    }

    // Fetch user before deletion
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Delete the user
    const deletionResult = await Users.deleteOne({ _id: userId });

    if (deletionResult.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "User not found or already deleted." });
    }

    // Send email notification
    const subject = "Account Deletion Notification";
    const message = `Hi ${user.name}, <br> We regret to inform you that your account has been permanently deleted. This action has been taken as per our policies and guidelines. You will no longer have access to your account or its associated data. <br> Regards, <br> GFG SRM RMP Team`;
    await sendEmail(user.email, subject, message);

    await updateLeaderboardRankings();

    return res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//9. Promote user one rank above API
exports.promoteUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const { userId } = req.body;

    if (!token) return res.status(401).json({ message: "No token provided" });
    if (!userId)
      return res.status(400).json({ message: "No user ID provided" });

    // Verify and authorize token
    const authResult = await verifyAndAuthorize(token, ["ADMIN"]);
    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    if (authResult.userId.toString() === userId.toString()) {
      return res.status(400).json({ message: "Cannot promote yourself" });
    }

    // Find the user
    const user = await Users.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Define the promotion hierarchy
    const promotionMap = {
      USER: "MEMBER",
      MEMBER: "COREMEMBER",
      COREMEMBER: "VICEPRESIDENT",
      VICEPRESIDENT: "PRESIDENT",
      PRESIDENT: "ADMIN",
    };

    if (!promotionMap[user.role]) {
      return res
        .status(400)
        .json({ message: "User is already at the highest rank" });
    }

    // Promote the user
    user.role = promotionMap[user.role];

    // If the user is promoted to ADMIN, set `protected` to true
    if (user.role === "ADMIN") {
      user.protected = true;
    }

    await user.save();

    return res
      .status(200)
      .json({ message: `User promoted successfully to ${user.role}` });
  } catch (error) {
    console.error(chalk.bgRed.bold.red("Error promoting user:"), error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//10. Demote user one rank below API
exports.demoteUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const { userId } = req.body;

    if (!token) return res.status(401).json({ message: "No token provided" });
    if (!userId)
      return res.status(400).json({ message: "No user ID provided" });

    // Verify and authorize token
    const authResult = await verifyAndAuthorize(token, ["ADMIN"]);
    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    if (authResult.userId.toString() === userId.toString()) {
      return res.status(400).json({ message: "Cannot demote yourself" });
    }

    // Find the user
    const user = await Users.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Define the demotion hierarchy
    const demotionMap = {
      ADMIN: "PRESIDENT",
      PRESIDENT: "VICEPRESIDENT",
      VICEPRESIDENT: "COREMEMBER",
      COREMEMBER: "MEMBER",
      MEMBER: "USER",
    };

    if (!demotionMap[user.role]) {
      return res
        .status(400)
        .json({ message: "User is already at the lowest rank" });
    }

    // If the user is currently an ADMIN, and being demoted, set `protected` to false
    if (user.role === "ADMIN") {
      user.protected = false;
    }

    // Demote the user
    user.role = demotionMap[user.role];
    await user.save();

    return res
      .status(200)
      .json({ message: `User demoted successfully to ${user.role}` });
  } catch (error) {
    console.error(chalk.bgRed.bold.red("Error demoting user:"), error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//15. Edit constant values API
exports.editConstantValues = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from header
  const {
    achievementScheduler,
    backupDataScheduler,
    resetDataScheduler,
    autoKickScheduler,
    passingMarks,
  } = req.body; // New constant values

  // Check for token
  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  // Validate input
  if (
    achievementScheduler === null &&
    backupDataScheduler === null &&
    resetDataScheduler === null &&
    autoKickScheduler === null &&
    passingMarks === null
  ) {
    return res
      .status(400)
      .json({ message: "Invalid constant values provided" });
  }

  try {
    // Verify and authorize token
    const authResult = await verifyAndAuthorize(token, ["ADMIN"]);
    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    // Find the ConstantValue document
    const constant = await ConstantValue.findOne();

    if (!constant) {
      return res.status(500).json({
        message: "ConstantValue document not found. Please initialize it.",
      });
    }

    // Update the constant values
    constant.achievementScheduler = achievementScheduler;
    constant.backupDataScheduler = backupDataScheduler;
    constant.resetDataScheduler = resetDataScheduler;
    constant.autoKickScheduler = autoKickScheduler;
    constant.passingMarks = passingMarks;
    await constant.save();

    // Send success response
    return res.status(200).json({ message: "Constants updated successfully!" });
  } catch (error) {
    console.error("Error updating constants:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//16. Get constant values API
exports.getConstantValues = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  try {
    // Verify and authorize token
    const authResult = await verifyAndAuthorize(token, ["ADMIN"]);
    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    // Find the ConstantValue document
    const constant = await ConstantValue.findOne();

    if (!constant) {
      return res.status(500).json({
        message: "ConstantValue document not found. Please initialize it.",
      });
    }

    return res.status(200).json({ constant });
  } catch (error) {
    console.error("Error fetching constants:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//17. Reset achievements API
exports.resetAchievements = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  // Check for token
  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  try {
    // Verify and authorize token
    const authResult = await verifyAndAuthorize(token, ["ADMIN"]);
    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    await Users.updateMany(
      {},
      {
        $set: {
          achievement: { gold: [], silver: [], bronze: [] },
        },
      }
    );

    res.status(200).json({ message: "Achievements reset successfully" });
  } catch (error) {
    console.error("Error reseting achievement:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//18. Toggle user's protected status
exports.toggleProtected = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const { userId } = req.body;

    // Validate input
    if (!token) return res.status(401).json({ message: "No token provided" });
    if (!userId)
      return res.status(400).json({ message: "No user ID provided" });

    // Verify and authorize token
    const authResult = await verifyAndAuthorize(token, ["ADMIN"]);
    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    // Find the user
    const user = await Users.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if the user has the role of ADMIN
    if (user.role === "ADMIN") {
      return res.status(500).json({
        message:
          "ADMINs are always protected and cannot have their protected status set to false",
      });
    }

    // Toggle the `protected` value
    user.protected = !user.protected;
    await user.save();

    return res.status(200).json({
      message: `User's protected status toggled successfully`,
      protected: user.protected,
    });
  } catch (error) {
    console.error("Error toggling protected status:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//19. Update user's total solved questions
exports.updateQuestionCount = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const { userId, delta } = req.body;

    // Validate input
    if (!token) return res.status(401).json({ message: "No token provided" });
    if (!userId || delta === undefined) {
      return res.status(400).json({ 
        message: "Missing required fields: userId or delta" 
      });
    }
    if (typeof delta !== "number" || !Number.isInteger(delta)) {
      return res.status(400).json({ 
        message: "Delta must be an integer value" 
      });
    }

    // Verify and authorize token
    const authResult = await verifyAndAuthorize(token, ["ADMIN"]);
    if (authResult.status !== 200) {
      return res.status(authResult.status)
                .json({ message: authResult.message });
    }

    // Find and update user
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Calculate new value with floor at 0
    const newTotal = Math.max(user.totalQuestionSolved + delta, 0);
    
    // Update only if changed
    if (newTotal !== user.totalQuestionSolved) {
      user.totalQuestionSolved = newTotal;
      await user.save();
    }

    return res.status(200).json({
      message: "Points updated successfully!",
      // totalQuestionSolved: user.totalQuestionSolved,
      // previousCount: user.totalQuestionSolved - delta,
      // deltaApplied: delta
    });
    
  } catch (error) {
    console.error("Error updating question count:", error.message);
    return res.status(500).json({ 
      message: "Internal server error", 
      error: error.message 
    });
  }
};

/************************** APIs For Teams **************************

//11. Update team size API
exports.updateTeamSize = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from header
  const { teamSize } = req.body; // New team size

  // Check for token
  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  // Validate teamSize
  if (!teamSize || typeof teamSize !== "number" || teamSize < 1) {
    return res.status(400).json({ message: "Invalid team size provided" });
  }

  try {
    // Verify and authorize token
    const authResult = await verifyAndAuthorize(token, ["ADMIN"]);
    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    // Find the ConstantValue document
    const constant = await ConstantValue.findOne();

    if (!constant) {
      return res.status(500).json({
        message: "ConstantValue document not found. Please initialize it.",
      });
    }

    // Update the teamSize attribute
    constant.teamSize = teamSize;
    await constant.save();

    // Send success response
    return res.status(200).json({ message: "Team size updated successfully" });
  } catch (error) {
    console.error("Error updating team size:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//12. Create team API
exports.createTeam = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from header
  const { teamName } = req.body; // Team name

  // Check for token
  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  // Validate teamName
  if (!teamName || typeof teamName !== "string" || teamName.trim() === "") {
    return res.status(400).json({ message: "Invalid team name provided" });
  }

  try {
    // Verify and authorize token
    const authResult = await verifyAndAuthorize(token, ["ADMIN"]);
    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    // Create the team
    await Teams.create({ teamName });

    // Send success response
    return res.status(200).json({ message: "Team created successfully" });
  } catch (error) {
    console.error(chalk.bgRed.bold.red("Error creating team:"), error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//13. Delete team API
exports.deleteTeam = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from header
  const { teamId } = req.body; // Team ID

  // Check for token
  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  // Validate teamId
  if (!teamId || typeof teamId !== "string" || teamId.trim() === "") {
    return res.status(400).json({ message: "Invalid team ID provided" });
  }

  try {
    // Verify and authorize token
    const authResult = await verifyAndAuthorize(token, ["ADMIN"]);
    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    // Find the team
    const team = await Teams.findById(teamId);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // If team has members, update their teamId to null
    if (team.teamMembers.length > 0) {
      await Users.updateMany(
        { _id: { $in: team.teamMembers } }, // Match user IDs in teamMembers
        { $set: { teamId: null } } // Set teamId to null
      );
      console.log(chalk.green("Updated teamId to null for team members."));
    }

    // Delete the team
    await team.delete();

    // Send success response
    return res.status(200).json({ message: "Team deleted successfully" });
  } catch (error) {
    console.error(chalk.bgRed.bold.red("Error deleting team:"), error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//14. Edit team name API
exports.editTeamName = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from header
  const { teamId, teamName } = req.body; // Team ID and new team name

  // Check for token
  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  // Validate teamId and teamName
  if (
    !teamId ||
    typeof teamId !== "string" ||
    teamId.trim() === "" ||
    !teamName ||
    typeof teamName !== "string" ||
    teamName.trim() === ""
  ) {
    return res
      .status(400)
      .json({ message: "Invalid team ID or name provided" });
  }

  try {
    // Verify and authorize token
    const authResult = await verifyAndAuthorize(token, ["ADMIN"]);
    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    // Find the team
    const team = await Teams.findById(teamId);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Update the team name
    team.teamName = teamName;
    await team.save();

    // Send success response
    return res.status(200).json({ message: "Team name updated successfully" });
  } catch (error) {
    console.error(
      chalk.bgRed.bold.red("Error updating team name:"),
      error.message
    );
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

********************************************************************/
