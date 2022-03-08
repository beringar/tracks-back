const chalk = require("chalk");
const debug = require("debug")("tracks:server:middlewares:errors");

const notFoundError = (req, res) => {
  debug(chalk.red("Endpoint not found!"));
  res.status(404);
  res.json({ error: true, message: "Endpoint not found!" });
};

// eslint-disable-next-line no-unused-vars
const generalError = (err, req, res, next) => {
  debug(chalk.red(`Error: ${err.message}`));
  const errorCode = err.code ?? 500;
  const errorMessage = err.code ? err.message : "Internal server error!";
  res.status(errorCode);
  res.json({ error: true, message: errorMessage });
};

module.exports = {
  notFoundError,
  generalError,
};
