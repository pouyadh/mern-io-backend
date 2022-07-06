const mongoose = require('mongoose');
const messageSchemaStatics = require('./messageSchemaStatics');
const messageSchemaMethods = require('./messageSchemaMethods');

const messageSchema = new mongoose.Schema({
    message: String,
    owner: String,
    updated: { type: Boolean , default:false }
},{
    timestamps:true,
    statics: messageSchemaStatics,
    methods: messageSchemaMethods
});

module.exports = messageSchema;