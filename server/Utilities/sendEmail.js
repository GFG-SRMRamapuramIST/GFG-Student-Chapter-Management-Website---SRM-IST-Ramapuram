const nodemailer = require("nodemailer");
const chalk = require("chalk");

// Configuration for nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail", // Replace with your email service (e.g., Outlook, Yahoo)
  auth: {
    user: "vitcseguide@gmail.com",
    pass: "gvdt kqqs zzvr vfib", // Use environment variables in production
  },
});

const sendEmail = async (recipients, subject, message) => {
  try {
    // Mail options
    const mailOptions = {
      from: "vitcseguide@gmail.com", // Sender's email address
      to: recipients, // Comma-separated list of recipients
      subject, // Email subject
      text: message, // Plain text body
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
