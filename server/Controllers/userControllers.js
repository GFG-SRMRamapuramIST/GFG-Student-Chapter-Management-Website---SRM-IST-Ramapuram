const bcrypt = require("bcryptjs");
const axios = require("axios");
const streamifier = require("streamifier");

const { verifyAuthToken, cloudinary } = require("../Utilities");

const { Users, potdSchema, ConstantValue } = require("../Models");

require("dotenv").config();

const CODECHEF_API_URL = `${process.env.CODECHEF_API_URL}/api/info/`;
const GEEKSFORGEEKS_API_URL = `${process.env.GEEKSFORGEEKS_API_URL}/api/info/`;
const LEETCODE_API_URL = `${process.env.LEETCODE_API_URL}/api/user-info/`;
const CODEFORCES_API_URL = `${process.env.CODEFORCES_API_URL}/api/user-info/`;

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

//! Google Script URL (has to be shifted to env file)
const scriptURL =
  "https://script.google.com/macros/s/AKfycbw-no7PmM4jwtvkhENHG-pea-AI4hh8Nh1QjSzTrdX6jG4wEBH7FXhKGukF1gtil4bqjg/exec";

// Generate a random 4-character string
const generateRandomCode = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const alphanumeric = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  const firstChar = letters[Math.floor(Math.random() * letters.length)];
  let code = firstChar;

  for (let i = 0; i < 3; i++) {
    code += alphanumeric[Math.floor(Math.random() * alphanumeric.length)];
  }

  return code;
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
7. Get top 5 performers API
8. Get POTD API

9. Report an Issue API

10. Get all users with there id, name, profile pic and role

