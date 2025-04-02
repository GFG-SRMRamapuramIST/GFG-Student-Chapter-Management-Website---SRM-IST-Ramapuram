const chalk = require("chalk");
const nodemailer = require("nodemailer");
const { createObjectCsvWriter } = require("csv-writer");
const fs = require("fs");
const path = require("path");

require("dotenv").config();

const { sendEmail } = require("../../Utilities");

const { Users } = require("../../Models");

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Function to send email with CSV
async function sendEmailWithCSV(csvFilePath) {
  try {
    const mailOptions = {
      from: process.env.EMAIL,
      to: process.env.EMAIL,
      subject: "Monthly Backup Data",
      text: "Attached is the monthly backup data of Users of GFGSC IST Ramapuram Management Website in CSV format.",
      attachments: [
        {
          filename: "backup-data.csv",
          path: csvFilePath,
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log(chalk.green("Email sent with backup data."));
  } catch (error) {
    console.error(chalk.red("Error sending email:"), error.message);
  }
}

// Backup function to generate CSV and send email
async function backUpData() {
  console.log(chalk.blue("Running backup function..."));

  const csvFilePath = path.join(__dirname, "backup-data.csv");

  try {
    // Fetch all users
    const users = await Users.find();

    // Prepare backup data
    const backups = users.map((user) => ({
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      academicYear: user.academicYear,
      role: user.role,
      codolioProfileLink: user.codolioUsername
        ? `https://codolio.com/profile/${user.codolioUsername}`
        : "N/A",
      rank: user.currentRank ?? "N/A",
      totalQuestionsSolved: user.totalQuestionSolved,
      avgPerDay: user.avgPerDay,
      maxStreak: user.maxStreak,
    }));

    // Generate CSV file
    const csvWriter = createObjectCsvWriter({
      path: csvFilePath,
      header: [
        { id: "name", title: "Name" },
        { id: "email", title: "Email" },
        { id: "phoneNumber", title: "Phone Number" },
        { id: "academicYear", title: "Academic Year" },
        { id: "role", title: "Role" },
        { id: "codolioProfileLink", title: "Codolio Profile Link" },
        { id: "rank", title: "Rank" },
        { id: "totalQuestionsSolved", title: "Total Points" },
        { id: "avgPerDay", title: "Avg Per Day" },
        { id: "maxStreak", title: "Max Streak" },
      ],
    });

    await csvWriter.writeRecords(backups);
    console.log(chalk.green("CSV file with Backup Data created successfully."));

    // Send email with the CSV file
    await sendEmailWithCSV(csvFilePath);
  } catch (error) {
    console.error(chalk.red("Error during backup function:"), error.message);
    await sendEmail(
      "geeksforgeeks.srmistrmp@gmail.com",
      "Monthly Back-Up Data Function Error",
      `The monthly back-up data function failed with the following error: ${error.message}`
    );
  } finally {
    // Delete the CSV file after sending
    if (fs.existsSync(csvFilePath)) {
      fs.unlinkSync(csvFilePath);
      console.log(chalk.green("Temporary CSV file deleted."));
    }
  }
}

module.exports = backUpData;
