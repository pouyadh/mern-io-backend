const mongoose = require("mongoose");
const conversationSchema = require('./conversationSchema/conversationSchema');

/** @class Conversation */
const Conversation = mongoose.model("Conversation", conversationSchema,);

module.exports = Conversation