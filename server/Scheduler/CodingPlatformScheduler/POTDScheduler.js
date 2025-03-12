const cron = require("node-cron");
const chalk = require("chalk");
require("dotenv").config();

const { leetcodePOTDfunction } = require("./LeetCode/LeetCodePOTDFunction");
const {
  geeksforgeeksPOTDfunction,
} = require("./GeeksForGeeks/GeeksForGeeksPOTDFunction");

const { potdSchema } = require("../../Models");

const { sendEmail } = require("../../Utilities");

const ADMIN_EMAIL = process.env.EMAIL;

async function updatePOTD() {
  try {
    console.log(chalk.cyan("Fetching POTD from LeetCode and GeeksForGeeks..."));
    const leetCodePOTD = await leetcodePOTDfunction();
    const geeksForGeeksPOTD = await geeksforgeeksPOTDfunction();

    if (!leetCodePOTD || !geeksForGeeksPOTD) {
      const missingSource = !leetCodePOTD ? "LeetCode" : "GeeksForGeeks";
      console.warn(chalk.yellow(`Missing POTD data from ${missingSource}`));

      const subject = `POTD Missing from ${missingSource}`;
      const message = `<p>Dear Admin,</p>
                      <p>The POTD data for ${missingSource} is missing. Please check the API or data sources.</p>
                      <p>Regards,<br/>Automated System</p>`;
      await sendEmail(ADMIN_EMAIL, subject, message);
      console.log(
        chalk.bgRed(`Admin notified about missing POTD from ${missingSource}`)
      );
    }

    const potdData = await potdSchema.findOne();
    if (!potdData) {
      console.log(
        chalk.green("No existing POTD document found. Creating a new one...")
      );
      await potdSchema.create({
        leetcode: leetCodePOTD,
        geeksforgeeks: geeksForGeeksPOTD,
      });
    } else {
      potdData.leetcode = leetCodePOTD;
      potdData.geeksforgeeks = geeksForGeeksPOTD;
      await potdData.save();
    }

    console.log(chalk.green("POTD updated successfully."));
  } catch (error) {
    console.error(chalk.red("Error updating POTD:"), error.message);

    const subject = "POTD Scheduler Failed";
    const message = `<p>Dear Admin,</p>
                    <p>The POTD scheduler encountered an error:</p>
                    <p>Error Message: <b>${error.message}</b></p>
                    <p>Please investigate the issue.</p>
                    <p>Regards,<br/>Automated System</p>`;
    await sendEmail(ADMIN_EMAIL, subject, message);
    console.log(chalk.bgRed("Admin notified about POTD scheduler failure"));
  }
}

function POTDScheduler() {
  console.log(chalk.bgMagenta.bold("POTD Scheduler Initialized."));
  cron.schedule("0 0 * * *", updatePOTD);
}

POTDScheduler();

module.exports = { updatePOTD, POTDScheduler };
