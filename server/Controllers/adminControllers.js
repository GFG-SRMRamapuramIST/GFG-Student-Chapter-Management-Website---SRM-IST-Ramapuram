const fs = require("fs");
const chalk = require("chalk");
const nodemailer = require("nodemailer");
const csv = require("csvtojson");

const {
  Users,
  AllowedEmail,
  BlockedEmails,
  ConstantValue,
} = require("../Models");
const { verifyAuthToken, sendEmail } = require("../Utilities");

const {
  updateLeaderboardRankings,
} = require("../Scheduler/CodingPlatformScheduler/LeaderBoardSorting");

/*
************************** APIs **************************

1. Add Emails using CSV file to register API
2. Add array of Emails to register API
3. Fetch all allowed emails API
4. Fetch all users API
5. Delete emails from AllowedEmail schema API
6. Block email/user from website API
7. Unblock email/user from website API
8. Delete Users from website API
9. Promote user one rank above API
10. Demote user one rank below API
11. Update team size API
12. Create team API
13. Delete team API
14. Edit team name API

15. Edit Constant Values API
16. Fetch Constant Values API

17. Reset achievement API

**********************************************************
*/

// Verify and Authorize Auth Token
const verifyAndAuthorize = async (token, allowedRoles) => {
  const authResult = await verifyAuthToken(token);

  if (authResult.status === "expired") {
    return { status: 401, message: "Token expired" };
  }
  if (authResult.status === "invalid") {
    return { status: 403, message: "Access denied. Invalid token." };
  }
  if (!allowedRoles.includes(authResult.role)) {
    return { status: 403, message: "Access denied. Unauthorized role." };
  }

  return { status: 200, userId: authResult.userId };
};

