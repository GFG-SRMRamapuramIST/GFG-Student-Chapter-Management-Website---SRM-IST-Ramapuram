require("dotenv").config();

const chalk = require("chalk");
const express = require("express");
const app = express();
const cors = require("cors");

const connectDB = require("./DB/Connection");
const { authRouter, adminRouter, coreMemberRouter } = require("./Routers");

const PORT = process.env.PORT || 4002;

app.use(express.json());
app.use(cors());

// Routers
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/core-member", coreMemberRouter);

// Connecting to the database and starting the server
connectDB().then((isConnected) => {
  if (isConnected) {
    app.listen(PORT, () => {
      console.log(
        chalk.bgGreen.bold.green(
          `Server started at Port No: http://localhost:${PORT}`
        )
      );
    });
  } else {
    console.error(
      chalk.bgRed.bold.red(
        "Server not started due to database connection failure."
      )
    );
  }
});
