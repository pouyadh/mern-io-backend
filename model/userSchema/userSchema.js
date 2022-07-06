const mongoose = require("mongoose");
const userSchemaStatics = require('./userSchemaStatics');
const userSchemaMethods = require('./userSchemaMethods');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            minlength: [3, "Username must be at least 3 characters"],
            maxlength: [20, "Username must be a maximum of 20 characters"],
            lowercase: true,
            unique: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            maxlength: [317, "Email must be a maximum of 317 characters"],
            lowercase: true,
            unique: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters"],
        },
        contacts: {
            type: [{type: String, lowercase: true}],
        },
        avatarURL: {
            type: String,
            default: null,
        },
        meta: {
            type: Map,
            of: String,
        },
    },
    {
        timestamps: true,
        statics: userSchemaStatics,
        methods: userSchemaMethods
    }
);

module.exports = userSchema;