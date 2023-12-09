const express = require("express");
const chatRouter = express.Router();
const chatController = require("../controllers/chatController");

chatRouter.route("/").get(chatController.getChatData);

module.exports = chatRouter;
