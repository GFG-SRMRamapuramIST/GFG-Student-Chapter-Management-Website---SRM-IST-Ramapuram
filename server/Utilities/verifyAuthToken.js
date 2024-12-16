const jwt = require("jsonwebtoken");
const { Users } = require("../Models");
const SECRET_KEY = process.env.SECRET_KEY;

const verifyAuthToken = async (authToken) => {
  try {
    // Decode the token and verify it
    const decoded = jwt.verify(authToken, SECRET_KEY);

    // Find the user from the database
    const user = await Users.findById(decoded._id);
    if (!user) {
      return { status: "invalid", message: "User not found" };
    }

    // Return the user's ID and role if the token is valid
    return {
      status: "not expired",
      userId: user._id,
      role: user.role,
    };
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return { status: "expired", message: "Token has expired" };
    }

    return { status: "invalid", message: "Invalid token", error: error };
  }
};

module.exports = verifyAuthToken;
