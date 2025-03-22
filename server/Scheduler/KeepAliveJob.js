const cron = require("node-cron");
const chalk = require("chalk");
const axios = require("axios");

// Keep-Alive Cron Job (Every 14 Minutes)
const keepAliveJob = cron.schedule("*/14 * * * *", async () => {
  try {
    console.log(chalk.yellow("Pinging server to keep it awake..."));
    await axios.get(
      "https://gfgscsrmrmp-management-web-application.onrender.com"
    );
    console.log(chalk.green("Server pinged successfully."));
  } catch (error) {
    console.error(chalk.red("Error in Keep-Alive Ping:"), error.message);
  }
});

console.log(chalk.bgCyan.bold("Keep-Alive Scheduler Initialized."));

// Export the cron job
module.exports = keepAliveJob;
