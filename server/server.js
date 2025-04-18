require("dotenv").config();

const chalk = require("chalk");
const express = require("express");
const app = express();
const cors = require("cors");

const connectDB = require("./DB/Connection");

//* Importing scheduled tasks
const {
  keepAliveJob,
  monthEndScheduler,
  scheduleNextEvent,
  updateUserCodingPlatformsDataScheduler,
  updateContestDataScheduler,
  updatePracticeQuestionsCount,
  POTDScheduler,
  updateDailyActivity,
} = require("./Scheduler");

const {
  authRouter,
  adminRouter,
  coreMemberRouter,
  userRouter,
} = require("./Routers");

const {
  updateLeaderboardRankings,
} = require("./Scheduler/CodingPlatformScheduler/LeaderBoardSorting");

const PORT = process.env.PORT || 4002;

app.set("trust proxy", 1);
app.use(express.json());
app.use(cors());

//* Routers
app.get("/", (req, res) => {
  res.status(200).json({
    message:
      "Welcome to SRM IST Ramapuram's GFG Student Chapter Management Website Server",
  });
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/core-member", coreMemberRouter);
app.use("/api/v1/user", userRouter);

//* Connecting to the database and starting the server
connectDB().then((isConnected) => {
  if (isConnected) {
    app.listen(PORT, () => {
      console.log(
        chalk.bgGreen.bold.green(
          `Server started at Port No: http://localhost:${PORT}`
        )
      );
      //updateLeaderboardRankings();
    });
  } else {
    console.error(
      chalk.bgRed.bold.red(
        "Server not started due to database connection failure."
      )
    );
  }
});
