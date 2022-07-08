const router = require("express").Router();

const {
    createConversation,
    removeConversation,
    getConversations,
    getConversation,
    addMember,
    removeMember,
    editMemberRole,
    markAsSeen,
    markAsDelivered,
    editConversationDetails
} = require("../controllers/conversationController");

const {
    addMessage,
    removeMessage,
    updateMessage, getMessages,
} = require("../controllers/messageController");


const attachConversation = require('../middleware/attachConversation');
const checkMembership = require('../middleware/checkMembership');

router.get("/", getConversations);
router.post("/", createConversation);

router.delete("/:conversation_id", attachConversation, checkMembership, removeConversation);
router.get("/:conversation_id", attachConversation, checkMembership, getConversation);
router.put('/:conversation_id/seen', attachConversation, checkMembership, markAsSeen);
router.put('/:conversation_id/delivered', attachConversation, checkMembership, markAsDelivered);
router.patch('/:conversation_id', attachConversation, checkMembership, editConversationDetails);

router.post("/:conversation_id/member", attachConversation, checkMembership, addMember);
router.delete("/:conversation_id/member/:member_username", checkMembership, attachConversation, removeMember);
router.patch("/:conversation_id/member/:member_username", attachConversation, checkMembership, editMemberRole);

router.get("/:conversation_id/message", attachConversation, checkMembership, getMessages)
router.post("/:conversation_id/message", attachConversation, checkMembership, addMessage);
router.delete("/:conversation_id/message/:message_id", attachConversation, checkMembership, removeMessage);
router.put("/:conversation_id/message/:message_id", attachConversation, checkMembership, updateMessage);

module.exports = router;
