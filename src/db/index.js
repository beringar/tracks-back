const debug = require("debug")("tracks: database");
const chalk = require("chalk");
const mongoose = require("mongoose");

const connectDB = (connectionString) =>
  new Promise((resolve, reject) => {
    mongoose.connect(connectionString, (error) => {
      if (error) {
        reject(error);
        return;
      }
      debug(chalk.greenBright.bold("Connected to DB"));
      resolve();
    });
  });

module.exports = connectDB;
