const mongoose = require("mongoose");
const userSchema = require('./userSchema/userSchema');

/** @class User */
const User = mongoose.model("User", userSchema);

module.exports = User;
