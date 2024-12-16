const chalk = require("chalk");

const { User } = require("../Models");

// sample API
exports.api = async (req, res) => {
  res.status(200).json({
    message:
      "Welcome to SRM IST Ramapuram's GFG Student Chapter Management Website Server",
  });
};

// Register
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
