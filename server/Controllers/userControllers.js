const chalk = require("chalk");

const { Users } = require("../Models");
const { verifyAuthToken } = require("../Utilities");

/*
************************** APIs **************************
1. Edit Profile API
2. Join a Team API
3. Leave a Team API
**********************************************************
*/

//1. Edit Profile API
exports.editProfile = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token
  const { userId } = req.body; // ID of the user whose profile is to be edited
  const updates = req.body; // Fields to update

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  if (!userId) {
    return res.status(400).json({ message: "No user ID provided" });
  }

  try {
    // Verify the auth token
    const authResult = await verifyAuthToken(token);
    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    // Ensure the email cannot be updated
    if (updates.email) {
      return res.status(400).json({ message: "Email cannot be edited" });
    }

    // Handle profile picture update
    let profilePicture = undefined;
    if (req.file) {
      profilePicture = `/ProfilePicUploads/${req.file.filename}`;
      updates.profilePicture = profilePicture;
    }

    // Update the user's details
    const updatedUser = await Users.findByIdAndUpdate(userId, updates, {
      new: true, // Return the updated document
      runValidators: true, // Ensure validation rules in schema are applied
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with success
    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(
      chalk.bgRed.bold.red("Error updating profile:"),
      error.message
    );
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//2. Join a Team API
exports.joinTeam = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token
  const { userId, teamId } = req.body; // ID of the user and team to join

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  if (!userId || !teamId) {
    return res.status(400).json({ message: "Missing user or team ID" });
  }

  try {
    // Verify the auth token
    const authResult = await verifyAuthToken(token);
    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    // Fetch the team and check if it exists
    const team = await Teams.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Check if the team is still joinable (within 24 hours of creation)
    const timeElapsed = Date.now() - team.createdAt.getTime();
    const oneDayInMillis = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    if (timeElapsed > oneDayInMillis) {
      return res.status(403).json({
        message: "Cannot join the team. The join period has expired (24 hours).",
      });
    }

    // Fetch the team size limit from the ConstantValue schema
    const constantValues = await ConstantValue.findOne();
    const teamSizeLimit = constantValues?.teamSize || 5; // Default to 5 if not found

    // Check if the team already has the maximum number of members
    if (team.teamMembers.length >= teamSizeLimit) {
      return res.status(403).json({
        message: `Cannot join the team. The team has reached the maximum limit of ${teamSizeLimit} members.`,
      });
    }

    // Update the user's team ID
    const updatedUser = await Users.findByIdAndUpdate(
      userId,
      { teamId },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add the user to the team's teamMembers array
    if (!team.teamMembers.includes(userId)) {
      team.teamMembers.push(userId);
      await team.save();
    }

    // Respond with success
    return res.status(200).json({
      message: "User joined the team successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(chalk.bgRed.bold.red("Error joining team:"), error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//3. Leave a Team API
exports.leaveTeam = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token
  const { userId, teamId } = req.body; // ID of the user and team to join

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  if (!userId || !teamId) {
    return res.status(400).json({ message: "Missing user or team ID" });
  }

  try {
    // Verify the auth token
    const authResult = await verifyAuthToken(token);
    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    // Fetch the team and check if it exists
    const team = await Teams.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Check if the team is still leaveable (within 24 hours of creation)
    const timeElapsed = Date.now() - team.createdAt.getTime();
    const oneDayInMillis = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    if (timeElapsed > oneDayInMillis) {
      return res.status(403).json({
        message: "Cannot leave the team. The leaving period has expired (24 hours).",
      });
    }

    // Update the user's team ID to null
    const updatedUser = await Users.findByIdAndUpdate(
      userId,
      { teamId: null },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove the user from the team's teamMembers array
    team.teamMembers = team.teamMembers.filter((member) => member.toString() !== userId);
    await team.save();

    // Respond with success
    return res.status(200).json({
      message: "User left the team successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(chalk.bgRed.bold.red("Error leaving team:"), error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}