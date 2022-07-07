const Conversation = require('../model/conversationModel');
const Message = require('../model/messageModel');
const RESP = require('../response/RESP');

module.exports.getMessages = async (req, res, next) => {
    try {
        const { user, conversation } = req;
        const { offset, limit } = req.query;
        const messages = await conversation.getMessages(offset || 0, limit || 0);
        return res.status(200).json(messages);
    } catch (err) {
        next(err);
    }
}

module.exports.addMessage = async (req, res, next) => {
    try {
        const { user, conversation } = req;
        const { message } = req.body;
        await conversation.addMessage(user.username, message);
        return next(RESP.MESSAGE_ADDED);
    } catch (err) {
        next(err);
    }
};

module.exports.removeMessage = async (req, res, next) => {
    try {
        const { user, conversation } = req;
        const { message_id } = req.params;
        await conversation.removeMessage(user.username, message_id);
        return next(RESP.MESSAGE_DELETED);
    } catch (err) {
        next(err);
    }
};

module.exports.updateMessage = async (req, res, next) => {
    try {
        const { user, conversation } = req;
        const { message_id } = req.params;
        const { message } = req.body;
        await conversation.updateMessage(message_id, user.username, message);
        return next(RESP.MESSAGE_UPDATED);
    } catch (err) {
        next(err);
    }
};