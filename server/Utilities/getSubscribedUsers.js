const { Users } = require("../Models");

const getSubscribedUsers = async (role) => {
  try {
    // Define role-based filtering
    const roleFilters = {
      ALL: { role: { $ne: "ADMIN" } },
      MEMBER: {
        role: { $in: ["MEMBER", "COREMEMBER", "VICEPRESIDENT", "PRESIDENT"] },
      },
      COREMEMBER: {
        role: { $in: ["COREMEMBER", "VICEPRESIDENT", "PRESIDENT"] },
      },
    };

    // Get the appropriate filter or default to an empty object (no filtering)
    const roleFilter = roleFilters[role] || {};

    // Query users based on subscription status and role
    const subscribedUsers = await Users.find({
      subscribed: true,
      ...roleFilter,
    })
      .select("email")
      .lean();

    // Extract and return emails
    return subscribedUsers.map((user) => user.email);
  } catch (error) {
    console.error("Error fetching subscribed users:", error.message);
    return []; // Return an empty array in case of error
  }
};

module.exports = getSubscribedUsers;
