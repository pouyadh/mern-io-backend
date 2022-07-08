const RESP = require('../response/RESP');
function attachUserRole(req, res, next) {
    const { username } = req.user;
    const { conversation } = req;
    if (!conversation.isMember(username)) return next(RESP.NOT_MEMBER);
    next();
}

module.exports = attachUserRole;