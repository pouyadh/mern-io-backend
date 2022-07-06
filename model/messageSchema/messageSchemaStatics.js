const RESP = require('../../response/RESP');

/** @memberOf Message */
module.exports.findByIds = async function (Ids) {
    return await this.find({ _id : { $in: Ids } });
}

/** @memberOf Message */
module.exports.getMessage = async function (messageId) {
    return await this.findOne({ _id: messageId });
}

/** @memberOf Message */
module.exports.addMessage = async function (username,message) {
    return await this.create({
        owner: username,
        message: JSON.stringify(message),
        updated: false,
    });
}

/** @memberOf Message */
module.exports.removeMessage = async function (message_id) {
    const message = await this.findOne({ _id: message_id });
    if (!message) throw RESP.MESSAGE_NOT_FOUND;
    await message.remove();
}