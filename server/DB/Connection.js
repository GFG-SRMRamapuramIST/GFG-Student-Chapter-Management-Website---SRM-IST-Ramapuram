const chalk = require("chalk");
const mongoose = require("mongoose");
require("dotenv").config();

const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;

const DB = `mongodb+srv://admin:${DATABASE_PASSWORD}@cluster0.1ju82.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const connectDB = async () => {
  try {
    await mongoose.connect(DB);
    console.log(chalk.bgGreen.bold.green("Database Connected Successfully!"));
    return true;
  } catch (error) {
    console.log(chalk.bgRed.bold.red("Database Connection Failed!"), error);
    return false;
  }
};

module.exports = connectDB;
