const cron = require("node-cron");
const axios = require("axios");
const chalk = require("chalk");

const { Users } = require("../Models");

const { sendEmail } = require("../Utilities");

//! Not to reveal the email address of the admin and the codechef api url
const ADMIN_EMAIL = "geeksforgeeks.srmistrmp@gmail.com";
const CODECHEF_API_URL = "https://codechef-api-9jml.onrender.com/api/info/";

const updateCodechefDetails = async () => {
  console.log(chalk.bgBlue.bold("Running CodeChef data update..."));

  try {
    const users = await Users.find(
      { codechefUsername: { $ne: null } }, // Fetch users with a CodeChef username
      { codechefUsername: 1, email: 1 } // Fetch relevant fields
    );

    for (const user of users) {
      const username = user.codechefUsername;
      try {
        const response = await axios.get(`${CODECHEF_API_URL}${username}`);

        if (response.data && response.data.Rating) {
          // Extract numeric rating from "2★"
          const numericRating =
            parseInt(response.data.Rating.replace(/[^0-9]/g, ""), 10) || 0;

          await Users.updateOne(
            { _id: user._id },
            {
              $set: {
                "platforms.codechef.rating": numericRating,
                "platforms.codechef.highestRating":
                  Number(response.data.Rating_Details?.Highest_Rating) || 0,
                "platforms.codechef.countryRank":
                  Number(response.data.Rating_Details?.Country_Rank) || 0,
              },
            }
          );

          console.log(chalk.green(`Updated CodeChef details for ${username}`));
        } else {
          console.log(chalk.yellow(`No valid data for ${username}`));

          //todo Send proper email notification to admin
          const subject = `CodeChef Data Not Found for ${username}`;
          const message = `
            <p>Dear Admin,</p>
            <p>No valid CodeChef data was found for the user <b>${username}</b>.</p>
            <p>User Email: ${user.email || "N/A"}</p>
            <p>Please check if the username is correct.</p>
            <p>Regards,</p>
            <p>Automated System</p>
          `;

          await sendEmail(ADMIN_EMAIL, subject, message);
          console.log(
            chalk.bgRed(`Email sent to admin for missing data of ${username}`)
          );
        }
      } catch (err) {
        console.error(
          chalk.red(`Error fetching data for ${username}:`),
          err.message
        );
      }
    }
  } catch (error) {
    console.error(
      chalk.bgRed.bold("Error updating CodeChef details:"),
      error.message
    );

    //todo Notify admin if scheduler fails through proper email
    const subject = `Scheduler Failure Alert`;
    const message = `
      <p>Dear Admin,</p>
      <p>The CodeChef data update scheduler failed to run due to an error.</p>
      <p>Error Message: <b>${error.message}</b></p>
      <p>Please investigate the issue.</p>
      <p>Regards,</p>
      <p>Automated System</p>
    `;

    await sendEmail(ADMIN_EMAIL, subject, message);
    console.log(chalk.bgRed(`Admin notified about scheduler failure`));
  }

  console.log(chalk.bgGreen.bold("CodeChef data update completed."));
};

//* Scheduler that runs every Sunday at 11:59 PM
cron.schedule("59 23 * * 0", updateCodechefDetails);

console.log(
  chalk.bgMagenta.bold("Scheduler initialized for CodeChef updates.")
);

module.exports = { updateCodechefDetails };
