const mongoose = require('mongoose');
const User = require('../userModel');
const { CONVERSATION_TYPES, ROLES } = require('./statics');
const conversationSchemaStatics = require('./conversationSchemaStatics');
const conversationSchemaMethods = require('./conversationSchemaMethods');

async function isUser(v) {
    const user = await User.findOne({ username: v });
    return !!user;
}

const memberSchema = new mongoose.Schema(
    {
        username: { type: String, validate: isUser, required: true },
        role: { type: String, enum: ROLES, required: true },
        unreadMessages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
        undeliveredMessages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]
    })

const conversationSchema = new mongoose.Schema(
    {
        type: { type: String, required: true, enum: CONVERSATION_TYPES },
        name: { type: String, max: 50 },
        avatarURL: { type: String, default: null },
        description: { type: String, default: null },
        members: { type: [memberSchema], required: true },
        messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
        creator: { type: String, required: true, validate: isUser },
        lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
        meta: { type: Map, of: String },
    },
    {
        timestamps: true,
        statics: conversationSchemaStatics,
        methods: conversationSchemaMethods
    }
);

module.exports = conversationSchema;