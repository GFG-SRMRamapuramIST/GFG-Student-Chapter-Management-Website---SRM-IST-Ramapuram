const mongoose = require("mongoose");
const chalk = require("chalk");

const teamSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: true,
    trim: true,
  },
  teamMembers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", // Reference to the `users` schema
    },
  ],
  totalQuestionsSolved: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Calculate total questions solved by the team
teamSchema.methods.updateTeamSolvedQuestions = async function () {
  try {
    const team = await this.populate("members", "solvedQuestionsCount");
    this.totalQuestionsSolved = team.members.reduce(
      (total, member) => total + member.solvedQuestionsCount,
      0
    );
    await this.save();
  } catch (error) {
    console.error(
      chalk.bgRed.bold.red("Error updating team questions solved:"),
      error.message
    );
  }
};

// Creating & Exporting Team Schema
const Teams = mongoose.model("teams", teamSchema);

module.exports = Teams;
