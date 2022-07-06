const mongoose = require('mongoose');
const messageSchema = require('./messageSchema/messageSchema');

/** @class Message */
const Message = mongoose.model('Message',messageSchema);

module.exports = Message;