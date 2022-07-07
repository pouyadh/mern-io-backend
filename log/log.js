const { debug } = require('../config');

module.exports = function (...args) {
    if (!debug) return;
    console.log(...args);
}