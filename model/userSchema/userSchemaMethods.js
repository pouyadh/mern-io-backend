const RESP = require('../../response/RESP');
const bcrypt = require('bcrypt');
const {model} = require("mongoose");

const isEmail = str => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(str);

/** @memberOf User# */
module.exports.updateUsername = async function (new_username) {
    if (await model('User').findByUsername(new_username)) throw RESP.USERNAME_EXISTS;
    this.username = new_username.toLowerCase();
    await this.save();

}

/** @memberOf User# */
module.exports.updateEmail = async function (new_email) {
    if (!isEmail(new_email)) throw RESP.INVALID_EMAIL;
    if (await model('User').findByEmail(new_email)) throw RESP.EMAIL_EXISTS;
    this.email = new_email;
    await this.save();
}

/** @memberOf User# */
module.exports.updatePassword = async function (new_password) {
    this.password = await bcrypt.hash(new_password, 10);
    await this.save();
}

/** @memberOf User# */
module.exports.verifyPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

/** @memberOf User# */
module.exports.delete = async function (username, password) {
    if (this.username !== username) throw RESP.INVALID_CREDENTIALS;
    if (!await this.verifyPassword(password)) throw RESP.INVALID_CREDENTIALS;
    await this.remove();
}

/** @memberOf User# */
module.exports.updateAvatarURL = async function (new_avatarURL) {
    this.avatarURL = new_avatarURL;
    await this.save();
}

/** @memberOf User# */
module.exports.isContact = function (username) {
    return !!this.contacts.find(c => c === username.toLowerCase());
}

/** @memberOf User# */
module.exports.addContact = async function (new_contact_username) {
    if (this.isContact(new_contact_username)) throw RESP.CONTACT_EXISTS;
    if (!await model('User').findByUsername(new_contact_username)) throw RESP.USER_NOT_FOUND;
    this.contacts.push(new_contact_username.toLowerCase());
    await this.save();
}

/** @memberOf User# */
module.exports.removeContact = async function (contact_username) {
    if (!this.isContact(contact_username)) throw RESP.CONTACT_NOT_FOUND;
    this.contacts = this.contacts.filter(c => c.username === contact_username.toLowerCase());
    this.save();
}

/** @memberOf User# */
module.exports.getContacts = async function () {
    return model('User')
        .find({username: {$in: this.contacts}},
            {_id: 0, username: 1, avatarURL: 1}
        );
}

module.exports.safe = function () {
    const { _id , username, email, contacts,avatarURL , createdAt } = this;
    return { _id, username,email,contacts,avatarURL , createdAt };
}