const express = require("express");

const authController = require("./../controllers/authController");
const messageController = require("./../controllers/messageController");

const router = express.Router();

// router.get("/:id", getBookContent);
router.get("/", authController.protect, messageController.getAllMessages);
router.post("/:id", authController.protect, messageController.createNewMessage);
router.get("/:id", authController.protect, messageController.getTheContactMessages);

module.exports = router;
