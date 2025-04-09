const message = `
            <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Contest Added</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
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
            padding: 20px;
          }
          .header img {
            height: 80px;
          }
          .content {
            padding: 20px;
            text-align: left;
          }
          .content h2 {
            color: #00895e;
            text-align: center;
          }
          .content p {
            color: #555;
            line-height: 1.5;
          }
          .footer {
            text-align: center;
            padding: 20px;
            background-color: #f8f8f8;
            font-size: 14px;
            color: #666;
          }
          .footer a {
            color: #00895e;
            text-decoration: none;
            font-weight: bold;
          }
          .social-icons {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-top: 10px;
          }
          .social-icons img {
            width: 24px;
            height: 24px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img
              src="https://res.cloudinary.com/du1b2thra/image/upload/v1739372825/dyq9xw2oatp9rjthimf4.png"
              alt="GFG SRM RMP"
            />
          </div>

          <div class="content">
            <h2>Contest Added</h2>
            <p>Dear user,</p>
            <p>We are writing to inform you about a newly added contest on our calender. Details given below:</p>

            <h3 style="color: #00895e">${contestName}</h3>
            <p>Which will be conducted on ${platformMap[lowerCasePlatform]} at ${contestStartDateTime}</p>

            <p>Participating in this contest would help you learn and grow as a compitative coder, so don't miss out.</p>

            <p>
              For more details, please visit
              our official website:
            </p>
            <p style="text-align: center">
              <a
                href="https://gfgsc-management-website-srm-ist-ramapuram-testing.vercel.app/"
                style="
                  background-color: #00895e;
                  color: #ffffff;
                  padding: 10px 20px;
                  border-radius: 5px;
                  text-decoration: none;
                  display: inline-block;
                "
                >Visit Our Website</a
              >
            </p>
          </div>

          <div class="footer">
            <p>Join our ever-growing community!</p>
            <div class="social-icons">
              <a href="https://www.instagram.com/geeksforgeeks_srm_rmp/"
                ><img
                  src="https://res.cloudinary.com/du1b2thra/image/upload/v1739607885/wudcidksorrlsc43i0hn.png"
                  alt="Instagram"
              /></a>
              <a href="https://www.linkedin.com/company/geeksforgeeks-srm-rmp"
                ><img
                  src="https://res.cloudinary.com/du1b2thra/image/upload/v1739608002/lpdxsqycyrszaufpfrap.png"
                  alt="LinkedIn"
              /></a>
              <a href="https://x.com/GFG_SRM_RMP"
                ><img
                  src="https://res.cloudinary.com/du1b2thra/image/upload/v1739608105/dnbjvcdmxstrj9yhoy7e.png"
                  alt="Twitter/X"
              /></a>
              <a href="https://gfgsrmrmp.vercel.app/"
                ><img
                  src="https://res.cloudinary.com/du1b2thra/image/upload/v1739608156/iorqcssxpnwvgftktnkt.png"
                  alt="Website"
              /></a>
            </div>
           <div class="footer-bottom" style="height: 200px; overflow: hidden;">
                          <div>Queries? We're just one email away: <span style="color: #00895e;">geeksforgeeks.srmistrmp@gmail.com</span> </div>
                          <div>© 2025 GFG Student Chapter. All rights reserved.</div>
                      </div>
          </div>
        </div>
      </body>
    </html>
    `;
