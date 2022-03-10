const debug = require("debug")("tracks:userControllers");
const chalk = require("chalk");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../db/models/User");
const encryptPassword = require("../utils/encryptPassword");

const userRegister = async (req, res, next) => {
  const { username, password, name } = req.body;
  try {
    const encryptedPassword = await encryptPassword(password);
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      const error = new Error(`Username ${username} already exists!`);
      error.code = 400;
      next(error);
      return;
    }
    const newUser = await User.create({
      username,
      password: encryptedPassword,
      name,
    });
    debug(
      chalk.cyanBright(`User registered with username: ${newUser.username}`)
    );
    res.status(201);
    res.json({
      message: `User registered with username: ${newUser.username}`,
    });
  } catch (error) {
    next(error);
  }
};

const userLogin = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      const error = new Error(`User ${username} not found!`);
      error.code = 401;
      next(error);
    } else {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        const error = new Error(`Invalid credentials!`);
        error.code = 401;
        next(error);
      } else {
        const userData = {
          username,
          name: user.name,
          id: user.id,
        };
        const token = jwt.sign(userData, process.env.JWT_SECRET);
        debug(
          chalk.cyanBright(
            `Token ${token} generated for > user ${user.username} id:${user.id}`
          )
        );
        res.json({ token });
      }
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  userRegister,
  userLogin,
};
