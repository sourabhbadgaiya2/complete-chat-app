const router = require("express").Router();
const { getAllMsg, newMsg } = require("../controllers/messageController");

// GET all msg
router.get("/messages", getAllMsg);

// POST new msg
router.post("/new/messages", newMsg);

module.exports = router;
