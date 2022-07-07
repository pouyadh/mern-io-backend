const socketHandler = require('./socketHandler');
const Conversation = require('../model/conversationModel');
const log = require('../log/log');

async function joinUserToConversations(socket) {
    const { username } = socket.data.auth;
    const convs = await Conversation.findByUsername(username);
    const rooms = convs.map(c => c._id.toString());
    socket.join(rooms);
    log(`'${username}' is Ready.`)
}

function handleConnection(socket) {
    log(`'${socket.data.auth.username}' Connected.`)
    log(`Registering events...`)
    socketHandler.registerEvents(socket);
    log(`Joining user to the conversations...`)
    joinUserToConversations(socket);
}



const events = [
    { name: 'connection', handler: handleConnection }
]






function registerEvents(io) {
    events.forEach(e => io.on(e.name, e.handler));
}
module.exports = {
    registerEvents
}