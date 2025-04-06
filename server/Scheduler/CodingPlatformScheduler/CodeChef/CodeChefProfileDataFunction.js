const axios = require("axios");
const chalk = require("chalk");

const { sendEmail } = require("../../../Utilities");

require("dotenv").config();

const ADMIN_EMAIL = process.env.EMAIL;
const CODECHEF_API_URL = `${process.env.CODECHEF_API_URL}/api/info/`;

const fetchCodechefDetails = async (username, email) => {
  //console.log(chalk.bgBlue.bold(`Fetching CodeChef data for ${username}...`));

  try {
    const response = await axios.get(`${CODECHEF_API_URL}${username}`);
    const { data } = response;

    if (data && data.Rating) {
      const numericRating =
        parseInt(data.Rating.replace(/[^0-9]/g, ""), 10) || 0;

      return {
        rating: numericRating,
        highestRating: Number(data.Rating_Details?.Highest_Rating) || 0,
        countryRank: Number(data.Rating_Details?.Country_Rank) || 0,
      };
    } else {
      console.log(chalk.yellow(`No valid data found for ${username}`));

      const subject = `CodeChef Profile Data Not Found for ${username}`;
      const message = `
        <p>Dear ${email},</p>
        <p>We couldn't find valid CodeChef data for your profile (${username}). Please verify your CodeChef username and ensure that your CodeChef profile name is correctly entered.</p>
        <p>If this issue persists, contact support.</p>
        <p>Regards,<br/>GeeksForGeeks Student Chapter SRM IST Ramapuram Automated System</p>
      `;

      await sendEmail([email, ADMIN_EMAIL], subject, message);
      console.log(
        chalk.bgRed(`Email sent to ${email} and admin for missing data.`)
      );

      // Delay for 3 seconds before sending the next email
      await new Promise((resolve) => setTimeout(resolve, 3000));

      return null;
    }
  } catch (error) {
    console.error(
      chalk.red(`Error fetching codechef data for ${username}:`),
      error.message
    );

    // const subject = `CodeChef Data Fetching Failed`;
    // const message = `
    //   <p>Dear Admin,</p>
    //   <p>Failed to fetch CodeChef data for <b>${username}</b>.</p>
    //   <p>Error Message: <b>${error.message}</b></p>
    //   <p>Please investigate the issue.</p>
    //   <p>Regards,<br/>GeeksForGeeks Student Chapter SRM IST Ramapuram Automated System</p>
    // `;

    // await sendEmail(ADMIN_EMAIL, subject, message);
    // console.log(
    //   chalk.bgRed(
    //     `Admin notified about CodeChef data fetch failure for ${username}`
    //   )
    // );

    return null;
  }
};

module.exports = { fetchCodechefDetails };
