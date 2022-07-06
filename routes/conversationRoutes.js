const router = require("express").Router();

const {
    createConversation,
    removeConversation,
    getConversations,
    getConversation,
    addMember,
    removeMember,
    editMemberRole
} = require("../controllers/conversationController");

const {
    addMessage,
    removeMessage,
    updateMessage, getMessages,
} = require("../controllers/messageController");


const attachConversation = require('../middleware/attachConversation');

router.get("/", getConversations);
router.post("/", createConversation);

router.delete("/:conversation_id", attachConversation, removeConversation);
router.get("/:conversation_id", attachConversation, getConversation);

router.post("/:conversation_id/member", attachConversation, addMember);
router.delete("/:conversation_id/member/:member_username", attachConversation, removeMember);
router.patch("/:conversation_id/member/:member_username", attachConversation, editMemberRole);

router.get("/:conversation_id/message" , attachConversation, getMessages)
router.post("/:conversation_id/message", attachConversation, addMessage);
router.delete("/:conversation_id/message/:message_id", attachConversation, removeMessage);
router.put("/:conversation_id/message/:message_id", attachConversation, updateMessage);

module.exports = router;
