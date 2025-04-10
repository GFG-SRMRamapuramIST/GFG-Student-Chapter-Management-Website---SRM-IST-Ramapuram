const axios = require("axios");
const chalk = require("chalk");

const { sendEmail } = require("../../../Utilities");

require("dotenv").config();

const ADMIN_EMAIL = process.env.EMAIL;
const LEETCODE_API_URL = `${process.env.LEETCODE_API_URL}/api/user-info/`;

const fetchLeetcodeDetails = async (username, email) => {
  try {
    const response = await axios.get(`${LEETCODE_API_URL}${username}`);
    const { data, status } = response.data;
    if (status === "success" && data) {
      return {
        badgesCount: data.badges_count || 0,
        ranking: data.ranking || 0,
        totalProblemSolved: data.problems_by_difficulty.All || 0,
      };
    } else {
      console.log(chalk.yellow(`No valid data found for ${username}`));

      const subject = `LeetCode Profile Data Not Found for ${username}`;
      const message = `
        <p>Dear ${email},</p>
        <p>We couldn't find valid LeetCode data for your profile (${username}). Please verify your LeetCode username and ensure that your LeetCode profile name is correctly entered.</p>
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
      chalk.red(`Error fetching leetcode data for ${username}:`),
      error.message
    );

    // const subject = `LeetCode Data Fetching Failed`;
    // const message = `
    //   <p>Dear Admin,</p>
    //   <p>Failed to fetch LeetCode data for <b>${username}</b>.</p>
    //   <p>Error Message: <b>${error.message}</b></p>
    //   <p>Please investigate the issue.</p>
    //   <p>Regards,<br/>GeeksForGeeks Student Chapter SRM IST Ramapuram Automated System</p>
    // `;

    // await sendEmail(ADMIN_EMAIL, subject, message);
    // console.log(
    //   chalk.bgRed(
    //     `Admin notified about LeetCode data fetch failure for ${username}`
    //   )
    // );

    return null;
  }
};

module.exports = { fetchLeetcodeDetails };
