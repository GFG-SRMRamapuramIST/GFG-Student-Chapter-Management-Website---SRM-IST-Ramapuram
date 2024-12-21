const cron = require("node-cron");
const chalk = require("chalk");
const nodemailer = require("nodemailer");
const { createObjectCsvWriter } = require("csv-writer");
const fs = require("fs");
const path = require("path");

const { Users } = require("../Models");

// Functions to get the second last date of the month
function getSecondLastDateOfMonth() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  // Get the last day of the current month
  const lastDay = new Date(year, month + 1, 0);

  // Subtract 1 day to get the second last date
  const secondLastDay = new Date(lastDay);
  secondLastDay.setDate(lastDay.getDate() - 1);

  console.log(secondLastDay);
  return secondLastDay;
}

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "vitcseguide@gmail.com",
    pass: "gvdt kqqs zzvr vfib", // Use environment variables in production
  },
});

// Function to send email with CSV
async function sendEmailWithCSV(csvFilePath) {
  try {
    const mailOptions = {
      from: "vitcseguide@gmail.com",
      to: "ay1442@srmist.edu.in", // Sending to the admin
      subject: "Monthly Backup Data",
      text: "Attached is the monthly backup data in CSV format.",
      attachments: [
        {
          filename: "backup-data.csv",
          path: csvFilePath, // Path to the CSV file
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log(chalk.green("Email sent to admin with backup data."));
  } catch (error) {
    console.error(chalk.red("Error sending email:"), error.message);
  }
}

// Schedule to run Data backing-up on the second last date of each month at 00:00
const task = cron.schedule(`34 18 21 * *`, async () => {
  console.log(chalk.blue("Running backup scheduler..."));

  const csvFilePath = path.join(__dirname, "backup-data.csv");

  try {
    // Fetch all users from the Users schema
    const users = await Users.find();

    // Loop through each user and create a backup entry
    const backups = users.map((user) => ({
      name: user.name,
      email: user.email,
      codolioProfileLink: user.codolioProfileLink,
      totalQuestionsSolved: user.totalQuestionsSolved,
      teamId: user.teamId,
      totalContestsParticipated: user.totalContestsParticipated,
    }));

    // Generate CSV from backup data
    const csvWriter = createObjectCsvWriter({
      path: csvFilePath,
      header: [
        { id: "name", title: "Name" },
        { id: "email", title: "Email" },
        { id: "codolioProfileLink", title: "Codolio Profile Link" },
        { id: "totalQuestionsSolved", title: "Total Questions Solved" },
        { id: "teamId", title: "Team ID" },
        {
          id: "totalContestsParticipated",
          title: "Total Contests Participated",
        },
      ],
    });

    await csvWriter.writeRecords(backups);
    console.log(chalk.green("CSV file with Backup Data created successfully."));

    // Send the email with the CSV file
    await sendEmailWithCSV(csvFilePath);
  } catch (error) {
    console.error(chalk.red("Error during backup scheduler:"), error.message);
  } finally {
    // Delete the CSV file after sending the email
    if (fs.existsSync(csvFilePath)) {
      fs.unlinkSync(csvFilePath);
      console.log(chalk.green("Temporary CSV file deleted."));
    }
  }
});

exports.task = task;
