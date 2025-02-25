const nodemailer = require("nodemailer");
const chalk = require("chalk");

require("dotenv").config();

// Configuration for nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async (recipients, subject, message) => {
  try {
    // Mail options
    const mailOptions = {
      from: process.env.EMAIL, // Sender's email address
      to: recipients, // Comma-separated list of recipients
      subject, // Email subject
      html: message, // HTML form to message
    };

    // Send email
    await transporter.sendMail(mailOptions);

    console.log(chalk.green("Email sent successfully."));
  } catch (error) {
    console.error(chalk.bgRed.bold("Error sending email:"), error.message);
    throw new Error("Failed to send email.");
  }
};

module.exports = sendEmail;
