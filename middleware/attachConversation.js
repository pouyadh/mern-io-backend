const Conversation = require('../model/conversationModel');
const RESP = require('../response/RESP');

async function attachConversation(req, res, next) {
    const { conversation_id } = req.params;
    const conv = await Conversation.findOne({ _id: conversation_id });
    if (!conv) return next(RESP.CONVERSATION_NOT_FOUND);
    req.conversation = conv;
    next();
}

module.exports = attachConversation;