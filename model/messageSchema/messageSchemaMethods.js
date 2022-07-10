/** @memberOf Message# */
module.exports.updateMessage = async function (message) {
    this.message = JSON.stringify(message);
    this.updated = true;
    await this.save();
}
module.exports.markAsDelivered = async function (username) {
    this.deliveredTo.push(username);
    await this.save();
}

module.exports.markAsSeen = async function (username) {
    this.seenBy.push(username);
    await this.save();
}