const chalk = require("chalk");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const { Users, AllowedEmail } = require("../Models");
const { verifyAuthToken } = require("../Utilities");

// Configure nodemailer transporter
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "vitcseguide@gmail.com",
    pass: "gvdt kqqs zzvr vfib",
  },
});

// sample API
exports.api = async (req, res) => {
  res.status(200).json({
    message:
      "Welcome to SRM IST Ramapuram's GFG Student Chapter Management Website Server",
  });
};

// Login API
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ error: "Email & password are required !" });
    }

    // Find user by email
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found !" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password !" });
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

// Register API
exports.register = async (req, res) => {
  try {
    const {
      profilePicture,
      name,
      email,
      password,
      registrationNumber,
      academicYear,
      phoneNumber,
      role,
      linkedinProfileLink,
      codolioProfileLink,
      leetcodeProfileLink,
      codechefProfileLink,
      codeforcesProfileLink,
    } = req.body;

    // Check for required fields
    if (
      !name ||
      !email ||
      !password ||
      !registrationNumber ||
      !academicYear ||
      !phoneNumber ||
      !linkedinProfileLink ||
      !codolioProfileLink ||
      !leetcodeProfileLink ||
      !codechefProfileLink ||
      !codeforcesProfileLink
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    // Check if the email is allowed
    const allowedEmail = await AllowedEmail.findOne({ email });
    if (!allowedEmail) {
      return res.status(403).json({
        message: "You are not authorized to register on this platform",
      });
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
      profilePicture: profilePicture || undefined,
      name,
      email,
      password,
      registrationNumber,
      academicYear,
      phoneNumber: phoneNumber || null,
      role: role || "MEMBER",
      linkedinProfileLink: linkedinProfileLink || null,
      codolioProfileLink: codolioProfileLink || null,
      leetcodeProfileLink: leetcodeProfileLink || null,
      codechefProfileLink: codechefProfileLink || null,
      codeforcesProfileLink: codeforcesProfileLink || null,
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