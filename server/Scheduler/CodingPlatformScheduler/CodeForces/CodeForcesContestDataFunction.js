const axios = require("axios");
const chalk = require("chalk");

const { sendEmail } = require("../../../Utilities");

require("dotenv").config();

const ADMIN_EMAIL = process.env.EMAIL;
const CODEFORCES_API_URL = `${process.env.CODEFORCES_API_URL}/api/contest-info/`;

/**
 * Extracts contest ID from contest name.
 * @param {string} contestName - The contest name (e.g., "Codeforces Round 1006 - 2072").
 * @returns {number} - Extracted contest ID.
 */
const extractContestId = (contestName) => {
  const match = contestName.match(/- (\d+)$/);
  return match ? parseInt(match[1], 10) : null;
};

/**
 * Fetches contest data for a user from Codeforces.
 * @param {string} username - Codeforces username.
 * @param {string} contestName - The name of the contest.
 * @param {string} email - User's email.
 * @returns {Promise<{ totalQuestionsSolved: number } | null>} - Contest data or null if not found.
 */
const fetchCodeforcesContestData = async (username, contestName, email) => {
  try {
    const contestId = extractContestId(contestName);

    const response = await axios.post(`${CODEFORCES_API_URL}${username}`, {
      contest_id: contestId,
    });

    const { data } = response;

    // Check if the API returned an error message
    if (data && data.data?.error) {
      console.log(chalk.red(`Error from API: ${data.data.error}`));

      const subject = `Codeforces Username Verification Required`;
      const message = `
        <p>Dear ${email},</p>
        <p>We encountered an issue while fetching your Codeforces contest data for <b>${contestName}</b>. It seems there might be an error with your provided username: <b>${username}</b>.</p>
        <p>Please verify your Codeforces username and update it if necessary.</p>
        <p>If this issue persists, please contact support.</p>
        <p>Regards,<br/>GeeksForGeeks Student Chapter SRM IST Ramapuram Automated System</p>
      `;

      await sendEmail([email, ADMIN_EMAIL], subject, message);
      console.log(
        chalk.bgRed(
          `Email sent to ${email} and admin for username verification.`
        )
      );

      // Delay for 3 seconds before sending the next email
      await new Promise((resolve) => setTimeout(resolve, 3000));

      return null;
    }

    if (data && data.data?.participated) {
      return {
        totalQuestionsSolved: data.data.solved_count || 0,
      };
    } else {
      console.log(
        chalk.yellow(`User ${username} did not participate in ${contestName}.`)
      );
      return null;
    }
  } catch (error) {
    console.error(
      chalk.red(`Error fetching Codeforces contest data for ${username}:`),
      error.message
    );

    // const subject = `Codeforces Contest Data Fetching Failed`;
    // const message = `
    //   <p>Dear Admin,</p>
    //   <p>Failed to fetch Codeforces contest data for <b>${username}</b> in <b>${contestName}</b>.</p>
    //   <p>Error Message: <b>${error.message}</b></p>
    //   <p>Please investigate the issue.</p>
    //   <p>Regards,<br/>GeeksForGeeks Student Chapter SRM IST Ramapuram Automated System</p>
    // `;

    // await sendEmail(ADMIN_EMAIL, subject, message);
    // console.log(
    //   chalk.bgRed(
    //     `Admin notified about Codeforces contest data fetch failure for ${username}`
    //   )
    // );

    return null;
  }
};

module.exports = { fetchCodeforcesContestData };
