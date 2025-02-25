const chalk = require("chalk");

const { Users } = require("../../Models");

/**
 * Updates the leaderboard rankings by sorting users based on totalQuestionSolved.
 */
async function updateLeaderboardRankings() {
  try {
    const users = await Users.find().sort({ totalQuestionSolved: -1 });

    let rank = 1;
    for (const user of users) {
      user.currentRank = rank++;
      await user.save();
    }

    console.log(
      chalk.bgGreen.bold("Leaderboard rankings updated successfully!")
    );
  } catch (error) {
    console.error(
      chalk.bgRed.bold("Error updating leaderboard rankings:"),
      error.message
    );
  }
}

module.exports = { updateLeaderboardRankings };
