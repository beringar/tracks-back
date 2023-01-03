const debug = require("debug")("tracks: database");
const chalk = require("chalk");
const mongoose = require("mongoose");

// mongoDB connect + config

const connectDB = (connectionString) =>
  new Promise((resolve, reject) => {
    mongoose.set("debug", false);
    mongoose.set("toJSON", {
      virtuals: true,
      transform: (doc, ret) => {
        // eslint-disable-next-line no-param-reassign, no-underscore-dangle
        delete ret._id;
        // eslint-disable-next-line no-param-reassign, no-underscore-dangle
        delete ret.__v;
      },
    });
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
