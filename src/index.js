require("dotenv").config();
const debug = require("debug")("tracks:root");
const chalk = require("chalk");
const startServer = require("./server/startServer");
const app = require("./server");

const port = process.env.PORT || 3000;

(async () => {
  try {
    await startServer(app, port);
  } catch (error) {
    debug(chalk.red(`Error: `, error.message));
  }
})();
