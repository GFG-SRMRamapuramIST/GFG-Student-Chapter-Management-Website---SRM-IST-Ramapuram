const axios = require("axios");
const chalk = require("chalk");

const { sendEmail } = require("../../../Utilities");

require("dotenv").config();

const ADMIN_EMAIL = process.env.EMAIL;
const CODEFORCES_API_URL = `${process.env.CODEFORCES_API_URL}/api/user-info/`;

const fetchCodeforcesDetails = async (username, email) => {
  try {
    const response = await axios.get(`${CODEFORCES_API_URL}${username}`);
    const { data } = response;

    if (data && data.data) {
      return {
        rating: data.data.current_rating || 0,
        rank: data.data.rank || "unrated",
        totalProblemSolved: data.data.total_solved || 0,
      };
    } else {
      console.log(chalk.yellow(`No valid data found for ${username}`));

      const subject = `Codeforces Profile Data Not Found for ${username}`;
      const message = `
        <p>Dear ${email},</p>
        <p>We couldn't find valid Codeforces data for your profile (${username}). Please verify your Codeforces username and ensure that your Codeforces profile name is correctly entered.</p>
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
      chalk.red(`Error fetching data for ${username}:`),
      error.message
    );

    // const subject = `Codeforces Data Fetching Failed`;
    // const message = `
    //   <p>Dear Admin,</p>
    //   <p>Failed to fetch Codeforces data for <b>${username}</b>.</p>
    //   <p>Error Message: <b>${error.message}</b></p>
    //   <p>Please investigate the issue.</p>
    //   <p>Regards,<br/>GeeksForGeeks Student Chapter SRM IST Ramapuram Automated System</p>
    // `;

    // await sendEmail(ADMIN_EMAIL, subject, message);
    // console.log(
    //   chalk.bgRed(
    //     `Admin notified about Codeforces data fetch failure for ${username}`
    //   )
    // );

    return null;
  }
};

module.exports = { fetchCodeforcesDetails };
