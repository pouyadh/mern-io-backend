/** @memberOf Message# */
module.exports.updateMessage = async function (message) {
    this.message = JSON.stringify(message);
    this.updated = true;
    await this.save();
}