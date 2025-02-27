const chalk = require("chalk");
const bcrypt = require("bcryptjs");

const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

const { Users } = require("../Models");
const { verifyAuthToken, cloudinary } = require("../Utilities");

// Function to upload image buffer to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream((error, result) => {
      if (error) return reject(error);
      resolve(result.secure_url);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

/*
************************** APIs **************************
0. Get Edit Profile Page Data

1. Edit Profile API
2. Change Password API
3. Edit Profile Picture API
4. Toggle Subscribe API

5. Get Profile page data API
6. Get Leaderboard data API


 Join a Team API
 Leave a Team API
**********************************************************
*/

//0. Get Edit Profile Page Data
exports.getEditProfilePageData = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Verify the auth token
    const authResult = await verifyAuthToken(token);
    if (authResult.status !== "not expired") {
      return res.status(400).json({ message: authResult.message });
    }

    const userId = authResult.userId;
    const user = await Users.findById(userId).select(
      "name bio phoneNumber academicYear profilePicture linkedinUsername codolioUsername leetcodeUsername codechefUsername codeforcesUsername"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Formatting academic year
    const academicYearMapping = {
      1: "1st Year",
      2: "2nd Year",
      3: "3rd Year",
      4: "4th Year",
    };

    const formattedResponse = {
      name: user.name,
      bio: user.bio,
      phoneNumber: user.phoneNumber,
      academicYear: academicYearMapping[user.academicYear] || "Unknown",
      profilePic: user.profilePicture,

      // Coding Profiles
      coding: {
        leetcode: user.leetcodeUsername,
        codechef: user.codechefUsername,
        codeforces: user.codeforcesUsername,
      },

      // Social Links
      social: {
        linkedin: user.linkedinUsername,
        codolio: user.codolioUsername,
      },
    };

    res.status(200).json(formattedResponse);
  } catch (error) {
    console.error("Error getting edit-profile-page data:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//1. Edit Profile API
exports.editProfile = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token
  const updates = req.body; // Extract update fields
  //console.log(updates)

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Verify the auth token
    const authResult = await verifyAuthToken(token);
    if (authResult.status !== "not expired") {
      return res.status(400).json({ message: authResult.message });
    }

    const userId = authResult.userId; // Extract userId from token

    // Allowed fields for update
    const allowedFields = {
      name: "Name",
      phoneNumber: "Phone Number",
      registrationNumber: "Registration Number",
      academicYear: "Academic Year",
      linkedinUsername: "LinkedIn Username",
      codolioUsername: "Codolio Username",
      leetcodeUsername: "LeetCode Username",
      codechefUsername: "CodeChef Username",
      codeforcesUsername: "Codeforces Username",
      bio: "Bio",
    };

    // Ensure exactly one field is being updated
    const updateKeys = Object.keys(updates);
    console.log(updateKeys);
    if (updateKeys.length !== 1) {
      return res
        .status(400)
        .json({ message: "You can update only one field at a time" });
    }

    const fieldToUpdate = updateKeys[0];
    console.log(allowedFields[fieldToUpdate]);
    if (!allowedFields[fieldToUpdate]) {
      return res.status(400).json({ message: "Invalid field for update" });
    }

    if (fieldToUpdate === "email") {
      return res.status(400).json({ message: "Email cannot be edited" });
    }

    // Perform update
    const updatedUser = await Users.findByIdAndUpdate(userId, updates, {
      new: true, // Return the updated document
      runValidators: true, // Ensure validation rules in schema are applied
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: `${allowedFields[fieldToUpdate]} updated successfully`,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//2. Change Pasword API
exports.changePassword = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token
  const { currentPassword, newPassword } = req.body;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Verify the auth token
    const authResult = await verifyAuthToken(token);
    if (authResult.status !== "not expired") {
      return res.status(400).json({ message: authResult.message });
    }

    const userId = authResult.userId;

    // Fetch user from DB
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if current password matches
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Update password and save
    user.password = newPassword;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//3. Edit Profile Picture
exports.editProfilePicture = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const authResult = await verifyAuthToken(token);
    if (authResult.status !== "not expired") {
      return res.status(400).json({ message: authResult.message });
    }

    const userId = authResult.userId;
    let profilePicture = null;

    if (req.file) {
      // Upload directly from buffer
      profilePicture = await uploadToCloudinary(req.file.buffer);
    }

    // Update the user's profile picture
    const updatedUser = await Users.findByIdAndUpdate(
      userId,
      { profilePicture },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: req.file
        ? "Profile picture updated successfully"
        : "Profile picture removed successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile picture:", error.message);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

//4. Toggle Subscibe API
exports.toggleSubscribeOption = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Verify the auth token
    const authResult = await verifyAuthToken(token);
    if (authResult.status !== "not expired") {
      return res.status(400).json({ message: authResult.message });
    }

    const userId = authResult.userId;

    // Fetch user from database
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Toggle subscribe status
    user.subscribed = !user.subscribed;
    await user.save();

    return res.status(200).json({
      message: `Subscription ${user.subscribed ? "enabled" : "disabled"}`,
      subscribed: user.subscribed,
    });
  } catch (error) {
    console.error("Error in toggling subscribe button:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//5. Get Profile page data API
exports.getProfilePageData = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Verify the auth token
    const authResult = await verifyAuthToken(token);
    if (authResult.status !== "not expired") {
      return res.status(400).json({ message: authResult.message });
    }

    const userId = authResult.userId;
    const user = await Users.findById(userId).lean(); // Convert Mongoose document to plain object

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Formatting academic year
    const academicYearMapping = {
      1: "1st Year",
      2: "2nd Year",
      3: "3rd Year",
      4: "4th Year",
    };

    // Remove unwanted fields
    const {
      subscribed,
      authToken,
      resetPasswordOTP,
      otpExpiry,
      isBlocked,
      ...filteredUser
    } = user;

    // Send formatted response
    res.status(200).json({
      ...filteredUser,
      academicYear: academicYearMapping[user.academicYear] || "Unknown",
    });
  } catch (error) {
    console.error("Error getting profile page data:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//6. Get Leaderboard data API
exports.fetchLeaderBoardData = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    // Verify the auth token
    const authResult = await verifyAuthToken(token);
    if (authResult.status !== "not expired") {
      return res.status(400).json({ message: authResult.message });
    }

    let { page = 1, limit = 10 } = req.body;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    const skip = (page - 1) * limit;

    // Fetch users sorted by currentRank (null values treated as -1)
    const users = await Users.find()
      .lean()
      .sort({
        currentRank: 1, // Ascending order
      })
      .skip(skip)
      .limit(limit);

    // Handle null ranks (move them to the end)
    users.sort((a, b) => {
      const rankA = a.currentRank ?? Infinity;
      const rankB = b.currentRank ?? Infinity;
      return rankA - rankB;
    });

    const totalUsers = await Users.countDocuments();

    return res.status(200).json({
      message: "Leaderboard data fetched successfully!",
      data: users,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
      limit,
    });
  } catch (error) {
    console.error("Error fetching leaderboard data:", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
/*
// Join a Team API
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

// Leave a Team API
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
  */
