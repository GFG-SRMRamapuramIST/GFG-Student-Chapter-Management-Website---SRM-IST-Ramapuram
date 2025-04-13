const chalk = require("chalk");

const sendEmail = require("../../Utilities/sendEmail");

const { Users } = require("../../Models");

const autoKickFunction = async (passingMarks) => {
  console.log(chalk.bgBlue.bold("Running Auto Kick Function."));

  try {
    console.log(chalk.yellow.bold(`Minimum Passing Marks: ${passingMarks}`));

    // Find users who did not meet the minimum passing marks
    const usersToDelete = await Users.find({
      totalQuestionSolved: { $lt: passingMarks },
      role: { $ne: "ADMIN" },
      protected: { $ne: true },
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
      totalQuestionSolved: { $lt: passingMarks },
    });
    console.log(
      chalk.bgRed.bold(`${deleteResult.deletedCount} users have been removed.`)
    );

    // Send email notifications
    if (emailRecipients.length) {
      const subject = "Account Removal Notification";
      const message = `Hi user, <br> We regret to inform you that your account has been permanently deleted. This action has been taken cause you where not able to pass the minimum passing criteria set on our website. You will no longer have access to your account or its associated data. <br> Regards, <br> GFG SRM RMP Team`;

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
