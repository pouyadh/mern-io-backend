const RESP = require("../../response/RESP");
const { OPERATION, PERMISSIONS, ROLE, CONVERSATION_TYPE } = require('./statics');
const { model } = require("mongoose");

/** @memberOf Conversation# */
module.exports.getMembersCount = function () {
    return this.members.length;
}

/** @memberOf Conversation# */
module.exports.isMember = function (username) {
    return !!this.members.find(m => m.username === username);
}

/** @memberOf Conversation# */
module.exports.getMember = function (username) {
    return this.members.find(m => m.username === username);
}

/** @memberOf Conversation# */
module.exports.checkMemberExist = function (username) {
    if (!this.isMember(username)) throw RESP.MEMBER_NOT_FOUND;
}

/** @memberOf Conversation# */
module.exports.checkMemberNotExist = function (username) {
    if (this.isMember(username)) throw RESP.MEMBER_EXISTS;
}

/** @memberOf Conversation# */
module.exports.checkAccess = function (username, operation) {
    const requester = this.getMember(username);
    if (!requester) throw RESP.NOT_MEMBER;
    if (!PERMISSIONS[requester.role].includes(operation)) throw RESP.NO_PERMISSION;
}

/** @memberOf Conversation# */
module.exports.delete = async function (username) {
    this.checkAccess(username, OPERATION.DELETE_CONVERSATION);
    this.remove();
}

/** @memberOf Conversation# */
module.exports.addMember = async function (username, member_username) {
    this.checkAccess(username, OPERATION.ADD_MEMBER)
    this.checkMemberNotExist(member_username);
    this.members.push({ username: member_username, role: ROLE.USER });
    this.save();
}

/** @memberOf Conversation# */
module.exports.removeMember = async function (username, member_username) {
    this.checkAccess(username, username === member_username ? OPERATION.LEAVE : OPERATION.REMOVE_MEMBER);
    this.checkMemberExist(member_username);
    this.members = this.members.filter(m => m.username !== member_username);
    this.save();
}

/** @memberOf Conversation# */
module.exports.setMemberRole = async function (username, member_username, new_role) {
    this.checkAccess(username, OPERATION[`SET_MEMBER_ROLE_TO_${new_role.toUpperCase()}`]);
    this.checkMemberExist(member_username);
    this.getMember(member_username).role = new_role;
    this.save();
}



const getMessage = message_id => model('Message').getMessage(message_id);

/** @memberOf Conversation# */
module.exports.getMessagesCount = function () {
    return this.messages.length;
}


/** @memberOf Conversation# */
module.exports.markAsDelivered = async function () {
    this.undeliveredMessagesCount = 0;
    this.save();
}

/** @memberOf Conversation# */
module.exports.markAsSeen = async function () {
    this.unreadMessagesCount = 0;
    this.save();
}

/** @memberOf Conversation# */
module.exports.getMessages = async function (offset = 0, limit = 0) {
    const message_ids = this.messages.slice(offset, limit ? offset + limit : undefined);
    return await model('Message').findByIds(message_ids);
};

/** @memberOf Conversation# */
module.exports.addMessage = async function (username, message) {
    this.checkAccess(username, OPERATION.ADD_MESSAGE);
    const newMessage = await model('Message').addMessage(username, message);
    this.messages.push(newMessage._id);
    this.lastMessage = newMessage.message;
    this.unreadMessagesCount++;
    this.undeliveredMessagesCount = this.type !== CONVERSATION_TYPE.PRIVATE ? this.undeliveredMessagesCount + 1 : 0;
    this.save();
}

/** @memberOf Conversation# */
module.exports.removeMessage = async function (username, message_id) {
    const message = await getMessage(message_id);
    if (!message) throw RESP.MESSAGE_NOT_FOUND;
    this.checkAccess(username, username === message.owner ? OPERATION.REMOVE_OWN_MESSAGE : OPERATION.REMOVE_MESSAGE);
    await model('Message').removeMessage(message_id);
    this.messages = this.messages.filter(m => m !== message_id);
    this.save();
}

/** @memberOf Conversation# */
module.exports.updateMessage = async function (message_id, username, updatedMessage) {
    const message = await getMessage(message_id);
    if (!message) throw RESP.MESSAGE_NOT_FOUND;
    this.checkAccess(username, username === message.owner ? OPERATION.UPDATE_OWN_MESSAGE : OPERATION.UPDATE_MESSAGE);
    await message.updateMessage(updatedMessage);
}