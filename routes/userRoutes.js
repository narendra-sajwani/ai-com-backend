const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/userController");

userRouter.route("/:id").get(userController.getUserProfile);
userRouter.route("/:id/score").get(userController.getUserScore);

module.exports = userRouter;
