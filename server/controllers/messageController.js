const Message = require("../models/message");

// GET all msg
module.exports.getAllMsg = async (req, res) => {
  try {
    const messages = await Message.find();
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: "Error fetching messages" });
  }
};

// POST a new msg
module.exports.newMsg = async (req, res) => {
  const { text } = req.body;
  try {
    const newMessage = new Message({ text });
    await newMessage.save();

    // Use the io instance from req to broadcast
    req.io.emit("newMessage", newMessage);

    res.status(200).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: "Error saving message" });
  }
};
