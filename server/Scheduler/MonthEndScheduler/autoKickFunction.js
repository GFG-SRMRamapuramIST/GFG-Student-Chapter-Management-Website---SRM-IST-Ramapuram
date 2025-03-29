const chalk = require("chalk");

const sendEmail = require("../../Utilities/sendEmail");

const { Users } = require("../../Models");

const autoKickFunction = async (
  passingPercentage,
  perDayPracticePoint,
  perContestPoint
) => {
  console.log(chalk.bgBlue.bold("Running Auto Kick Function."));

  try {
    // Calculate minimum passing marks
    const minPassingMarks = Math.floor(
      (30 * perDayPracticePoint + 4 * perContestPoint) /
        (passingPercentage / 100)
    );

    console.log(chalk.yellow.bold(`Minimum Passing Marks: ${minPassingMarks}`));

    // Find users who did not meet the minimum passing marks
    const usersToDelete = await Users.find({
      totalQuestionSolved: { $lt: minPassingMarks },
    });

    if (!usersToDelete.length) {
      console.log(
        chalk.bgGreen.bold(
          "No users to delete. All users meet the passing criteria."
        )
      );
      return;
    }

    // Collect email addresses of users being removed
    const emailRecipients = usersToDelete.map((user) => user.email);

    // Delete the users
    const deleteResult = await Users.deleteMany({
      totalQuestionSolved: { $lt: minPassingMarks },
    });
    console.log(
      chalk.bgRed.bold(`${deleteResult.deletedCount} users have been removed.`)
    );

    // Send email notifications
    if (emailRecipients.length) {
      const subject = "Account Removal Notification";
      const message = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
    />

    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #b3e6d4;
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
        background-color: white;
        border-radius: 10px;
        color: white;
        padding: 0;
        overflow: hidden;
      }
      .header h1 {
        margin: 0;
      }
      .content {
        padding: 20px;
        padding-top: 0px;
        text-align: center;
      }
      .content p {
        color: #555555;
        text-align: justify;
        line-height: 1.4;
        word-break: break-word;
      }

      .footer {
        text-align: center;
        padding: 10px;
        color: #777777;
      }
      .footer a {
        color: #007bff;
        text-decoration: none;
      }

      .header img {
        height: 100px;
        width: 400px;
      }

      /* Footer Styling */
      .footer-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 40px 20px;
        padding-top: 5px;
        text-align: center;
        font-family: Arial, sans-serif;
        background-color: #f8f8f8;
      }

      .footer-logo {
        width: 120px;
        margin-bottom: 30px;
      }

      .community-text {
        font-size: 16px;
        color: #666;
        margin-bottom: 20px;
      }

      .social-icons {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin-bottom: 20px;
      }
      .social-icons i {
        font-size: 32px;
        color: #666;
        transition: transform 0.2s;
      }
      .social-icons i:hover {
        transform: scale(1.1);
        color: #00895e;
      }

      .footer-bottom {
        height: 100px;

        padding-top: 10px;
        border-top: 1px solid #eee;
        color: #666;
        font-size: 14px;
        overflow: hidden;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img
          src="https://res.cloudinary.com/du1b2thra/image/upload/v1739372825/dyq9xw2oatp9rjthimf4.png"
        />
      </div>
      <div class="content">
        <h2 style="color: #d10000">Account Deletion Notification</h2>

        <h3 style="text-align: left">
          Hi <span style="color: #d10000">user</span>,
        </h3>
        <p>
          We regret to inform you that your account has been
          <span style="background-color: #f5b3b3; font-weight: bold"
            >permanently deleted</span
          >.
        </p>
        <p>
          This action has been taken as you
          <span style="background-color: #f5b3b3; font-weight: bold"
            >did not meet the minimum participation criteria</span
          >. You will no longer have access to your account or its associated
          data.
        </p>
        <p>If you have any concerns, please reach out to support team.</p>
      </div>

      <!-- Footer Section -->
      <footer class="footer-container" style="height: 100px; overflow: hidden">
        <div class="community-text">
          Join our evergrowing unstoppable community
        </div>
        <div class="social-icons">
          <a href="https://www.instagram.com/geeksforgeeks_srm_rmp/"
            ><img
              width="24"
              height="24"
              src="https://res.cloudinary.com/du1b2thra/image/upload/v1739607885/wudcidksorrlsc43i0hn.png"
              alt="instagram-new--v1"
          /></a>
          <a href="https://www.linkedin.com/company/geeksforgeeks-srm-rmp"
            ><img
              width="24"
              height="24"
              src="https://res.cloudinary.com/du1b2thra/image/upload/v1739608002/lpdxsqycyrszaufpfrap.png"
              alt="linkedin"
          /></a>
          <a href="https://x.com/GFG_SRM_RMP"
            ><img
              width="24"
              height="24"
              src="https://res.cloudinary.com/du1b2thra/image/upload/v1739608105/dnbjvcdmxstrj9yhoy7e.png"
              alt="twitterx--v2"
          /></a>
          <a href="https://gfgsrmrmp.vercel.app/"
            ><img
              width="24"
              height="24"
              src="https://res.cloudinary.com/du1b2thra/image/upload/v1739608156/iorqcssxpnwvgftktnkt.png"
              alt="domain"
          /></a>
        </div>
        <div class="footer-bottom" style="height: 200px; overflow: hidden">
          <div>
            Queries? We're just one email away:
            <span style="color: #00895e"
              >geeksforgeeks.srmistrmp@gmail.com</span
            >
          </div>
          <div>© 2025 GFG Student Chapter. All rights reserved.</div>
        </div>
      </footer>
    </div>
  </body>
</html>
`;
      await sendEmail(emailRecipients.join(","), subject, message);
      console.log(chalk.bgYellow.bold("Emails sent to removed users."));
    }
  } catch (error) {
    console.error(
      chalk.bgRed.bold("Error in Auto Kick Function:"),
      error.message
    );
  }
};

module.exports = autoKickFunction;
