const RESP = require('../response/RESP');
function attachUserRole(req, res, next) {
    const { username } = req.user;
    const { conversation } = req;
    const userAsMember = conversation.getMemberByUsername(username);
    if (!userAsMember) return next(RESP.NOT_MEMBER);
    req.userRole = userAsMember.role;
    next();
}

module.exports = attachUserRole;