const APIResponse = require('../response/APIResponse')
function errorHandler(err, req, res, next) {
    if (err instanceof APIResponse) {
        if (err.message) {
            return res.status(err.code).json({ message: err.message });
        } else {
            return res.sendStatus(err.code);
        }
    } else {
        next(err);
    }
}

module.exports = errorHandler;