11. Generating Verification code for Platform API
12. Verifying platfrom API

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
      "name bio phoneNumber academicYear profilePicture linkedinUsername leetcodeUsername codechefUsername codeforcesUsername geeksforgeeksUsername platforms"
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
        geeksforgeeks: user.geeksforgeeksUsername,
      },

      verifiedProfile: {
        leetcode: user.platforms.leetcode.verified,
        codechef: user.platforms.codechef.verified,
        codeforces: user.platforms.codeforces.verified,
        geeksforgeeks: user.platforms.geeksforgeeks.verified,
      },

      // Social Links
      social: {
        linkedin: user.linkedinUsername,
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
      leetcodeUsername: "LeetCode Username",
      codechefUsername: "CodeChef Username",
      codeforcesUsername: "Codeforces Username",
      geeksforgeeksUsername: "GeeksForGeeks Username",
      bio: "Bio",
    };

    // Ensure exactly one field is being updated
    const updateKeys = Object.keys(updates);
    if (updateKeys.length !== 1) {
      return res
        .status(400)
        .json({ message: "You can update only one field at a time" });
    }

    const fieldToUpdate = updateKeys[0];
    if (!allowedFields[fieldToUpdate]) {
      return res.status(400).json({ message: "Invalid field for update" });
    }

    if (fieldToUpdate === "email") {
      return res.status(400).json({ message: "Email cannot be edited" });
    }

    // Check if the field belongs to a coding platform and update its verified status
    const platformVerificationUpdates = {};
    if (fieldToUpdate === "leetcodeUsername") {
      platformVerificationUpdates["platforms.leetcode.verified"] = false;
    } else if (fieldToUpdate === "codechefUsername") {
      platformVerificationUpdates["platforms.codechef.verified"] = false;
    } else if (fieldToUpdate === "codeforcesUsername") {
      platformVerificationUpdates["platforms.codeforces.verified"] = false;
    } else if (fieldToUpdate === "geeksforgeeksUsername") {
      platformVerificationUpdates["platforms.geeksforgeeks.verified"] = false;
    }

    // Perform update
    const updatedUser = await Users.findByIdAndUpdate(
      userId,
      { ...updates, ...platformVerificationUpdates },
      {
        new: true, // Return the updated document
        runValidators: true, // Ensure validation rules in schema are applied
      }
    );

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
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
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

    let user;
    if (req.body.userId) {
      user = await Users.findById(req.body.userId).lean();
    } else {
      const userId = authResult.userId;
      user = await Users.findById(userId).lean();
    }

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
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const authResult = await verifyAuthToken(token);
    if (authResult.status !== "not expired") {
      return res.status(400).json({ message: authResult.message });
    }

    let { page = 1, limit = 10, search = "" } = req.body;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    const skip = (page - 1) * limit;

    // Build query for name filtering
    const query = {};
    if (search.trim() !== "") {
      query.name = { $regex: search.trim(), $options: "i" }; // case-insensitive search
    }

    // Get total count after applying search
    const totalUsers = await Users.countDocuments(query);

    // Fetch and sort users
    const users = await Users.find(query)
      .lean()
      .sort({ currentRank: 1 }) // Ascending
      .skip(skip)
      .limit(limit);

    // Move null ranks to the end
    users.sort((a, b) => {
      const rankA = a.currentRank ?? Infinity;
      const rankB = b.currentRank ?? Infinity;
      return rankA - rankB;
    });

    // Getting minimum passing marks from constant schema
    const constant = await ConstantValue.findOne();

    return res.status(200).json({
      message: "Leaderboard data fetched successfully!",
      data: users,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
      limit,
      minimumPassingMark: constant.passingMarks,
    });
  } catch (error) {
    console.error("Error fetching leaderboard data:", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//7. Get top 5 performers API
exports.fetchTopPerformers = async (req, res) => {
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

    // Fetch top 5 performers
    const topPerformers = await Users.find()
      .sort({ currentRank: 1 })
      .limit(5)
      .select("_id name totalQuestionSolved profilePicture");

    // Format the response
    const formattedResponse = topPerformers.map((user) => ({
      id: user._id,
      name: user.name,
      points: user.totalQuestionSolved,
      avatar: user.profilePicture || "https://placehold.co/32x32",
    }));

    return res.status(200).json({
      message: "Top 5 performers fetched successfully",
      data: formattedResponse,
    });
  } catch (error) {
    console.error("Error fetching top performers:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//8. Get POTD API
exports.fetchPOTD = async (req, res) => {
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

    // Fetch POTD from the correct schema
    const potd = await potdSchema.findOne().select("leetcode geeksforgeeks");

    if (!potd) {
      return res.status(404).json({ message: "POTD not found" });
    }

    return res.status(200).json({
      message: "POTD fetched successfully",
      data: potd,
    });
  } catch (error) {
    console.error("Error fetching POTD:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//9. Report an Issue API
exports.reportAnIssue = async (req, res) => {
  try {
    const { name, email, subject, description } = req.body;

    let issuePicture = null;

    if (req.file) {
      // Upload directly from buffer
      issuePicture = await uploadToCloudinary(req.file.buffer);
    }

    const submissionData = {
      name,
      email,
      subject,
      description,
      issueScreenShot: issuePicture,
    };

    const response = await fetch(scriptURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // Add headers
      body: JSON.stringify(submissionData),
    });
    const responseData = await response.json(); // Try parsing response
    //console.log(responseData)
    if (responseData.result == "success") {
      return res.status(200).json({ message: "Issue reported successfully!" });
    } else {
      return res.status(400).json({ message: "Error reporting an issue!" });
    }
  } catch (error) {
    console.error("Error reporting an issue:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//10. Get all users with their id and name and profile pic
exports.getAllUsersForComparison = async (req, res) => {
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

    const users = await Users.find().select("_id name role profilePicture");

    return res.status(200).json({
      message: "Users fetched successfully",
      data: users,
      userId: authResult._id,
      role: authResult.role,
    });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//11. Generating Verification code for Platform API
exports.verificationCodeForPlatform = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token
  const { platform } = req.body; // Extract platform name

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  if (
    !["leetcode", "codechef", "codeforces", "geeksforgeeks"].includes(platform)
  ) {
    return res.status(400).json({ message: "Invalid platform name" });
  }

  try {
    // Verify the auth token
    const authResult = await verifyAuthToken(token);
    if (authResult.status !== "not expired") {
      return res.status(400).json({ message: authResult.message });
    }

    const userId = authResult.userId; // Extract userId from token
    const verificationCode = generateRandomCode(); // Generate 4-character code
    const updateField = `platforms.${platform}.firstName`; // Field to update

    // Update user's platform firstName
    const updatedUser = await Users.findByIdAndUpdate(
      userId,
      { [updateField]: verificationCode },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: `Verification code generated for ${platform}`,
      verificationCode,
    });
  } catch (error) {
    console.error(
      "Error generating verification code for platform:",
      error.message
    );
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//12. Verifying platform API
exports.verifyPlatform = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { platform } = req.body;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Verify user token
    const authResult = await verifyAuthToken(token);
    if (authResult.status !== "not expired") {
      return res.status(400).json({ message: authResult.message });
    }

    const userId = authResult.userId;
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if platform is valid
    const validPlatforms = [
      "codechef",
      "leetcode",
      "codeforces",
      "geeksforgeeks",
    ];
    if (!validPlatforms.includes(platform)) {
      return res.status(400).json({ message: "Invalid platform" });
    }

    const platformData = user.platforms[platform];
    if (!platformData) {
      return res
        .status(400)
        .json({ message: "Platform data not found for the user!" });
    }

    const { firstName } = platformData;
    if (!firstName) {
      return res
        .status(400)
        .json({ message: "Verification not initiated for the user!" });
    }

    // Handle CodeChef verification
    if (platform === "codechef") {
      try {
        const response = await axios.get(
          `${CODECHEF_API_URL}${user.codechefUsername}`
        );
        const { data } = response;

        if (data?.Name?.includes(firstName)) {
          await Users.findByIdAndUpdate(userId, {
            $set: {
              "platforms.codechef.verified": true,
              "platforms.codechef.firstName": null,
            },
          });

          return res
            .status(200)
            .json({ message: "CodeChef account verified successfully!" });
        }

        return res
          .status(400)
          .json({ message: "Verification failed! Name mismatch." });
      } catch (error) {
        return res.status(500).json({
          message: "Error fetching CodeChef data! Please try later.",
          error: error.message,
        });
      }
    } else if (platform === "geeksforgeeks") {
      try {
        const response = await axios.get(
          `${GEEKSFORGEEKS_API_URL}${user.geeksforgeeksUsername}`
        );
        const { data } = response;

        if (data?.name?.includes(firstName)) {
          await Users.findByIdAndUpdate(userId, {
            $set: {
              "platforms.geeksforgeeks.verified": true,
              "platforms.geeksforgeeks.firstName": null,
            },
          });

          return res
            .status(200)
            .json({ message: "Geeksforgeeks account verified successfully!" });
        }

        return res
          .status(400)
          .json({ message: "Verification failed! Name mismatch." });
      } catch (error) {
        return res.status(500).json({
          message: "Error fetching Geeksforgeeks data! Please try later.",
          error: error.message,
        });
      }
    } else if(platform === "leetcode"){
      try {
        const response = await axios.get(
          `${LEETCODE_API_URL}${user.leetcodeUsername}`
        );
        const { data } = response;

        if (data?.data?.name?.includes(firstName)) {
          await Users.findByIdAndUpdate(userId, {
            $set: {
              "platforms.leetcode.verified": true,
              "platforms.leetcode.firstName": null,
            },
          });

          return res
            .status(200)
            .json({ message: "Leetcode account verified successfully!" });
        }

        return res
          .status(400)
          .json({ message: "Verification failed! Name mismatch." });
      } catch (error) {
        return res.status(500).json({
          message: "Error fetching Leetcode data! Please try later.",
          error: error.message,
        });
      }
    } else if(platform === "codeforces"){
      try {
        const response = await axios.get(
          `${CODEFORCES_API_URL}${user.codeforcesUsername}`
        );
        const { data } = response;

        if (data?.data?.first_name?.includes(firstName)) {
          await Users.findByIdAndUpdate(userId, {
            $set: {
              "platforms.codeforces.verified": true,
              "platforms.codeforces.firstName": null,
            },
          });

          return res
            .status(200)
            .json({ message: "Codeforces account verified successfully!" });
        }

        return res
          .status(400)
          .json({ message: "Verification failed! Name mismatch." });
      } catch (error) {
        return res.status(500).json({
          message: "Error fetching Codeforces data! Please try later.",
          error: error.message,
        });
      }
    }

    return res.status(400).json({
      message: "Verification of this platfrom is not yet implemented.",
    });
  } catch (error) {
    console.error("Error verifying given platform: ", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
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
