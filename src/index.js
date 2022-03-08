require("dotenv").config();
const debug = require("debug")("tracks:root");
const chalk = require("chalk");
const connectDB = require("./db");
const startServer = require("./server/startServer");
const app = require("./server");

const mongoDBconnectionString = process.env.MONGO_DB_ATLAS_STRING;
const port = process.env.PORT || 3000;

(async () => {
  try {
    await connectDB(mongoDBconnectionString);
    await startServer(app, port);
  } catch (error) {
    debug(chalk.red(`Error: `, error.message));
  }
})();
