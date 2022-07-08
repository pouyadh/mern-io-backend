const { model } = require('mongoose');
const RESP = require('../../response/RESP');
const { CONVERSATION_TYPE, ROLE } = require('./statics');

const getUsers = (usernames) => model('User').findByUsernames(usernames)
const getUser = username => model('User').findByUsername(username);
const unique = array => [...new Set(array)];
const areUsers = async function (usernames) {
    const users = await getUsers(usernames);
    return users.length === usernames.length;
}

/** @memberOf Conversation */
module.exports.findByUsername = async function (username) {
    return await this.find({ "members.username": username }).populate('lastMessage');
}

/** @memberOf Conversation */
module.exports.findSaveByUsername = async function (username) {
    return await this.findOne({
        type: CONVERSATION_TYPE.SAVE,
        "members.username": username,
    }).populate('lastMessage');
}

/** @memberOf Conversation */
module.exports.findPrivateByMembers = async function (memberUsernames) {
    return await this.findOne({
        type: CONVERSATION_TYPE.PRIVATE,
        "members.username": { $in: memberUsernames },
    }).populate('lastMessage')
}

/** @memberOf Conversation */
module.exports.createSaveConversation = async function (username) {
    if (!await getUser(username)) throw RESP.USER_NOT_FOUND;
    if (await this.findSaveByUsername(username)) throw RESP.CONVERSATION_EXISTS;
    await this.create({
        type: CONVERSATION_TYPE.SAVE,
        members: [{ username: username, role: ROLE.OWNER }],
        creator: username,
    });
}

/** @memberOf Conversation */
module.exports.createPrivateConversation = async function (username, target_username) {
    const members = [username, target_username];
    if (!await areUsers(members)) throw RESP.USERS_NOT_FOUND;
    if (await this.findPrivateByMembers(members)) throw RESP.CONVERSATION_EXISTS;
    await this.create({
        type: CONVERSATION_TYPE.PRIVATE,
        members: members.map(username => ({ username, role: ROLE.USER })),
        creator: username
    });
}

/** @memberOf Conversation */
module.exports.createGroupConversation = async function (username, members, name, description, avatarURL) {
    const uniqueMembers = unique([...members, username]);
    if (!await areUsers(uniqueMembers)) throw RESP.USERS_NOT_FOUND;
    const uniqueMembersWithRoles = uniqueMembers.map(m => ({ username: m, role: ROLE.USER }));
    uniqueMembersWithRoles.find(m => m.username === username).role = ROLE.OWNER;
    await this.create({
        type: CONVERSATION_TYPE.GROUP,
        members: uniqueMembersWithRoles,
        creator: username,
        name, description, avatarURL
    });
}

/** @memberOf Conversation */
module.exports.createChannelConversation = async function (username, members, name, description, avatarURL) {
    const uniqueMembers = unique([...members, username]);
    if (!await areUsers(uniqueMembers)) throw RESP.USERS_NOT_FOUND;
    const uniqueMembersWithRoles = uniqueMembers.map(m => ({ username: m, role: ROLE.USER }));
    uniqueMembersWithRoles.find(m => m.username === username).role = ROLE.OWNER;
    await this.create({
        type: CONVERSATION_TYPE.CHANNEL,
        members: uniqueMembersWithRoles,
        creator: username,
        name, description, avatarURL
    });
}