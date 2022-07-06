const RESP = require('../../response/RESP');
const bcrypt = require("bcrypt");

const isEmail = str => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(str);

async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

/** @memberOf User */
module.exports.findByUsername = async function (username) {
    return await this.findOne({ username: username.toLowerCase() });
};

/** @memberOf User */
module.exports.findByUsernames = async function (usernames) {
    const _usernames = usernames.map(u => u.toLowerCase());
    return await this.find({ username: { $in: _usernames } });
}

/** @memberOf User */
module.exports.findByEmail = async function (email) {
    return await this.findOne({ email: email.toLowerCase() });
}

/** @memberOf User */
module.exports.findByUsernameOrEmail = async function (usernameOrEmail) {
    if (isEmail(usernameOrEmail)) {
        return await this.findByEmail(usernameOrEmail);
    } else {
        return await this.findByUsername(usernameOrEmail);
    }
}

/** @memberOf User */
module.exports.findByUsernameAndPassword = async function (username, password) {
    const user = await this.findByUsername(username);
    if (!user) return null;
    const isPasswordOK = await bcrypt.compare(password, user.password);
    return isPasswordOK ? user : null;
};

/** @memberOf User */
module.exports.addUser = async function (username,email,password) {
    if (await this.findByUsername(username)) throw RESP.USER_EXISTS;
    if (await this.findByEmail(email)) throw RESP.EMAIL_EXISTS;
    const hashedPassword = await hashPassword(password);
    return await this.create({
        username:username.toLowerCase(),
        email:email.toLowerCase(),
        password: hashedPassword
    })
}