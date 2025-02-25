const axios = require("axios");
const chalk = require("chalk");

const { sendEmail } = require("../../../Utilities");

require("dotenv").config();

const ADMIN_EMAIL = process.env.EMAIL;
const LEETCODE_API_URL = `${process.env.LEETCODE_API_URL}/api/contest-info/`;

/**
 * Fetches contest data for a user from LeetCode.
 * @param {string} username - LeetCode username.
 * @param {string} contestName - The name of the contest.
 * @param {string} email - User's email.
 * @returns {Promise<{ solvedCount: number } | null>} - Contest data or null if not found.
 */
const fetchLeetCodeContestData = async (username, contestName, email) => {
  try {
    const response = await axios.post(`${LEETCODE_API_URL}${username}`, {
      contest_name: contestName,
    });
    const { data } = response;

    if (data && data.data) {
      if (data.data.error) {
        console.log(chalk.yellow(`Invalid username: ${username}`));

        const subject = `LeetCode Contest Data Not Found for ${username}`;
        const message = `
          <p>Dear ${email},</p>
          <p>We couldn't retrieve valid LeetCode contest data for your profile (${username}). Please verify your LeetCode username and ensure it is correctly entered.</p>
          <p>If this issue persists, please contact support.</p>
          <p>Regards,<br/>GeeksForGeeks Student Chapter SRM IST Ramapuram Automated System</p>
        `;

        await sendEmail([email, ADMIN_EMAIL], subject, message);
        console.log(
          chalk.bgRed(
            `Email sent to ${email} and admin for invalid LeetCode username.`
          )
        );

        return null;
      }

      if (data.data.participated) {
        return {
          totalQuestionsSolved: data.data.solved_count || 0,
        };
      } else {
        console.log(
          chalk.yellow(
            `User ${username} did not participate in ${contestName}.`
          )
        );
        return null;
      }
    } else {
      console.log(
        chalk.yellow(`No contest data found for ${username} in ${contestName}`)
      );
      return null;
    }
  } catch (error) {
    console.error(
      chalk.red(`Error fetching LeetCode contest data for ${username}:`),
      error.message
    );

    const subject = `LeetCode Contest Data Fetching Failed`;
    const message = `
      <p>Dear Admin,</p>
      <p>Failed to fetch LeetCode contest data for <b>${username}</b> in <b>${contestName}</b>.</p>
      <p>Error Message: <b>${error.message}</b></p>
      <p>Please investigate the issue.</p>
      <p>Regards,<br/>GeeksForGeeks Student Chapter SRM IST Ramapuram Automated System</p>
    `;

    await sendEmail(ADMIN_EMAIL, subject, message);
    console.log(
      chalk.bgRed(
        `Admin notified about LeetCode contest data fetch failure for ${username}`
      )
    );

    return null;
  }
};

module.exports = { fetchLeetCodeContestData };
