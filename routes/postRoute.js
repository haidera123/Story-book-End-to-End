const express = require("express");

const authController = require("./../controllers/authController");
const postController = require("./../controllers/postController");

const router = express.Router();

router.post(
  "/createPost",
  authController.protect,
  postController.uploadPostPhoto,
  postController.createNewPost
);
router.get("/", postController.getAllPosts);
router.patch("/likepost/:id", authController.protect, postController.likePost);

module.exports = router;
