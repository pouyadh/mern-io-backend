const log = require('../log/log');

async function handleDisconnect() {
    log(`'${this.data.auth.username}' disconnected.`);
}
async function handleMessage(data) {
    log(`'${this.data.auth.username}' new message.`);
    this.to(data.conversation_id).emit('message', data.message);
}

const events = [
    { name: 'disconnect', handler: handleDisconnect },
    { name: 'message', handler: handleMessage },
]

function registerEvents(socket) {
    events.forEach(e => socket.on(e.name, e.handler));
}

module.exports = {
    registerEvents
};