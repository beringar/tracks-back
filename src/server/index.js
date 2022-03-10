require("dotenv").config();
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const { notFoundError, generalError } = require("./middlewares/errors");
const usersRouter = require("./routers/usersRouter");
const tracksRouter = require("./routers/tracksRouter");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(helmet());

app.use("/users", usersRouter);
app.use("/tracks", tracksRouter);

app.use(notFoundError);
app.use(generalError);

module.exports = app;
