const chalk = require("chalk");
const bcrypt = require("bcryptjs");

const { Users, AllowedEmail } = require("../Models");

const { sendEmail, cloudinary } = require("../Utilities");

/*
************************** APIs **************************

1. Login API
2. Register API
3. Send OTP
4. Verify OTP
5. Change Password

**********************************************************
*/

//1. Login API
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email & password are required !" });
    }

    // Find user by email
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found !" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password !" });
    }

    // Generate auth token using the userSchema method
    const token = await user.generateAuthtoken();

    // Return the token to the client
    res.status(200).json({ message: "Login successful !!", token });
  } catch (error) {
    console.error(chalk.bgRed.bold.red("Error during login:"), error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//2. Register API
exports.register = async (req, res) => {
  let upload;
  if (req.file) {
    upload = await cloudinary.uploader.upload(req.file.path);
  } else {
    upload = null;
  }

  try {
    const {
      name,
      email,
      password,
      registrationNumber,
      academicYear,
      phoneNumber,
      linkedinUsername,
      codolioUsername,
      leetcodeUsername,
      codechefUsername,
      codeforcesUsername,
      otp, // OTP from the request body
    } = req.body;

    // Check for required fields
    if (
      !name ||
      !email ||
      !password ||
      !registrationNumber ||
      !academicYear ||
      !phoneNumber ||
      !linkedinUsername ||
      !codolioUsername ||
      !leetcodeUsername ||
      !codechefUsername ||
      !codeforcesUsername ||
      !otp // Ensure OTP is provided
    ) {
      return res.status(400).json({
        message: "All required fields, including OTP, must be provided",
      });
    }

    // Check if the email is allowed and fetch the associated OTP
    const allowedEmail = await AllowedEmail.findOne({ email });
    if (!allowedEmail) {
      return res.status(403).json({
        message: "You are not authorized to register on this platform",
      });
    }

    // Verify the OTP
    if (allowedEmail.OTP !== otp.toString()) {
      return res.status(400).json({ message: "Invalid OTP provided" });
    }

    // Check if the user already exists
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    // Create a new user
    const newUser = new Users({
      profilePicture: upload.secure_url || undefined, // Use uploaded picture or fallback to default from schema
      name,
      email,
      password,
      registrationNumber,
      academicYear,
      phoneNumber: phoneNumber || null,
      role: "USER",
      linkedinUsername: linkedinUsername || null,
      codolioUsername: codolioUsername || null,
      leetcodeUsername: leetcodeUsername || null,
      codechefUsername: codechefUsername || null,
      codeforcesUsername: codeforcesUsername || null,
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Remove the email from the AllowedEmail schema
    await AllowedEmail.deleteOne({ email });

    // Respond with success
    res
      .status(200)
      .json({ message: "User registered successfully", user: savedUser });
  } catch (error) {
    console.log(chalk.bgRed.bold.red("Error registering user:"), error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//3. Send OTP
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email is provided
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if the email is allowed
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(403).json({
        message: "User not found !",
      });
    }

    // Generate a random 6-digit OTP
    const OTP = Math.floor(100000 + Math.random() * 900000);
    const otpExpiry = Date.now() + 2 * 60 * 1000; // OTP expires in 2 minutes

    // Update user OTP and expiry without fetching the entire document
    await Users.updateOne({ email }, { resetPasswordOTP: OTP, otpExpiry });

    // Send OTP email asynchronously (does not block response)
    sendEmail(
      email,
      "Reset Password OTP",
      `Your OTP to reset password is: ${OTP}`
    ).catch((err) =>
      console.error(chalk.bgRed.bold("Error sending email:"), err.message)
    );

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.log(chalk.bgRed.bold.red("Error sending OTP:"), error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//4. Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Check if email and OTP are provided
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    // Find user by email
    const user = await Users.findOne({ email });

    if (!user || !user.resetPasswordOTP) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Check if OTP is expired
    if (user.otpExpiry && new Date() > user.otpExpiry) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Verify OTP
    if (user.resetPasswordOTP !== Number(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Clear OTP fields after successful verification
    await Users.updateOne(
      { email },
      { $unset: { resetPasswordOTP: "", otpExpiry: "" } }
    );

    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.log(chalk.bgRed.bold("Error verifying OTP:"), error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

//5. Change Password
exports.changePassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email & password are required !" });
    }

    // Find user by email
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found !" });
    }

    // Update the password
    user.password = password;
    await user.save();

    // Respond with success
    res.status(200).json({ message: "Password changed successfully !" });
  } catch (error) {
    console.log(chalk.bgRed.bold("Error verifying OTP:"), error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
