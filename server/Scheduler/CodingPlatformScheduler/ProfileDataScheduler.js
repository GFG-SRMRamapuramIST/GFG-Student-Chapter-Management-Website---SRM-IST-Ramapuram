const cron = require("node-cron");
const chalk = require("chalk");

const { Users } = require("../../Models");

const {
  fetchCodechefDetails,
} = require("./CodeChef/CodeChefProfileDataFunction");
const {
  fetchLeetcodeDetails,
} = require("./LeetCode/LeetCodeProfileDataFunction");
const {
  fetchCodeforcesDetails,
} = require("./CodeForces/CodeForcesProfileDataFunction");

const updateUserCodingPlatformsDataScheduler = async () => {
  console.log(
    chalk.bgBlue.bold("Starting user's coding profile data update scheduler...")
  );

  try {
    const users = await Users.find(
      {
        $or: [
          { leetcodeUsername: { $ne: null } },
          { codechefUsername: { $ne: null } },
          { codeforcesUsername: { $ne: null } },
        ],
      },
      {
        email: 1,
        leetcodeUsername: 1,
        codechefUsername: 1,
        codeforcesUsername: 1,
      }
    );

    for (const user of users) {
      const {
        _id,
        email,
        leetcodeUsername,
        codechefUsername,
        codeforcesUsername,
      } = user;
      let updateData = {};

      if (leetcodeUsername) {
        const leetcodeData = await fetchLeetcodeDetails(
          leetcodeUsername,
          email
        );
        if (leetcodeData) {
          updateData["platforms.leetcode"] = leetcodeData;
        }
      }

      if (codechefUsername) {
        const codechefData = await fetchCodechefDetails(
          codechefUsername,
          email
        );
        if (codechefData) {
          updateData["platforms.codechef"] = codechefData;
        }
      }

      if (codeforcesUsername) {
        const codeforcesData = await fetchCodeforcesDetails(
          codeforcesUsername,
          email
        );
        if (codeforcesData) {
          updateData["platforms.codeforces"] = codeforcesData;
        }
      }

      if (Object.keys(updateData).length > 0) {
        await Users.updateOne({ _id }, { $set: updateData });
        console.log(
          chalk.green(
            `Updated platforms for user: ${email} for ${
              Object.keys(updateData).length
            } platforms`
          )
        );
      }
    }
  } catch (error) {
    console.error(
      chalk.bgRed.bold("Error updating user coding platform details: "),
      error.message
    );
  }

  console.log(
    chalk.bgGreen.bold("Coding Profile Data Update Scheduler Completed.")
  );
};

// Schedule the function to run every Saturday at 11:59 PM i.e "59 23 * * 6"
cron.schedule("59 23 * * 6", updateUserCodingPlatformsDataScheduler);

console.log(
  chalk.bgMagenta.bold(
    "Coding Profile Data Update Scheduler initialized for users."
  )
);

module.exports = { updateUserCodingPlatformsDataScheduler };
