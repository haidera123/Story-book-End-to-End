const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.post(
  "/registerPublisher",
  authController.protect,
  userController.uploadUserPhoto,
  userController.registerPublisher
);
router.get(
  "/getAllPublishers",
  userController.getAllPublishers
)
router.patch("/sendBookRequest",
authController.protect,
userController.sendTheBookRequest);
router.patch("/publishTheBook/:id",authController.protect,userController.publishTheBook);
router.patch(
  "/settings/:id",
  authController.protect,
  userController.uploadUserPhoto,
  userController.updateMe
);

router.patch("/updateMyPassword", authController.protect, authController.updatePassword);
router.patch("/makeNewConnection/:id", authController.protect, userController.makeNewConnection);

// router.post("/forgotPassword", authController.forgotPassword);
// router.post("/resetPassword", authController.resetPassword);

router.route("/").get(userController.getAllUsers).post(userController.createUser);
router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
