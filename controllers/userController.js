const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { tokenConfig } = require("../config");
const RESP = require('../response/RESP');

const signUser = (user) => {
  const { _id, username, email } = user;
  return jwt.sign({ _id, username, email }, tokenConfig.secret, {
    expiresIn: tokenConfig.expiresIn,
  });
};



module.exports.register = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    const user = await User.addUser(username,email,password);
    const token = signUser(user);
    return res
      .cookie("auth", `Bearer ${token}`)
      .cookie("token", `Bearer ${token}`, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      })
      .sendStatus(201);
  } catch (error) {
    next(error);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const username = req.params.username.toLowerCase();
    const { password } = req.body;
    const user = await User.findByUsernameAndPassword(username, password);
    if (!user) return next(RESP.INVALID_CREDENTIALS);
    const token = signUser(user);
    return res
      .cookie("auth", `Bearer ${token}`)
      .cookie("token", `Bearer ${token}`, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      })
      .sendStatus(204);
  } catch (error) {
    next(error);
  }
};

module.exports.getUser = async (req, res, next) => {
  try {
    const { user } = req;
    const { username } = req.params;
    const userDoc = await User.findByUsername(username === 'me' ? user.username : username);
    if (!userDoc) return next(RESP.USER_NOT_FOUND);
    return res.status(200).json(userDoc.safe());
  } catch (err) {
    next(err);
  }
};


module.exports.updateAvatarImage = async (req, res, next) => {
  try {
    const { user } = req;
    const { avatarURL } = req.body;
    const userDoc = await User.findByUsername(user.username);
    await userDoc.updateAvatarURL(avatarURL);
    return next(RESP.AVATAR_URL_UPDATED);
  } catch (error) {
    next(error);
  }
};

module.exports.addContact = async (req, res, next) => {
  try {
    const { user } = req;
    const { contact_username } = req.body;
    const userDoc = await User.findByUsername(user.username);
    await userDoc.addContact(contact_username);
    return next(RESP.CREATED);
  } catch (err) {
    next(err);
  }
};

module.exports.removeContact = async (req, res, next) => {
  try {
    const { user } = req;
    const { contact_username } = req.params;
    const userDoc = await User.findByUsername(user.username);
    await userDoc.removeContact(contact_username);
    return next(RESP.CONTACT_DELETED);
  } catch (err) {
    next(err);
  }
};

module.exports.getContacts = async (req, res, next) => {
  try {
    const { user } = req;
    const userDoc = await User.findByUsername(user.username);
    const contacts = await userDoc.getContacts();
    return res.status(200).json(contacts);
  } catch (err) {
    next(err);
  }
};
