const express = require("express");
const authController = require("./../controllers/authController");
const writingtoolController = require("./../controllers/writingtoolController");
const fs = require("fs");

const router = express.Router();

// router.get("/:id", getBookContent);
router.post("/saveScript/:id", writingtoolController.updateBookContent);
router.post("/deleteScene/:id", writingtoolController.deleteScene);
router.post(
  "/updateScenePhoto/:id",
  authController.isLoggedIn,
  writingtoolController.uploadScenePhoto,
  writingtoolController.updateScenePhoto
);

module.exports = router;
