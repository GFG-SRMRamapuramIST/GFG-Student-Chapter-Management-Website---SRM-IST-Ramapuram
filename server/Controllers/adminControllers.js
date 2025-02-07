const chalk = require("chalk");
const nodemailer = require("nodemailer");
const csv = require("csvtojson");
const crypto = require("crypto");

const {
  Users,
  AllowedEmail,
  BlockedEmails,
  ConstantValue,
} = require("../Models");
const { verifyAuthToken } = require("../Utilities");

/*
************************** APIs **************************

1. Add Emails using CSV file to register API
2. Add array of Emails to register API
3. Fetch all allowed emails API
4. Delete emails from AllowedEmail schema API
5. Block email/user from website API
6. Unblock email/user from website API
7. Delete Users from website API
8. Promote user one rank above API
9. Demote user one rank below API
10. Update team size API
11. Create team API
12. Delete team API
13. Edit team name API

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

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "vitcseguide@gmail.com",
    pass: "gvdt kqqs zzvr vfib", // Use environment variables in production
  },
});

//1. Add Emails using CSV file to register API
exports.uploadCSVAllowedEmails = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from header

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Use the helper function for authorization
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
      if (row.Email) {
        userEmails.push(row.Email.trim());
      }
    }

    // Process emails
    for (const email of userEmails) {
      try {
        // Check if the email is already registered
        const existingUser = await Users.findOne({ email });

        if (existingUser) {
          skippedEmails.push(email);
          continue;
        }

        // Check if the email already exists in AllowedEmail schema
        const alreadyAllowed = await AllowedEmail.findOne({ email });
        if (alreadyAllowed) {
          skippedEmails.push(email);
          continue;
        }

        // Generate a random 6 digit OTP
        const OTP = Math.floor(100000 + Math.random() * 900000).toString();

        // Send an email invitation with the OTP
        const mailOptions = {
          from: "vitcseguide@gmail.com",
          to: email,
          subject: "Invitation to Register",
          text: `You have been invited to register on our website. Please use your email (${email}) and the following OTP (${OTP}) to create an account.`,
        };

        await transporter.sendMail(mailOptions);

        // Add the email and OTP to AllowedEmail schema only if email is sent successfully
        await AllowedEmail.create({ email, OTP, createdAt: new Date() });
        addedEmails.push(email);

        console.log(chalk.bgGreen.bold.green("Email sent to: "), email);
      } catch (error) {
        console.error(
          chalk.bgRed.bold.red("Error processing email: "),
          email,
          error.message
        );
        skippedEmails.push(email);
      }
    }

    // Response after processing all emails
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

        // Send an email invitation with the OTP
        const mailOptions = {
          from: "vitcseguide@gmail.com",
          to: email,
          subject: "Invitation to Register",
          text: `You have been invited to register on our website. Please use your email (${email}) and the following OTP (${OTP}) to create an account.`,
        };

        try {
          await transporter.sendMail(mailOptions);
          console.log(chalk.bgGreen.bold.green("Email sent to: "), email);

          // Add the email and OTP to the allowedEmail collection only after successful email
          await AllowedEmail.create({ email, OTP, createdAt: new Date() });
          addedEmails.push(email);
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
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from the Authorization header
    const { page = 1, limit = 10, search = "", sortOrder = 1 } = req.body;

    // Use the helper function for authorization
    const authResult = await verifyAndAuthorize(token, ["ADMIN", "COREMEMBER"]);
    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    // Pagination and search setup
    const skip = (page - 1) * limit;
    const searchFilter = {
      email: new RegExp(search, "i"), // Case-insensitive search on email field
    };

    // Fetch emails with pagination, sorting, and search
    const allowedEmails = await AllowedEmail.find(searchFilter)
      .sort({ createdAt: parseInt(sortOrder, 10) }) // Apply sort first
      .skip(skip) // Skip documents based on the page
      .limit(parseInt(limit, 10)); // Limit the number of documents

    // Count total documents for pagination info
    const totalEmails = await AllowedEmail.countDocuments(searchFilter);

    // Respond with the data
    return res.status(200).json({
      message: "Allowed emails fetched successfully!",
      data: allowedEmails,
      totalPages: Math.ceil(totalEmails / limit),
      currentPage: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sortOrder: parseInt(sortOrder, 10),
    });
  } catch (error) {
    console.error(
      chalk.bgRed.bold.red("Error fetching allowed emails:"),
      error.message
    );
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

//4. Delete emails from AllowedEmail schema API
exports.deleteAllowedEmails = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header
    const { ids } = req.body; // Array of _id to delete

    // Validate input
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Invalid or empty IDs array" });
    }

    // Use the helper function for authorization
    const authResult = await verifyAndAuthorize(token, ["ADMIN", "COREMEMBER"]);
    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    // Delete documents with the provided IDs
    const deletionResult = await AllowedEmail.deleteMany({
      _id: { $in: ids },
    });

    // Respond with the result
    return res.status(200).json({
      message: "Emails deleted successfully!",
      deletedCount: deletionResult.deletedCount,
    });
  } catch (error) {
    console.error(
      chalk.bgRed.bold.red("Error deleting allowed emails:"),
      error.message
    );
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

//5. Block email/user from website API
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

//6. Unblock email/user from website API
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

//7. Delete Users from website API
exports.deleteUsers = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from header
  const { ids } = req.body; // Array of _id to delete

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: "Invalid or empty IDs array" });
  }

  try {
    // Verify and authorize token
    const authResult = await verifyAndAuthorize(token, ["ADMIN"]);
    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    // Extract the admin's user ID from the token
    const adminUserId = authResult.userId;

    // Filter out the admin's own account ID from the delete list
    const idsToDelete = ids.filter((id) => id !== adminUserId);
    const notDeletedIds = ids.filter((id) => id === adminUserId);

    if (idsToDelete.length === 0) {
      return res.status(400).json({
        message:
          "No valid IDs to delete and you cannot delete your own account.",
        notDeletedIds,
      });
    }

    // Attempt to delete the remaining IDs
    const deletionResult = await Users.deleteMany({
      _id: { $in: idsToDelete },
    });

    // Track IDs that were not deleted for any other reason (e.g., invalid ID)
    const failedDeletions = [];

    for (const id of idsToDelete) {
      const exists = await Users.findById(id);
      if (exists) {
        failedDeletions.push(id);
      }
    }
    notDeletedIds.push(...failedDeletions);

    // Respond with the result
    return res.status(200).json({
      message: "Users deletion processed successfully.",
      deletedCount: deletionResult.deletedCount,
      notDeletedIds,
    });
  } catch (error) {
    console.error(chalk.bgRed.bold.red("Error deleting users:"), error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//8. Promote user one rank above API
exports.promoteUser = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from header
  const { userId } = req.body; // User ID to promote

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  if (!userId) {
    return res.status(400).json({ message: "No user ID provided" });
  }

  try {
    // Verify and authorize token
    const authResult = await verifyAndAuthorize(token, ["ADMIN"]);
    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    // User cannot promote himself
    if (authResult.userId === userId) {
      return res.status(400).json({ message: "Cannot promote yourself" });
    }

    // Find the user to promote
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Promote the user
    if (user.role === "MEMBER") {
      user.role = "COREMEMBER";
      await user.save();
      return res.status(200).json({
        message: "User promoted successfully from Member to Core-Member",
      });
    } else if (user.role === "COREMEMBER") {
      user.role = "ADMIN";
      await user.save();
      return res.status(200).json({
        message: "User promoted successfully from Core-Member to Admin",
      });
    } else if (user.role === "USER") {
      user.role = "MEMBER";
      await user.save();
      return res
        .status(200)
        .json({ message: "User promoted successfully from User to Member" });
    }

    return res
      .status(400)
      .json({ message: "User is already at the highest rank" });
  } catch (error) {
    console.error(chalk.bgRed.bold.red("Error promoting user:"), error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//9. Demote user one rank below API
exports.demoteUser = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from header
  const { userId } = req.body; // User ID to demote

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  if (!userId) {
    return res.status(400).json({ message: "No user ID provided" });
  }

  try {
    // Verify and authorize token
    const authResult = await verifyAndAuthorize(token, ["ADMIN"]);
    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    // User cannot demote himself
    if (authResult.userId === userId) {
      return res.status(400).json({ message: "Cannot demote yourself" });
    }

    // Find the user to demote
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Demote the user
    if (user.role === "ADMIN") {
      user.role = "COREMEMBER";
      await user.save();
      return res.status(200).json({
        message: "User demoted successfully from Admin to Core-Member",
      });
    } else if (user.role === "COREMEMBER") {
      user.role = "MEMBER";
      await user.save();
      return res.status(200).json({
        message: "User demoted successfully from Core-Member to Member",
      });
    } else if (user.role === "MEMBER") {
      user.role = "USER";
      await user.save();
      return res
        .status(200)
        .json({ message: "User demoted successfully from Member to User" });
    }

    return res
      .status(400)
      .json({ message: "User is already at the lowest rank" });
  } catch (error) {
    console.error(chalk.bgRed.bold.red("Error demoting user:"), error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//************************** APIs For Teams **************************

//10. Update team size API
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
      return res
        .status(500)
        .json({
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

//11. Create team API
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

//12. Delete team API
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

//13. Edit team name API
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
    return res.status(400).json({ message: "Invalid team ID or name provided" });
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
    console.error(chalk.bgRed.bold.red("Error updating team name:"), error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//********************************************************************
