const bcrypt = require("bcrypt");

const encryptPassword = (password) => bcrypt.hash(password, 10);

module.exports = encryptPassword;
