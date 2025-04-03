const axios = require("axios");
const chalk = require("chalk");

const { sendEmail } = require("../../../Utilities");

require("dotenv").config();

const ADMIN_EMAIL = process.env.EMAIL;
const GEEKSFORGEEKS_API_URL = `${process.env.GEEKSFORGEEKS_API_URL}/api/info/`;

const fetchGeeksForGeeksDetails = async (username, email) => {
  try {
    const response = await axios.get(`${GEEKSFORGEEKS_API_URL}${username}`);
    //console.log(response);
    if (response.status == 200) {
      return {
        universityRank: Number(response.data.universityRank) || 0,
        codingScore: Number(response.data.codingScore) || 0,
        problemSolved: Number(response.data.problemsSolved) || 0,
      };
    } else {
      console.log(chalk.yellow(`No valid data found for ${username}`));

      const subject = `GeeksForGeeks Profile Data Not Found for ${username}`;
      const message = `
        <p>Dear ${email},</p>
        <p>We couldn't find valid GeeksForGeeks data for your profile (${username}). Please verify your CodeChef username and ensure that your GeeksForGeeks profile name is correctly entered.</p>
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

    // const subject = `GeeksForGeeks Data Fetching Failed`;
    // const message = `
    //   <p>Dear Admin,</p>
    //   <p>Failed to fetch GeeksForGeeks data for <b>${username}</b>.</p>
    //   <p>Error Message: <b>${error.message}</b></p>
    //   <p>Please investigate the issue.</p>
    //   <p>Regards,<br/>GeeksForGeeks Student Chapter SRM IST Ramapuram Automated System</p>
    // `;

    // await sendEmail(ADMIN_EMAIL, subject, message);
    // console.log(
    //   chalk.bgRed(
    //     `Admin notified about GeeksForGeeks data fetch failure for ${username}`
    //   )
    // );

    return null;
  }
};

module.exports = { fetchGeeksForGeeksDetails };
