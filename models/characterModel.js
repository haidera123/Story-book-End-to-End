const mongoose = require("mongoose");

const characterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Character must have name"],
  },
  category: {
    type: String,
    required: [true, "Please mention category of character"],
  },
  description: {
    type: String,
    default: "Description of character",
  },
  role: {
    type: String,
    required: [true, "Please mention role of character"],
  },
  photo: {
    type: String,
    default: "pngwing.png",
  },
  bookId: {
    type: mongoose.Schema.ObjectId,
    ref: "Book",
  },
});
characterSchema.methods.updateBookId = async function (bookId) {
  // 1. Get the bookId
  const newBookId = bookId;
  // 2. Update the bookId
  this.bookId = newBookId;
  // 3. Save the document
  await this.save();
};

const Character = mongoose.model("Character", characterSchema);

module.exports = Character;
