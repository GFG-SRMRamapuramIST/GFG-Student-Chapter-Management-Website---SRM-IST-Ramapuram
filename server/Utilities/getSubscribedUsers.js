const { Users } = require("../Models");

const getSubscribedUsers = async () => {
  try {
    // Query to fetch only the email field of users with 'subscribed' set to true
    const subscribedUsers = await Users.find({ subscribed: true }).select(
      "email"
    );

    // Extract and return the email addresses as an array
    return subscribedUsers.map((user) => user.email);
  } catch (error) {
    console.error("Error fetching subscribed users:", error.message);
    throw new Error("Unable to fetch subscribed users.", error);
  }
};

module.exports = getSubscribedUsers;
