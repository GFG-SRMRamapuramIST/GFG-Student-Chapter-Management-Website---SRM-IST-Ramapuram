const chalk = require("chalk");

const { Users } = require("../Models");
const { verifyAuthToken } = require("../Utilities");

/*
************************** APIs **************************
1. Edit Profile API
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
