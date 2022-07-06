const {
  register,
  login,
  updateAvatarImage,
  addContact,
  removeContact,
  getContacts,
  getUser,
} = require("../controllers/userController");

const router = require("express").Router();
const auth = require("../middleware/auth");

router.post("/", register);
router.post("/:username", login);

router.get("/:username", auth, getUser);
router.put("/me/avatar", auth, updateAvatarImage);
router.post("/me/contact", auth, addContact);
router.delete("/me/contact/:contact_username", auth, removeContact);
router.get("/me/contact", auth, getContacts);

module.exports = router;
