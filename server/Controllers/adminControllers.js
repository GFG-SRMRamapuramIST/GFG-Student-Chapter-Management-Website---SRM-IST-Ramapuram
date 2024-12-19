const chalk = require("chalk");
const nodemailer = require("nodemailer");
const csv = require("csvtojson");
const crypto = require("crypto");

const { Users, AllowedEmail, BlockedEmails } = require("../Models");
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

        // Generate a random 8-character OTP
        const OTP = crypto.randomBytes(4).toString("hex");

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
        // Generate a random 8-character OTP
        const OTP = crypto.randomBytes(4).toString("hex");

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