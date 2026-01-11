const { Message, User } = require("../models");

const getMessages = async (req, res) => {
  try {
    const messages = await Message.findAll({
      include: [{ model: User, as: "sender", attributes: ["full_name"] }],
      order: [["created_at", "ASC"]],
      limit: 50,
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error getting messages" });
  }
};

module.exports = { getMessages };
