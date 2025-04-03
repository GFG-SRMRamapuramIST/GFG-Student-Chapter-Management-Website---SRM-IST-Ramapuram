const axios = require("axios");
const chalk = require("chalk");

const { sendEmail } = require("../../../Utilities");

require("dotenv").config();

const ADMIN_EMAIL = process.env.EMAIL;
const CODECHEF_API_URL = `${process.env.CODECHEF_API_URL}/api/contest-data/`;

/**
 * Fetches the total number of questions solved by a user in a specific CodeChef contest.
 * @param {string} username - CodeChef username.
 * @param {string} contestName - The name of the contest.
 * @returns {Promise<{ totalQuestionsSolved: number } | null>} - Contest data or null if not found.
 */
const fetchCodeChefContestData = async (username, contestName) => {
  try {
    const response = await axios.post(`${CODECHEF_API_URL}${username}`, {
      contestName,
    });
    const { data } = response;

    if (data && data.contestFound) {
      return {
        totalQuestionsSolved: data.totalQuestionsSolved || 0,
      };
    } else {
      console.log(
        chalk.yellow(`No contest data found for ${username} in ${contestName}`)
      );
      return null;
    }
  } catch (error) {
    console.error(
      chalk.red(
        `Error fetching CodeChef contest data for ${username} in ${contestName}:`
      ),
      error.message
    );

    const subject = `CodeChef Contest Data Fetching Failed`;
    const message = `
      <p>Dear Admin,</p>
      <p>Failed to fetch CodeChef contest data for <b>${username}</b> in <b>${contestName}</b>.</p>
      <p>Error Message: <b>${error.message}</b></p>
      <p>Please investigate the issue.</p>
      <p>Regards,<br/>GeeksForGeeks Student Chapter SRM IST Ramapuram Automated System</p>
    `;

    await sendEmail(ADMIN_EMAIL, subject, message);
    console.log(
      chalk.bgRed(
        `Admin notified about CodeChef contest data fetch failure for ${username} in ${contestName}`
      )
    );

    // Delay for 3 seconds before sending the next email
    await new Promise((resolve) => setTimeout(resolve, 3000));

    return null;
  }
};

module.exports = { fetchCodeChefContestData };
