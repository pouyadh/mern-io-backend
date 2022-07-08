const mongoose = require("mongoose");
const Conversation = require("../model/conversationModel");
const APIResponse = require('../response/APIResponse');
const RESP = require('../response/RESP');
const { CONVERSATION_TYPE } = require("../model/conversationSchema/statics");

module.exports.getConversations = async (req, res, next) => {
  try {
    const { user } = req;
    const conversation = await Conversation.findByUsername(user.username);
    return res.status(200).json(conversation);
  } catch (err) {
    next(err);
  }
};

module.exports.createConversation = async (req, res, next) => {
  try {
    const { user } = req;
    const { type, members, name, description, avatarURL } = req.body;
    switch (type) {
      case CONVERSATION_TYPE.SAVE:
        await Conversation.createSaveConversation(user.username);
        break;
      case CONVERSATION_TYPE.PRIVATE:
        await Conversation.createPrivateConversation(user.username, members[0]);
        break;
      case CONVERSATION_TYPE.GROUP:
        await Conversation.createGroupConversation(user.username, members, name, description, avatarURL);
        break;
      case CONVERSATION_TYPE.CHANNEL:
        await Conversation.createChannelConversation(user.username, members, name, description, avatarURL);
        break;
      default:
        return next(RESP.INVALID_CONVERSATION_TYPE);
    }
    return next(RESP.CONVERSATION_CREATED);

  } catch (err) {
    next(err);
  }
};

module.exports.removeConversation = async (req, _res, next) => {
  try {
    const { user, conversation } = req;
    await conversation.delete(user.username);
    return next(RESP.CONVERSATION_DELETED);
  } catch (err) {
    next(err);
  }
};


module.exports.getConversation = async (req, res, next) => {
  try {
    const { conversation } = req;
    return res.status(200).json(conversation);
  } catch (err) {
    next(err);
  }
};

module.exports.markAsDelivered = async (req, _res, next) => {
  try {
    const { conversation } = req;
    await conversation.markAsDelivered();
    return next(RESP.SUCCESS_NO_CONTENT);
  } catch (err) {
    next(err);
  }
}

module.exports.markAsSeen = async (req, _res, next) => {
  try {
    const { conversation } = req;
    await conversation.markAsSeen();
    return next(RESP.SUCCESS_NO_CONTENT);
  } catch (err) {
    next(err);
  }
}

module.exports.editConversationDetails = async (req, res, next) => {
  try {
    const { conversation } = req;
    const { name, description, avatarURL } = req.body;
    conversation.name = name || conversation.name;
    conversation.description = description || conversation.description;
    conversation.avatarURL = avatarURL || conversation.avatarURL;
    await conversation.save();
    return next(RESP.SUCCESS_NO_CONTENT);
  } catch (err) {
    next(err);
  }
}

module.exports.addMember = async (req, _res, next) => {
  try {
    const { user, conversation } = req;
    const { member_username } = req.body;
    await conversation.addMember(user.username, member_username);
    return next(RESP.CREATED);
  } catch (err) {
    next(err);
  }
};

module.exports.removeMember = async (req, _res, next) => {
  try {
    const { user, conversation } = req;
    const { member_username } = req.params;
    await conversation.removeMember(user.username, member_username);
    return next(RESP.MEMBER_DELETED);
  } catch (err) {
    next(err);
  }
};

module.exports.editMemberRole = async (req, _res, next) => {
  try {
    const { user, conversation } = req;
    const { member_username } = req.params;
    const { new_role } = req.body;
    await conversation.setMemberRole(user.username, member_username, new_role);
    return next(RESP.MEMBER_ROLE_EDITED);
  } catch (err) {
    next(err);
  }
};