//1. Add Emails using CSV file to register API
exports.uploadCSVAllowedEmails = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const authResult = await verifyAndAuthorize(token, ["ADMIN"]);
    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const userEmails = [];
    const addedEmails = [];
    const skippedEmails = [];

    // Parse CSV file
    const csvData = await csv().fromFile(req.file.path);
    for (const row of csvData) {
      if (row.Email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.Email)) {
        userEmails.push(row.Email.trim());
      }
    }

    // Process emails
    for (const email of userEmails) {
      try {
        // Check if email exists in Users or AllowedEmail schema
        const existingEntry =
          (await Users.findOne({ email })) ||
          (await AllowedEmail.findOne({ email }));

        if (existingEntry) {
          skippedEmails.push(email);
          continue;
        }

        // Generate a random 6-digit OTP
        const OTP = Math.floor(100000 + Math.random() * 900000).toString();
        const subject =
          "Welcome to GeeksForGeeks Student Chapter SRM IST Ramapuram!";
        const message = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
            
              <style>
                  body {
                      font-family: Arial, sans-serif;
                      background-color:#b3e6d4 ;
                      margin: 0;
                      padding: 0;
                  }
                  .container {
                      width: 100%;
                      max-width: 600px;
                      margin: 0 auto;
                      background-color: #ffffff;
                      padding: 20px;
                      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                      border-radius: 10px;
                  }
                  .header {
                      text-align: center;
                      background-color:white;
                      border-radius: 10px;
                      color: white;
                      padding: 10px 0;
                      overflow: hidden;
                      
                  
                  }
                  .header h1 {
                      margin: 0;
                  }
                  .content {
                      padding: 20px;
                      text-align: center;
                  }
                  .content p {
                  
                      color: #555555;
              text-align: justify;
              line-height: 1.4;
              word-break: break-word;
                  }
                
                  .footer {
                      text-align: center;
                      padding: 10px;
                      color: #777777;
                  }
                  .footer a {
                      color: #007bff;
                      text-decoration: none;
                  }
              
                  .header img{
                      height: 100px;
                      width: 400px;
                  }
                  
                  /* Footer Styling */
                  .footer-container {
                      max-width: 1200px;
                      margin: 0 auto;
                      padding: 40px 20px;
                      text-align: center;
                      font-family: Arial, sans-serif;
                      background-color: #f8f8f8;
                      
                  }

                  .footer-logo {
                      width: 120px;
                      margin-bottom: 30px;
                  }

                  .community-text {
                      font-size: 18px;
                      color: #666;
                      margin-bottom: 25px;
                  }

                  .social-icons {
                      display: flex;
                      justify-content: center;
                      gap: 20px;
                      margin-bottom: 20px;
                  }
                  .social-icons i {
                      font-size: 32px;
                      color: #666;
                      transition: transform 0.2s;
                  }
                  .social-icons i:hover {
                      transform: scale(1.1);
                      color:#00895e;
                  }


                  .footer-bottom {
                  
                      height: 100px;
                  
                      padding-top: 10px;
                      border-top: 1px solid #eee;
                      color: #666;
                      font-size: 14px;
                      overflow: hidden;
                    
                  
                  }

          </style>
          </head>
          <body>
              <div class="container">
                  <div class="header">
                      <img src="https://res.cloudinary.com/du1b2thra/image/upload/v1739372825/dyq9xw2oatp9rjthimf4.png">
                  </div>
                  <div class="content">
                      <h2>Welcome to GeeksforGeeks SRM RMP!</h2>

                      <h3 style="text-align: left;">Hi <span style="color: #00895e;">${email}</span>,</h3>
                      <p>
                      We are thrilled to welcome you to the <span style="background-color:#b3e6d4 ;">GeeksForGeeks Student Chapter SRM IST Ramapuram</span> online management portal! This platform is designed to help you upskill, collaborate, and grow alongside like-minded peers.
                      </p>
                      <p>To complete your onboarding, please use the following <span style="background-color:#b3e6d4; font-weight:bold;">OTP: ${OTP}</span> to verify your account at the time of registration.</p>
                      <p>We look forward to seeing you make the most of our portal and enhancing your learning journey!</p>
                  </div>

              <!-- Footer Section -->
              <footer class="footer-container" style="height: 100px; overflow: hidden;">
              
                  
                  <div class="community-text">
                      Join our evergrowing unstoppable community
                  </div>
                      <div class="social-icons">
                        <a href="https://www.instagram.com/geeksforgeeks_srm_rmp/"><img width="24" height="24" src="https://res.cloudinary.com/du1b2thra/image/upload/v1739607885/wudcidksorrlsc43i0hn.png" alt="instagram-new--v1"/></a>
                        <a href="https://www.linkedin.com/company/geeksforgeeks-srm-rmp"><img width="24" height="24" src="https://res.cloudinary.com/du1b2thra/image/upload/v1739608002/lpdxsqycyrszaufpfrap.png" alt="linkedin"/></a>
                        <a href="https://x.com/GFG_SRM_RMP"><img width="24" height="24" src="https://res.cloudinary.com/du1b2thra/image/upload/v1739608105/dnbjvcdmxstrj9yhoy7e.png" alt="twitterx--v2"/></a>
                        <a href="https://gfgsrmrmp.vercel.app/"><img width="24" height="24" src="https://res.cloudinary.com/du1b2thra/image/upload/v1739608156/iorqcssxpnwvgftktnkt.png" alt="domain"/></a>                        
                    </div>
                  <div class="footer-bottom" style="height: 200px; overflow: hidden;">
                      <div>Queries? We're just one email away: <span style="color: #00895e;">geeksforgeeks.srmistrmp@gmail.com</span> </div>
                      <div>© 2025 GFG Student Chapter. All rights reserved.</div>
                  </div>
              </footer>
              </div>
          </body>
      </html>`;

        await sendEmail(email, subject, message);
        console.log(chalk.bgGreen.bold.green("Email sent to: "), email);

        // Store email and OTP in AllowedEmail schema only if email is sent successfully
        await AllowedEmail.create({ email, OTP, createdAt: new Date() });
        addedEmails.push(email);

        console.log(chalk.bgGreen.bold.green("Email sent to: "), email);
      } catch (error) {
        console.error(
          chalk.bgRed.bold.red("Error processing email: "),
          email,
          error.message
        );
        skippedEmails.push(email);
      }
    }

    // Cleanup: Delete the uploaded CSV file after processing
    fs.unlinkSync(req.file.path);

    return res.status(200).json({
      message: "Emails processed successfully",
      addedCount: addedEmails.length,
      skippedCount: skippedEmails.length,
      addedEmails,
      skippedEmails,
    });
  } catch (error) {
    console.error(
      chalk.bgRed.bold.red("Error processing CSV: "),
      error.message
    );
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//2. Add array of Emails to register API
exports.addAllowedEmails = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Taking token from the header
  const { emails } = req.body; // Array of emails from the admin

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  if (!Array.isArray(emails) || emails.length === 0) {
    return res
      .status(400)
      .json({ message: "No emails provided or invalid input" });
  }

  try {
    // Use the helper function for authorization
    const authResult = await verifyAndAuthorize(token, ["ADMIN"]);
    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    const addedEmails = [];
    const skippedEmails = [];

    for (const email of emails) {
      // Check if the email is already registered
      const existingUser = await Users.findOne({ email });

      if (existingUser) {
        skippedEmails.push(email);
        continue;
      }

      const alreadyAllowed = await AllowedEmail.findOne({ email });
      if (!alreadyAllowed) {
        // Generate a random 6 digit OTP
        const OTP = Math.floor(100000 + Math.random() * 900000).toString();
        const subject =
          "Welcome to GeeksForGeeks Student Chapter SRM IST Ramapuram!";
        const message = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
            
              <style>
                  body {
                      font-family: Arial, sans-serif;
                      background-color:#b3e6d4 ;
                      margin: 0;
                      padding: 0;
                  }
                  .container {
                      width: 100%;
                      max-width: 600px;
                      margin: 0 auto;
                      background-color: #ffffff;
                      padding: 20px;
                      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                      border-radius: 10px;
                  }
                  .header {
                      text-align: center;
                      background-color:white;
                      border-radius: 10px;
                      color: white;
                      padding: 10px 0;
                      overflow: hidden;
                      
                  
                  }
                  .header h1 {
                      margin: 0;
                  }
                  .content {
                      padding: 20px;
                      text-align: center;
                  }
                  .content p {
                  
                      color: #555555;
              text-align: justify;
              line-height: 1.4;
              word-break: break-word;
                  }
                
                  .footer {
                      text-align: center;
                      padding: 10px;
                      color: #777777;
                  }
                  .footer a {
                      color: #007bff;
                      text-decoration: none;
                  }
              
                  .header img{
                      height: 100px;
                      width: 400px;
                  }
                  
                  /* Footer Styling */
                  .footer-container {
                      max-width: 1200px;
                      margin: 0 auto;
                      padding: 40px 20px;
                      text-align: center;
                      font-family: Arial, sans-serif;
                      background-color: #f8f8f8;
                      
                  }

                  .footer-logo {
                      width: 120px;
                      margin-bottom: 30px;
                  }

                  .community-text {
                      font-size: 18px;
                      color: #666;
                      margin-bottom: 25px;
                  }

                  .social-icons {
                      display: flex;
                      justify-content: center;
                      gap: 20px;
                      margin-bottom: 20px;
                  }
                  .social-icons i {
                      font-size: 32px;
                      color: #666;
                      transition: transform 0.2s;
                  }
                  .social-icons i:hover {
                      transform: scale(1.1);
                      color:#00895e;
                  }


                  .footer-bottom {
                  
                      height: 100px;
                  
                      padding-top: 10px;
                      border-top: 1px solid #eee;
                      color: #666;
                      font-size: 14px;
                      overflow: hidden;
                    
                  
                  }

          </style>
          </head>
          <body>
              <div class="container">
                  <div class="header">
                      <img src="https://res.cloudinary.com/du1b2thra/image/upload/v1739372825/dyq9xw2oatp9rjthimf4.png">
                  </div>
                  <div class="content">
                      <h2>Welcome to GeeksforGeeks SRM RMP!</h2>

                      <h3 style="text-align: left;">Hi <span style="color: #00895e;">${email}</span>,</h3>
                      <p>
                      We are thrilled to welcome you to the <span style="background-color:#b3e6d4 ;">GeeksForGeeks Student Chapter SRM IST Ramapuram</span> online management portal! This platform is designed to help you upskill, collaborate, and grow alongside like-minded peers.
                      </p>
                      <p>To complete your onboarding, please use the following <span style="background-color:#b3e6d4; font-weight:bold;">OTP: ${OTP}</span> to verify your account at the time of registration.</p>
                      <p>We look forward to seeing you make the most of our portal and enhancing your learning journey!</p>
                  </div>

              <!-- Footer Section -->
              <footer class="footer-container" style="height: 100px; overflow: hidden;">
              
                  
                  <div class="community-text">
                      Join our evergrowing unstoppable community
                  </div>
                      <div class="social-icons">
                        <a href="https://www.instagram.com/geeksforgeeks_srm_rmp/"><img width="24" height="24" src="https://res.cloudinary.com/du1b2thra/image/upload/v1739607885/wudcidksorrlsc43i0hn.png" alt="instagram-new--v1"/></a>
                        <a href="https://www.linkedin.com/company/geeksforgeeks-srm-rmp"><img width="24" height="24" src="https://res.cloudinary.com/du1b2thra/image/upload/v1739608002/lpdxsqycyrszaufpfrap.png" alt="linkedin"/></a>
                        <a href="https://x.com/GFG_SRM_RMP"><img width="24" height="24" src="https://res.cloudinary.com/du1b2thra/image/upload/v1739608105/dnbjvcdmxstrj9yhoy7e.png" alt="twitterx--v2"/></a>
                        <a href="https://gfgsrmrmp.vercel.app/"><img width="24" height="24" src="https://res.cloudinary.com/du1b2thra/image/upload/v1739608156/iorqcssxpnwvgftktnkt.png" alt="domain"/></a>                        
                    </div>
                  <div class="footer-bottom" style="height: 200px; overflow: hidden;">
                      <div>Queries? We're just one email away: <span style="color: #00895e;">geeksforgeeks.srmistrmp@gmail.com</span> </div>
                      <div>© 2025 GFG Student Chapter. All rights reserved.</div>
                  </div>
              </footer>
              </div>
          </body>
      </html>`;

        try {
          // Add the email and OTP to the allowedEmail collection only after successful email
          await AllowedEmail.create({ email, OTP, createdAt: new Date() });
          addedEmails.push(email);

          await sendEmail(email, subject, message);
          console.log(chalk.bgGreen.bold.green("Email sent to: "), email);
        } catch (error) {
          console.error(
            chalk.bgRed.bold.red("Error sending email to: "),
            email,
            error
          );
          skippedEmails.push(email);
        }
      } else {
        skippedEmails.push(email);
      }
    }

    return res.status(200).json({
      message: "Emails processed successfully",
      addedCount: addedEmails.length,
      skippedCount: skippedEmails.length,
      addedEmails,
      skippedEmails,
    });
  } catch (error) {
    console.error(
      chalk.bgRed.bold.red("Error processing emails: "),
      error.message
    );
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//3. Fetch all allowed emails API
exports.fetchAllowedEmails = async (req, res) => {
  try {
    // Extract token and validate
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const authResult = await verifyAndAuthorize(token, ["ADMIN"]);
    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    // Extract query params with default values
    let { page = 1, limit = 10, search = "", sortOrder = 1 } = req.body;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    sortOrder = parseInt(sortOrder, 10);

    const searchFilter = search ? { email: new RegExp(search, "i") } : {};
    const skip = (page - 1) * limit;

    // Fetch emails and total count concurrently
    const [allowedEmails, totalEmails] = await Promise.all([
      AllowedEmail.find(searchFilter)
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(), // Optimized query performance
      AllowedEmail.countDocuments(searchFilter),
    ]);

    return res.status(200).json({
      message: "Allowed emails fetched successfully!",
      data: allowedEmails,
      totalPages: Math.ceil(totalEmails / limit),
      currentPage: page,
      limit,
      sortOrder,
    });
  } catch (error) {
    console.error("Error fetching allowed emails:", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

//4. Fetach all users API
exports.fetchAllUsers = async (req, res) => {
  try {
    // Extract token and validate
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const authResult = await verifyAndAuthorize(token, ["ADMIN"]);
    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    // Extract query params with default values
    let { page = 1, limit = 10, search = "", sortOrder = 1 } = req.body;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    sortOrder = parseInt(sortOrder, 10);

    const searchFilter = search
      ? {
          $or: [
            { name: new RegExp(search, "i") },
            { email: new RegExp(search, "i") },
          ],
        }
      : {};
    const skip = (page - 1) * limit;

    // Fetch users and total count simultaneously
    const [users, totalUsers] = await Promise.all([
      Users.find(searchFilter)
        .sort({ name: sortOrder }) // Sort by name instead of createdAt
        .skip(skip)
        .limit(limit)
        .lean(),
      Users.countDocuments(searchFilter),
    ]);

    return res.status(200).json({
      message: "Allowed users fetched successfully!",
      data: users,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
      limit,
      sortOrder,
    });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

//5. Delete email from AllowedEmail schema API
exports.deleteAllowedEmail = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header
    const { userId } = req.body; // Single userId to delete

    // Validate input
    if (!userId) {
      return res.status(400).json({ message: "Invalid or missing userId" });
    }

    // Use the helper function for authorization
    const authResult = await verifyAndAuthorize(token, ["ADMIN"]);
    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    // Delete the specified userId
    const deletionResult = await AllowedEmail.deleteOne({ _id: userId });

    if (deletionResult.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "User not found or already deleted" });
    }

    // Respond with success
    return res.status(200).json({
      message: "Email deleted successfully!",
      deletedCount: deletionResult.deletedCount,
    });
  } catch (error) {
    console.error(
      chalk.bgRed.bold.red("Error deleting allowed email:"),
      error.message
    );
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

//6. Block email/user from website API
exports.blockEmail = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from header
  const { email } = req.body; // Email to be blocked

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  if (!email) {
    return res.status(400).json({ message: "No email provided" });
  }

  try {
    // Verify and authorize token
    const authResult = await verifyAndAuthorize(token, ["ADMIN"]);
    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    // Check if the email is already blocked
    const existingBlockedEmail = await BlockedEmails.findOne({ email });
    if (existingBlockedEmail) {
      return res.status(400).json({ message: "Email is already blocked" });
    }

    // Remove email from AllowedEmails if it exists
    const removedFromAllowed = await AllowedEmail.deleteOne({ email });
    if (removedFromAllowed.deletedCount > 0) {
      console.log(
        chalk.bgYellow.bold.yellow(`Email removed from AllowedEmails: ${email}`)
      );
    }

    // Remove email from Users if it exists
    const removedFromUsers = await Users.deleteOne({ email });
    if (removedFromUsers.deletedCount > 0) {
      console.log(
        chalk.bgYellow.bold.yellow(`Email removed from Users: ${email}`)
      );
    }

    // Add email to the BlockedEmails collection
    await BlockedEmails.create({ email });

    // Respond with success
    res.status(200).json({ message: "Email blocked successfully" });
  } catch (error) {
    console.error(chalk.bgRed.bold.red("Error blocking email:"), error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//7. Unblock email/user from website API
exports.unblockEmail = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from header
  const { email } = req.body; // Email to be unblocked

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  if (!email) {
    return res.status(400).json({ message: "No email provided" });
  }

  try {
    // Verify and authorize token
    const authResult = await verifyAndAuthorize(token, ["ADMIN"]);
    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    // Check if the email is blocked
    const existingBlockedEmail = await BlockedEmails.findOne({ email });
    if (!existingBlockedEmail) {
      return res.status(400).json({ message: "Email is not blocked" });
    }

    // Remove email from the BlockedEmails collection
    await BlockedEmails.deleteOne({ email });

    // Respond with success
    res.status(200).json({ message: "Email unblocked successfully" });
  } catch (error) {
    console.error(
      chalk.bgRed.bold.red("Error unblocking email:"),
      error.message
    );
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//8. Delete Users from website API
exports.deleteUser = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from header
  const { userId } = req.body; // Single userId to delete

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    // Verify and authorize token
    const authResult = await verifyAndAuthorize(token, ["ADMIN"]);
    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    // Extract admin's user ID from the token
    const adminUserId = authResult.userId.toString();

    // Prevent admin from deleting themselves
    if (userId.toString() === adminUserId) {
      return res
        .status(400)
        .json({ message: "You cannot delete your own account." });
    }

    // Fetch user before deletion
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Delete the user
    const deletionResult = await Users.deleteOne({ _id: userId });

    if (deletionResult.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "User not found or already deleted." });
    }

    // Send email notification
    const subject = "Account Deletion Notification";
    const message = `<!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
            
              <style>
                  body {
                      font-family: Arial, sans-serif;
                      background-color:#b3e6d4 ;
                      margin: 0;
                      padding: 0;
                  }
                  .container {
                      width: 100%;
                      max-width: 600px;
                      margin: 0 auto;
                      background-color: #ffffff;
                      padding: 20px;
                      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                      border-radius: 10px;
                  }
                  .header {
                      text-align: center;
                      background-color:white;
                      border-radius: 10px;
                      color: white;
                      padding: 0;
                      overflow: hidden;
                      
                  
                  }
                  .header h1 {
                      margin: 0;
                  }
                  .content {
                      padding: 20px;
                      padding-top: 0px;
                      text-align: center;
                  }
                  .content p {
                  
                      color: #555555;
              text-align: justify;
              line-height: 1.4;
              word-break: break-word;
                  }
                
                  .footer {
                      text-align: center;
                      padding: 10px;
                      color: #777777;
                  }
                  .footer a {
                      color: #007bff;
                      text-decoration: none;
                  }
              
                  .header img{
                      height: 100px;
                      width: 400px;
                  }
                  
                  /* Footer Styling */
                  .footer-container {
                      max-width: 1200px;
                      margin: 0 auto;
                      padding: 40px 20px;
                      padding-top: 5px;
                      text-align: center;
                      font-family: Arial, sans-serif;
                      background-color: #f8f8f8;
                      
                  }

                  .footer-logo {
                      width: 120px;
                      margin-bottom: 30px;
                  }

                  .community-text {
                      font-size: 16px;
                      color: #666;
                      margin-bottom: 20px;
                  }

                  .social-icons {
                      display: flex;
                      justify-content: center;
                      gap: 20px;
                      margin-bottom: 20px;
                  }
                  .social-icons i {
                      font-size: 32px;
                      color: #666;
                      transition: transform 0.2s;
                  }
                  .social-icons i:hover {
                      transform: scale(1.1);
                      color:#00895e;
                  }


                  .footer-bottom {
                  
                      height: 100px;
                  
                      padding-top: 10px;
                      border-top: 1px solid #eee;
                      color: #666;
                      font-size: 14px;
                      overflow: hidden;
                    
                  
                  }

          </style>
          </head>
          <body>
              <div class="container">
                  <div class="header">
                      <img src="https://res.cloudinary.com/du1b2thra/image/upload/v1739372825/dyq9xw2oatp9rjthimf4.png">
                  </div>
                  <div class="content">
                    <h2 style="color: #d10000;">Account Deletion Notice</h2>
                
                    <h3 style="text-align: left;">Hi <span style="color: #d10000;">${user.name}</span>,</h3>
                    <p>
                        We regret to inform you that your account has been <span style="background-color:#f5b3b3; font-weight:bold;">permanently deleted</span>.
                    </p>
                    <p>
                        This action has been taken as per our policies and guidelines. You will no longer have access to your account or its associated data.
                    </p>
                    <p>
                        If you believe this was a mistake or need further assistance, please contact our support team.
                    </p>
                </div>
                

              <!-- Footer Section -->
              <footer class="footer-container" style="height: 100px; overflow: hidden;">
              
                  
                  <div class="community-text">
                      Join our evergrowing unstoppable community
                  </div>
                      <div class="social-icons">
                        <a href="https://www.instagram.com/geeksforgeeks_srm_rmp/"><img width="24" height="24" src="https://res.cloudinary.com/du1b2thra/image/upload/v1739607885/wudcidksorrlsc43i0hn.png" alt="instagram-new--v1"/></a>
                        <a href="https://www.linkedin.com/company/geeksforgeeks-srm-rmp"><img width="24" height="24" src="https://res.cloudinary.com/du1b2thra/image/upload/v1739608002/lpdxsqycyrszaufpfrap.png" alt="linkedin"/></a>
                        <a href="https://x.com/GFG_SRM_RMP"><img width="24" height="24" src="https://res.cloudinary.com/du1b2thra/image/upload/v1739608105/dnbjvcdmxstrj9yhoy7e.png" alt="twitterx--v2"/></a>
                        <a href="https://gfgsrmrmp.vercel.app/"><img width="24" height="24" src="https://res.cloudinary.com/du1b2thra/image/upload/v1739608156/iorqcssxpnwvgftktnkt.png" alt="domain"/></a>                        
                    </div>
                  <div class="footer-bottom" style="height: 200px; overflow: hidden;">
                      <div>Queries? We're just one email away: <span style="color: #00895e;">geeksforgeeks.srmistrmp@gmail.com</span> </div>
                      <div>© 2025 GFG Student Chapter. All rights reserved.</div>
                  </div>
              </footer>
              </div>
          </body>
      </html>`;
    await sendEmail(user.email, subject, message);

    await updateLeaderboardRankings();

    return res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//9. Promote user one rank above API
exports.promoteUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const { userId } = req.body;

    if (!token) return res.status(401).json({ message: "No token provided" });
    if (!userId)
      return res.status(400).json({ message: "No user ID provided" });

    // Verify and authorize token
    const authResult = await verifyAndAuthorize(token, ["ADMIN"]);
    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    if (authResult.userId.toString() === userId.toString()) {
      return res.status(400).json({ message: "Cannot promote yourself" });
    }

    // Find the user
    const user = await Users.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Define the promotion hierarchy
    const promotionMap = {
      USER: "MEMBER",
      MEMBER: "COREMEMBER",
      COREMEMBER: "VICEPRESIDENT",
      VICEPRESIDENT: "PRESIDENT",
      PRESIDENT: "ADMIN",
    };

    if (!promotionMap[user.role]) {
      return res
        .status(400)
        .json({ message: "User is already at the highest rank" });
    }

    // Promote the user
    user.role = promotionMap[user.role];
    await user.save();

    // Send email notification
    // const subject = "Promotion Notification";
    // const message = `
    // <!DOCTYPE html>
    //       <html lang="en">
    //       <head>
    //           <meta charset="UTF-8">
    //           <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //           <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">

    //           <style>
    //               body {
    //                   font-family: Arial, sans-serif;
    //                   background-color:#b3e6d4 ;
    //                   margin: 0;
    //                   padding: 0;
    //               }
    //               .container {
    //                   width: 100%;
    //                   max-width: 600px;
    //                   margin: 0 auto;
    //                   background-color: #ffffff;
    //                   padding: 20px;
    //                   box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    //                   border-radius: 10px;
    //               }
    //               .header {
    //                   text-align: center;
    //                   background-color:white;
    //                   border-radius: 10px;
    //                   color: white;
    //                   padding: 0;
    //                   overflow: hidden;

    //               }
    //               .header h1 {
    //                   margin: 0;
    //               }
    //               .content {
    //                   padding: 20px;
    //                   padding-top: 0px;
    //                   text-align: center;
    //               }
    //               .content p {

    //                   color: #555555;
    //           text-align: justify;
    //           line-height: 1.4;
    //           word-break: break-word;
    //               }

    //               .footer {
    //                   text-align: center;
    //                   padding: 10px;
    //                   color: #777777;
    //               }
    //               .footer a {
    //                   color: #007bff;
    //                   text-decoration: none;
    //               }

    //               .header img{
    //                   height: 100px;
    //                   width: 400px;
    //               }

    //               /* Footer Styling */
    //               .footer-container {
    //                   max-width: 1200px;
    //                   margin: 0 auto;
    //                   padding: 40px 20px;
    //                   padding-top: 5px;
    //                   text-align: center;
    //                   font-family: Arial, sans-serif;
    //                   background-color: #f8f8f8;

    //               }

    //               .footer-logo {
    //                   width: 120px;
    //                   margin-bottom: 30px;
    //               }

    //               .community-text {
    //                   font-size: 16px;
    //                   color: #666;
    //                   margin-bottom: 20px;
    //               }

    //               .social-icons {
    //                   display: flex;
    //                   justify-content: center;
    //                   gap: 20px;
    //                   margin-bottom: 20px;
    //               }
    //               .social-icons i {
    //                   font-size: 32px;
    //                   color: #666;
    //                   transition: transform 0.2s;
    //               }
    //               .social-icons i:hover {
    //                   transform: scale(1.1);
    //                   color:#00895e;
    //               }

    //               .footer-bottom {

    //                   height: 100px;

    //                   padding-top: 10px;
    //                   border-top: 1px solid #eee;
    //                   color: #666;
    //                   font-size: 14px;
    //                   overflow: hidden;

    //               }

    //       </style>
    //       </head>
    //       <body>
    //           <div class="container">
    //               <div class="header">
    //                   <img src="https://res.cloudinary.com/du1b2thra/image/upload/v1739372825/dyq9xw2oatp9rjthimf4.png">
    //               </div>
    //               <div class="content">
    //                 <h2 style="color: #00895e;">Congratulations!</h2>

    //                 <h3 style="text-align: left;">Hi <span style="color: #00895e;">${user.name}</span>,</h3>
    //                 <p>
    //                     We are delighted to inform you that you have been <span style="background-color:#b3e6d4; font-weight:bold;">promoted to the position of ${user.role}</span>!
    //                 </p>
    //                 <p>
    //                     Your hard work, dedication, and contributions have been truly commendable, and this promotion is a testament to your excellence.
    //                 </p>
    //                 <p>
    //                     We look forward to seeing you excel in your new role and continue making a remarkable impact!
    //                 </p>
    //             </div>

    //           <!-- Footer Section -->
    //           <footer class="footer-container" style="height: 100px; overflow: hidden;">

    //               <div class="community-text">
    //                   Join our evergrowing unstoppable community
    //               </div>
    //                   <div class="social-icons">
    //                     <a href="https://www.instagram.com/geeksforgeeks_srm_rmp/"><img width="24" height="24" src="https://res.cloudinary.com/du1b2thra/image/upload/v1739607885/wudcidksorrlsc43i0hn.png" alt="instagram-new--v1"/></a>
    //                     <a href="https://www.linkedin.com/company/geeksforgeeks-srm-rmp"><img width="24" height="24" src="https://res.cloudinary.com/du1b2thra/image/upload/v1739608002/lpdxsqycyrszaufpfrap.png" alt="linkedin"/></a>
    //                     <a href="https://x.com/GFG_SRM_RMP"><img width="24" height="24" src="https://res.cloudinary.com/du1b2thra/image/upload/v1739608105/dnbjvcdmxstrj9yhoy7e.png" alt="twitterx--v2"/></a>
    //                     <a href="https://gfgsrmrmp.vercel.app/"><img width="24" height="24" src="https://res.cloudinary.com/du1b2thra/image/upload/v1739608156/iorqcssxpnwvgftktnkt.png" alt="domain"/></a>
    //                 </div>
    //               <div class="footer-bottom" style="height: 200px; overflow: hidden;">
    //                   <div>Queries? We're just one email away: <span style="color: #00895e;">geeksforgeeks.srmistrmp@gmail.com</span> </div>
    //                   <div>© 2025 GFG Student Chapter. All rights reserved.</div>
    //               </div>
    //           </footer>
    //           </div>
    //       </body>
    //   </html>`;
    // await sendEmail(user.email, subject, message);

    return res
      .status(200)
      .json({ message: `User promoted successfully to ${user.role}` });
  } catch (error) {
    console.error(chalk.bgRed.bold.red("Error promoting user:"), error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//10. Demote user one rank below API
exports.demoteUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const { userId } = req.body;

    if (!token) return res.status(401).json({ message: "No token provided" });
    if (!userId)
      return res.status(400).json({ message: "No user ID provided" });

    // Verify and authorize token
    const authResult = await verifyAndAuthorize(token, ["ADMIN"]);
    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    if (authResult.userId.toString() === userId.toString()) {
      return res.status(400).json({ message: "Cannot demote yourself" });
    }

    // Find the user
    const user = await Users.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Define the demotion hierarchy
    const demotionMap = {
      ADMIN: "PRESIDENT",
      PRESIDENT: "VICEPRESIDENT",
      VICEPRESIDENT: "COREMEMBER",
      COREMEMBER: "MEMBER",
      MEMBER: "USER",
    };

    if (!demotionMap[user.role]) {
      return res
        .status(400)
        .json({ message: "User is already at the lowest rank" });
    }

    // Demote the user
    user.role = demotionMap[user.role];
    await user.save();

    // Send email notification
    //     const subject = "Demotion Notification";
    //     const message = `<!DOCTYPE html>
    // <html lang="en">
    //   <head>
    //     <meta charset="UTF-8" />
    //     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    //     <link
    //       rel="stylesheet"
    //       href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
    //     />

    //     <style>
    //       body {
    //         font-family: Arial, sans-serif;
    //         background-color: #b3e6d4;
    //         margin: 0;
    //         padding: 0;
    //       }
    //       .container {
    //         width: 100%;
    //         max-width: 600px;
    //         margin: 0 auto;
    //         background-color: #ffffff;
    //         padding: 20px;
    //         box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    //         border-radius: 10px;
    //       }
    //       .header {
    //         text-align: center;
    //         background-color: white;
    //         border-radius: 10px;
    //         color: white;
    //         padding: 0;
    //         overflow: hidden;
    //       }
    //       .header h1 {
    //         margin: 0;
    //       }
    //       .content {
    //         padding: 20px;
    //         padding-top: 0px;
    //         text-align: center;
    //       }
    //       .content p {
    //         color: #555555;
    //         text-align: justify;
    //         line-height: 1.4;
    //         word-break: break-word;
    //       }

    //       .footer {
    //         text-align: center;
    //         padding: 10px;
    //         color: #777777;
    //       }
    //       .footer a {
    //         color: #007bff;
    //         text-decoration: none;
    //       }

    //       .header img {
    //         height: 100px;
    //         width: 400px;
    //       }

    //       /* Footer Styling */
    //       .footer-container {
    //         max-width: 1200px;
    //         margin: 0 auto;
    //         padding: 40px 20px;
    //         padding-top: 5px;
    //         text-align: center;
    //         font-family: Arial, sans-serif;
    //         background-color: #f8f8f8;
    //       }

    //       .footer-logo {
    //         width: 120px;
    //         margin-bottom: 30px;
    //       }

    //       .community-text {
    //         font-size: 16px;
    //         color: #666;
    //         margin-bottom: 20px;
    //       }

    //       .social-icons {
    //         display: flex;
    //         justify-content: center;
    //         gap: 20px;
    //         margin-bottom: 20px;
    //       }
    //       .social-icons i {
    //         font-size: 32px;
    //         color: #666;
    //         transition: transform 0.2s;
    //       }
    //       .social-icons i:hover {
    //         transform: scale(1.1);
    //         color: #00895e;
    //       }

    //       .footer-bottom {
    //         height: 100px;

    //         padding-top: 10px;
    //         border-top: 1px solid #eee;
    //         color: #666;
    //         font-size: 14px;
    //         overflow: hidden;
    //       }
    //     </style>
    //   </head>
    //   <body>
    //     <div class="container">
    //       <div class="header">
    //         <img
    //           src="https://res.cloudinary.com/du1b2thra/image/upload/v1739372825/dyq9xw2oatp9rjthimf4.png"
    //         />
    //       </div>
    //       <div class="content">
    //         <h2 style="color: #d10000">Role Demotion Notification</h2>

    //         <h3 style="text-align: left">
    //           Hi <span style="color: #d10000">${user.name}</span>,
    //         </h3>
    //         <p>
    //           We regret to inform you that you have been
    //           <span style="background-color: #f5b3b3; font-weight: bold"
    //             >demoted from the position of ${user.role}</span
    //           >.
    //         </p>
    //         <p>
    //           This decision was made after careful consideration of various factors.
    //           We appreciate your efforts and contributions, and we encourage you to
    //           take this as an opportunity for growth.
    //         </p>
    //         <p>
    //           We hope to see you continue striving for excellence and making
    //           valuable contributions to the team.
    //         </p>
    //       </div>

    //       <!-- Footer Section -->
    //       <footer class="footer-container" style="height: 100px; overflow: hidden">
    //         <div class="community-text">
    //           Join our evergrowing unstoppable community
    //         </div>
    //         <div class="social-icons">
    //           <a href="https://www.instagram.com/geeksforgeeks_srm_rmp/"
    //             ><img
    //               width="24"
    //               height="24"
    //               src="https://res.cloudinary.com/du1b2thra/image/upload/v1739607885/wudcidksorrlsc43i0hn.png"
    //               alt="instagram-new--v1"
    //           /></a>
    //           <a href="https://www.linkedin.com/company/geeksforgeeks-srm-rmp"
    //             ><img
    //               width="24"
    //               height="24"
    //               src="https://res.cloudinary.com/du1b2thra/image/upload/v1739608002/lpdxsqycyrszaufpfrap.png"
    //               alt="linkedin"
    //           /></a>
    //           <a href="https://x.com/GFG_SRM_RMP"
    //             ><img
    //               width="24"
    //               height="24"
    //               src="https://res.cloudinary.com/du1b2thra/image/upload/v1739608105/dnbjvcdmxstrj9yhoy7e.png"
    //               alt="twitterx--v2"
    //           /></a>
    //           <a href="https://gfgsrmrmp.vercel.app/"
    //             ><img
    //               width="24"
    //               height="24"
    //               src="https://res.cloudinary.com/du1b2thra/image/upload/v1739608156/iorqcssxpnwvgftktnkt.png"
    //               alt="domain"
    //           /></a>
    //         </div>
    //         <div class="footer-bottom" style="height: 200px; overflow: hidden">
    //           <div>
    //             Queries? We're just one email away:
    //             <span style="color: #00895e"
    //               >geeksforgeeks.srmistrmp@gmail.com</span
    //             >
    //           </div>
    //           <div>© 2025 GFG Student Chapter. All rights reserved.</div>
    //         </div>
    //       </footer>
    //     </div>
    //   </body>
    // </html>
    // `;
    //     await sendEmail(user.email, subject, message);

    return res
      .status(200)
      .json({ message: `User demoted successfully to ${user.role}` });
  } catch (error) {
    console.error(chalk.bgRed.bold.red("Error demoting user:"), error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//15. Edit constant values API
exports.editConstantValues = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from header
  const {
    achievementScheduler,
    backupDataScheduler,
    resetDataScheduler,
    passingPercentage,
    perDayPracticePoint,
    perContestPoint,
    autoKickScheduler,
  } = req.body; // New constant values

  // Check for token
  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  // Validate input
  if (
    achievementScheduler === null &&
    backupDataScheduler === null &&
    resetDataScheduler === null &&
    passingPercentage === null &&
    perDayPracticePoint === null &&
    perContestPoint === null &&
    autoKickScheduler === null
  ) {
    return res
      .status(400)
      .json({ message: "Invalid constant values provided" });
  }

  try {
    // Verify and authorize token
    const authResult = await verifyAndAuthorize(token, ["ADMIN"]);
    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    // Find the ConstantValue document
    const constant = await ConstantValue.findOne();

    if (!constant) {
      return res.status(500).json({
        message: "ConstantValue document not found. Please initialize it.",
      });
    }

    // Update the constant values
    constant.achievementScheduler = achievementScheduler;
    constant.backupDataScheduler = backupDataScheduler;
    constant.resetDataScheduler = resetDataScheduler;
    constant.passingPercentage = passingPercentage;
    constant.perDayPracticePoint = perDayPracticePoint;
    constant.perContestPoint = perContestPoint;
    constant.autoKickScheduler = autoKickScheduler;
    await constant.save();

    // Send success response
    return res.status(200).json({ message: "Constants updated successfully!" });
  } catch (error) {
    console.error("Error updating constants:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//16. Get constant values API
exports.getConstantValues = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  try {
    // Verify and authorize token
    const authResult = await verifyAndAuthorize(token, ["ADMIN"]);
    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    // Find the ConstantValue document
    const constant = await ConstantValue.findOne();

    if (!constant) {
      return res.status(500).json({
        message: "ConstantValue document not found. Please initialize it.",
      });
    }

    return res.status(200).json({ constant });
  } catch (error) {
    console.error("Error fetching constants:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//17. Reset achievements API
exports.resetAchievements = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  // Check for token
  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  try {
    // Verify and authorize token
    const authResult = await verifyAndAuthorize(token, ["ADMIN"]);
    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    await Users.updateMany(
      {},
      {
        $set: {
          achievement: { gold: [], silver: [], bronze: [] },
        },
      }
    );

    res.status(200).json({ message: "Achievements reset successfully" });
  } catch (error) {
    console.error("Error reseting achievement:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

/************************** APIs For Teams **************************

//11. Update team size API
exports.updateTeamSize = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from header
  const { teamSize } = req.body; // New team size

  // Check for token
  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  // Validate teamSize
  if (!teamSize || typeof teamSize !== "number" || teamSize < 1) {
    return res.status(400).json({ message: "Invalid team size provided" });
  }

  try {
    // Verify and authorize token
    const authResult = await verifyAndAuthorize(token, ["ADMIN"]);
    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    // Find the ConstantValue document
    const constant = await ConstantValue.findOne();

    if (!constant) {
      return res.status(500).json({
        message: "ConstantValue document not found. Please initialize it.",
      });
    }

    // Update the teamSize attribute
    constant.teamSize = teamSize;
    await constant.save();

    // Send success response
    return res.status(200).json({ message: "Team size updated successfully" });
  } catch (error) {
    console.error("Error updating team size:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//12. Create team API
exports.createTeam = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from header
  const { teamName } = req.body; // Team name

  // Check for token
  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  // Validate teamName
  if (!teamName || typeof teamName !== "string" || teamName.trim() === "") {
    return res.status(400).json({ message: "Invalid team name provided" });
  }

  try {
    // Verify and authorize token
    const authResult = await verifyAndAuthorize(token, ["ADMIN"]);
    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    // Create the team
    await Teams.create({ teamName });

    // Send success response
    return res.status(200).json({ message: "Team created successfully" });
  } catch (error) {
    console.error(chalk.bgRed.bold.red("Error creating team:"), error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//13. Delete team API
exports.deleteTeam = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from header
  const { teamId } = req.body; // Team ID

  // Check for token
  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  // Validate teamId
  if (!teamId || typeof teamId !== "string" || teamId.trim() === "") {
    return res.status(400).json({ message: "Invalid team ID provided" });
  }

  try {
    // Verify and authorize token
    const authResult = await verifyAndAuthorize(token, ["ADMIN"]);
    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    // Find the team
    const team = await Teams.findById(teamId);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // If team has members, update their teamId to null
    if (team.teamMembers.length > 0) {
      await Users.updateMany(
        { _id: { $in: team.teamMembers } }, // Match user IDs in teamMembers
        { $set: { teamId: null } } // Set teamId to null
      );
      console.log(chalk.green("Updated teamId to null for team members."));
    }

    // Delete the team
    await team.delete();

    // Send success response
    return res.status(200).json({ message: "Team deleted successfully" });
  } catch (error) {
    console.error(chalk.bgRed.bold.red("Error deleting team:"), error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//14. Edit team name API
exports.editTeamName = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from header
  const { teamId, teamName } = req.body; // Team ID and new team name

  // Check for token
  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  // Validate teamId and teamName
  if (
    !teamId ||
    typeof teamId !== "string" ||
    teamId.trim() === "" ||
    !teamName ||
    typeof teamName !== "string" ||
    teamName.trim() === ""
  ) {
    return res
      .status(400)
      .json({ message: "Invalid team ID or name provided" });
  }

  try {
    // Verify and authorize token
    const authResult = await verifyAndAuthorize(token, ["ADMIN"]);
    if (authResult.status !== 200) {
      return res
        .status(authResult.status)
        .json({ message: authResult.message });
    }

    // Find the team
    const team = await Teams.findById(teamId);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Update the team name
    team.teamName = teamName;
    await team.save();

    // Send success response
    return res.status(200).json({ message: "Team name updated successfully" });
  } catch (error) {
    console.error(
      chalk.bgRed.bold.red("Error updating team name:"),
      error.message
    );
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

********************************************************************/
