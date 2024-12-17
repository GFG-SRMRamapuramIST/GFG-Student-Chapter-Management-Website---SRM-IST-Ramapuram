const chalk = require("chalk");
const nodemailer = require("nodemailer");
const csv = require("csvtojson");

const { Users, AllowedEmail } = require("../Models");
const { verifyAuthToken } = require("../Utilities");

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "vitcseguide@gmail.com",
    pass: "gvdt kqqs zzvr vfib", // Use environment variables in production
  },
});

// Add Emails using CSV file to register API
exports.uploadCSVAllowedEmails = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from header

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Verify the admin token
    const authResult = await verifyAuthToken(token);

    if (authResult.status === "expired") {
      return res.status(401).json({ message: "Token expired" });
    }

    if (authResult.status === "invalid" || authResult.role !== "ADMIN") {
      return res.status(403).json({ message: "Access denied" });
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

        // Send an email invitation
        const mailOptions = {
          from: "vitcseguide@gmail.com",
          to: email,
          subject: "Invitation to Register",
          text: `You have been invited to register on our website. Please use your email (${email}) to create an account.`,
        };

        await transporter.sendMail(mailOptions);

        // Add the email to AllowedEmail schema only if email is sent successfully
        await AllowedEmail.create({ email, createdAt: new Date() });
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

// Add array of Emails to register API
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
    // Verify the admin token
    const authResult = await verifyAuthToken(token);

    if (authResult.status === "expired") {
      return res.status(401).json({ message: "Token expired" });
    }

    if (authResult.status === "invalid" || authResult.role !== "ADMIN") {
      return res.status(403).json({ message: "Access denied" });
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
        // Send an email invitation
        const mailOptions = {
          from: "vitcseguide@gmail.com",
          to: email,
          subject: "Invitation to Register",
          text: `You have been invited to register on our website. Please use your email (${email}) to create an account.`,
        };

        try {
          await transporter.sendMail(mailOptions);
          console.log(chalk.bgGreen.bold.green("Email sent to: "), email);

          // Add the email to the allowedEmail collection only after successful email
          await AllowedEmail.create({ email, createdAt: new Date() });
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
