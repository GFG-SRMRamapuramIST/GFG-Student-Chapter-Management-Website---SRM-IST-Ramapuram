const cron = require("node-cron");
const chalk = require("chalk");
const { Team, Users, ConstantValue } = require("../Models"); // Import necessary models

const teamAllocationScheduler = cron.schedule("48 21 * * *", async () => {
  console.log(chalk.blue("Running team allocation scheduler..."));

  try {
    // Fetch the team size from ConstantValue schema
    const constantValue = await ConstantValue.findOne({});
    if (!constantValue || !constantValue.teamSize) {
      console.log(chalk.red("Team size not set in ConstantValue schema."));
      return;
    }
    const { teamSize } = constantValue;

    // Fetch total number of teams
    const teams = await Team.find({});
    const totalTeams = teams.length;

    // Fetch total number of users
    const totalUsers = await Users.countDocuments({});

    // Identify full and non-full teams
    const fullTeamsCount = teams.filter(
      (team) => team.teamMembers.length === teamSize
    ).length;

    const nonFullTeams = teams.reduce((result, team) => {
      if (team.teamMembers.length < teamSize) {
        result.push({ id: team._id, members: team.teamMembers.length });
      }
      return result;
    }, []);

    // Calculate the ideal number of members for remaining teams
    const remainingUsers = totalUsers - fullTeamsCount * teamSize;
    const idealMembers = Math.floor(remainingUsers / nonFullTeams.length);
    const extraMembers = remainingUsers % nonFullTeams.length;

    // Log the statistics
    console.log(chalk.green("Team allocation statistics:"));
    console.log(chalk.green(`Total teams: ${totalTeams}`));
    console.log(chalk.green(`Total users: ${totalUsers}`));
    console.log(chalk.green(`Full teams: ${fullTeamsCount}`));
    console.log(chalk.green(`Non-full teams: ${nonFullTeams.length}`));
    console.log(chalk.green(`Ideal members per team: ${idealMembers}`));
    console.log(chalk.green(`Teams with an extra member: ${extraMembers}`));

    // Fetch users who are not in any team
    const unallocatedUsers = await Users.find({ teamId: null });

    // Shuffle unallocated users randomly
    const shuffledUsers = unallocatedUsers.sort(() => 0.5 - Math.random());

    let userIndex = 0;

    // Allocate users to teams
    for (let i = 0; i < nonFullTeams.length; i++) {
      const team = nonFullTeams[i];

      // Calculate the number of members to assign
      const alreadyAvailableMembers = team.members; // Current team members count
      const membersToAssign =
        i < extraMembers
          ? idealMembers + 1 - alreadyAvailableMembers
          : idealMembers - alreadyAvailableMembers;

      // Assign users to the team
      const usersToAssign = shuffledUsers
        .slice(userIndex, userIndex + membersToAssign)
        .map((user) => user._id);

      // Update the team with new members
      await Team.findByIdAndUpdate(team.id, {
        $push: { teamMembers: { $each: usersToAssign } },
      });

      // Update the users with the team ID
      await Users.updateMany(
        { _id: { $in: usersToAssign } },
        { $set: { teamId: team.id } }
      );

      userIndex += membersToAssign;
    }

    console.log(chalk.green("Team allocation completed successfully."));
  } catch (error) {
    console.error(
      chalk.red("Error running team allocation scheduler:"),
      error.message
    );
  }
});

module.exports = teamAllocationScheduler;
