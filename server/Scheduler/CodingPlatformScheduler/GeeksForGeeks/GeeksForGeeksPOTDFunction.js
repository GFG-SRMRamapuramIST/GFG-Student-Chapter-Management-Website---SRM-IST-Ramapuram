const axios = require("axios");
const chalk = require("chalk");

const { sendEmail } = require("../../../Utilities");

require("dotenv").config();

const ADMIN_EMAIL = process.env.EMAIL;
const GFG_API_URL = process.env.GEEKSFORGEEKS_API_URL;

const geeksforgeeksPOTDfunction = async () => {
  try {
    const response = await axios.get(`${GFG_API_URL}/api/pod`);
    const {
      message,
      problemName,
      problemURL,
      difficulty,
      accuracy,
      topicTags,
    } = response.data;

    if (message && problemName && problemURL) {
      return {
        accuracy: accuracy || 0,
        difficulty: difficulty || "Unknown",
        problemName: problemName || "Unknown",
        problemLink: problemURL || "No Link Available",
        topics: topicTags || [],
      };
    } else {
      console.log(
        chalk.yellow("No valid POTD data found from GeeksforGeeks API.")
      );

      const subject = "GeeksforGeeks POTD Data Not Found";
      const message = `
        <p>Dear Admin,</p>
        <p>We couldn't fetch valid GeeksforGeeks POTD data today.</p>
        <p>Please check the API or report this issue.</p>
        <p>Regards,<br/>GeeksForGeeks Student Chapter SRM IST Ramapuram Automated System</p>
      `;

      await sendEmail(ADMIN_EMAIL, subject, message);
      console.log(chalk.bgRed("Admin notified about missing GFG POTD data."));

      // Delay for 3 seconds before sending the next email
      await new Promise((resolve) => setTimeout(resolve, 3000));

      return null;
    }
  } catch (error) {
    console.error(
      chalk.red("Error fetching GeeksforGeeks POTD:"),
      error.message
    );

    // const subject = "GeeksforGeeks POTD Data Fetching Failed";
    // const message = `
    //   <p>Dear Admin,</p>
    //   <p>Failed to fetch GeeksforGeeks POTD data.</p>
    //   <p>Error Message: <b>${error.message}</b></p>
    //   <p>Please investigate the issue.</p>
    //   <p>Regards,<br/>GeeksForGeeks Student Chapter SRM IST Ramapuram Automated System</p>
    // `;

    // await sendEmail(ADMIN_EMAIL, subject, message);
    // console.log(chalk.bgRed("Admin notified about GFG POTD fetch failure."));

    return null;
  }
};

module.exports = { geeksforgeeksPOTDfunction };
