const chalk = require("chalk");
const bcrypt = require("bcryptjs");

const { User } = require("../Models");

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
    const user = await User.findOne({ email });
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
    res.status(500).json({ message: "Internal server error", error: error.message });
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
    if (!name || !email || !password || !registrationNumber || !academicYear) {
      return res
        .status(400)
        .json({ error: "All required fields must be provided" });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    const newUser = new User({
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

    // Save user to the database
    const savedUser = await newUser.save();
    res
      .status(200)
      .json({ message: "User registered successfully", user: savedUser });
  } catch (error) {
    console.log(chalk.bgRed.bold.red("Error registering user:"), error.message);
    res
      .status(400)
      .json({ message: "Internal server error", error: error.message });
  }
};
