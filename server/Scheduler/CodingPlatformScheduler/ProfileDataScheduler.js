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
const {
  fetchGeeksForGeeksDetails,
} = require("./GeeksForGeeks/GeeksForGeeksProfileDataFunction");

// Function to fetch users with coding platform usernames
const fetchUsersWithCodingProfiles = async () => {
  try {
    return await Users.find(
      {
        $or: [
          { leetcodeUsername: { $ne: null } },
          { codechefUsername: { $ne: null } },
          { codeforcesUsername: { $ne: null } },
          { geeksforgeeksUsername: { $ne: null } },
        ],
      },
      {
        email: 1,
        leetcodeUsername: 1,
        codechefUsername: 1,
        codeforcesUsername: 1,
        geeksforgeeksUsername: 1,
      }
    );
  } catch (error) {
    console.error(chalk.bgRed.bold("Error fetching users: "), error.message);
    return [];
  }
};

// Function to update coding platform details
const updateUserCodingPlatformsDataScheduler = async (users) => {
  console.log(
    chalk.bgBlue.bold("Starting user's coding profile data update scheduler...")
  );

  try {
    for (const user of users) {
      const {
        _id,
        email,
        leetcodeUsername,
        codechefUsername,
        codeforcesUsername,
        geeksforgeeksUsername,
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

      if (geeksforgeeksUsername) {
        const geeksforgeeksData = await fetchGeeksForGeeksDetails(
          geeksforgeeksUsername,
          email
        );
        if (geeksforgeeksData) {
          updateData["platforms.geeksforgeeks"] = geeksforgeeksData;
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

// Schedule the function to run every Saturday at 11:59 PM
cron.schedule("59 23 * * 6", async () => {
  console.log(
    chalk.bgBlue.bold("Starting user's coding profile data update scheduler...")
  );

  const users = await fetchUsersWithCodingProfiles();

  if (users.length > 0) {
    for (const user of users) {
      await updateUserCodingPlatformsDataScheduler(user); // Process one user at a time
    }
    console.log(
      chalk.bgGreen.bold("Coding Profile Data Update Scheduler Completed.")
    );
  } else {
    console.log(chalk.yellow.bold("No users found for update."));
  }
});

console.log(
  chalk.bgMagenta.bold(
    "Coding Profile Data Update Scheduler initialized for users."
  )
);

module.exports = { updateUserCodingPlatformsDataScheduler };
