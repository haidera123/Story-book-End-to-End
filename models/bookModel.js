const mongoose = require("mongoose");
const User = require("./userModel");
const fs = require("fs");
const moment = require("moment");

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "Please provide the name of the book."],
    unique: true,
    trim: true,
  },
  script: { type: String, unique: false },
  coverImg: { type: String, default: "" },
  language: { type: String, required: [true, "Please select the language of the book"] },
  description: { type: String, default: "Description of your book", trim: true },
  category: { type: String, required: [true, "Please select category of your book"] },
  noOfPage: { type: Number, default: 0 },
  noOfScenes: { type: Number, default: 0 },
  noOfChapters: { type: Number, default: 0 },
  published: Boolean,
  noOfCharacters: { type: Number, default: 0 },
  characters: [{ type: mongoose.Schema.ObjectId, ref: "Character" }],
  noOfDownloads: { type: Number, default: 0 },
  ratingsAvg: {
    type: Number,
    default: 4.5,
  },
  ratingQuantity: {
    type: Number,
    default: 0,
  },
  writer: { type: mongoose.Schema.ObjectId, ref: "User" },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  publishStatus:{type:String, default:"writing"},
  publisher: {type: mongoose.Schema.ObjectId, ref:"Publisher"},
  publicationDate: {type: String, default:moment(new Date()).format("DD/MM/YYYY")},
});

// bookSchema.pre("save", function (req, res, next) {
//   this.writer = req.user._id;
//   return;
// });
bookSchema.pre(/^find/, function (next) {
  this.populate({
    path: "characters",
    // select:''
  });
  next();
});
bookSchema.methods.getWriterIdAndAssign = async function (userId) {
  const nameOFtheBook = `${this.name}-${new Date() * 1}.json`;
  fs.writeFile(
    `public/bookFilesScript/${nameOFtheBook}`,
    '[{"chapter1":[{"sceneName":"scene Name","content":"write your book here","sceneNote":"Write notes about your scene","scenePhoto":"/img/scenes/default.png"}]}]',
    function (err) {
      if (err) {
        return console.log(err);
      }
      console.log("The file was saved!");
    }
  );
  this.script = nameOFtheBook;
  this.writer = userId;
  await User.findByIdAndUpdate(userId, { $push: { books: this._id } });

  return;
};
bookSchema.methods.deleteBookIdFromWriter = async function (currentUser) {
  try {
    // Delete the book file
    const nameOfTheBook = this.script;
    fs.unlinkSync(`public/bookFilesScript/${nameOfTheBook}`);
    // Delete the book from user books array
    let books = currentUser.books;
    books = JSON.stringify(books);
    books = JSON.parse(books);
    let bookIndex = 0;
    books.forEach((id, ind) => {
      if (this._id == id._id) {
        bookIndex = ind;
        return;
      }
    });
    console.log(bookIndex);
    books.splice(bookIndex, 1);
    console.log(books);
    await User.findByIdAndUpdate(currentUser._id, { books });

    //file removed
  } catch (err) {
    console.error(err);
  }
};
// bookSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "writer",
//     // select:''
//   });
//   next();
// });
const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
