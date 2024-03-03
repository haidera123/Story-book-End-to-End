const express = require("express");

const authController = require("./../controllers/authController");
const characterController = require("./../controllers/characterController");

const router = express.Router();

// router.get("/:id", getBookContent);
router.post(
  "/:id",
  authController.isLoggedIn,
  characterController.uploadUserPhoto,
  characterController.createNewCharacter
);
router.get("/:id", characterController.getAllCharacters);
router.get("/:bookId/:chId", characterController.getTheCharacter);
router.post("/searchByName/:name/:id", characterController.searchCharacterByName);
router.post("/characterSuggestions/:name/:id", characterController.suggestCharacters);
module.exports = router;
