const express = require("express");
const bookController = require("./../controllers/bookController");
const router = express.Router();
const authController = require("./../controllers/authController");

// router.param("id", bookController.checkId);

router
  .route("/")
  .get(authController.protect, bookController.getAllBooks)
  .post(authController.protect, bookController.createBook);
router
  .route("/:id")
  .get(bookController.getBook)
  .patch(bookController.updateBook)
  .delete(authController.protect, bookController.deleteBook);

module.exports = router;
