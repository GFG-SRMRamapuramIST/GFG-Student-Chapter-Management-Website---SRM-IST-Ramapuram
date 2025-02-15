const nodemailer = require("nodemailer");
const chalk = require("chalk");

// Configuration for nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "geeksforgeeks.srmistrmp@gmail.com",
    pass: "fgvh olam gxvk ilds", // Use environment variables in production
  },
});

const sendEmail = async (recipients, subject, message) => {
  try {
    // Mail options
    const mailOptions = {
      from: "geeksforgeeks.srmistrmp@gmail.com", // Sender's email address
      to: recipients, // Comma-separated list of recipients
      subject, // Email subject
      html: message, // HTML form to message
    };

    // Send email
    await transporter.sendMail(mailOptions);

    console.log(chalk.green("Email sent successfully to subscribed users."));
  } catch (error) {
    console.error(chalk.bgRed.bold("Error sending email:"), error.message);
    throw new Error("Failed to send email.");
  }
};

module.exports = sendEmail;
