const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: [true, "please provide your first name"],
  },
  lname: { type: String, required: [true, "Please provide your last name"] },
  uname: { type: String, required: [true, "Please provide your user name"] },
  email: {
    type: String,
    required: [true, "Please provide your email address"],
    unique: [true, "This email already exists"],
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please provide your password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      // It only work on mogoose.save and create not update
      validator: function (el) {
        return this.password == el;
      },
      message: "Passwords are not the same",
    },
  },
  about: { type: String, default: "Here comes your description" },
  img: { type: String, default: "profileplaceholder.png" },
  books: [{ type: mongoose.Schema.ObjectId, ref: "Book" }],
  role: {
    type: String,
    enum: ["user", "writer", "publisher", "admin"],
    default: "user",
  },
  publisherId: { type: mongoose.Schema.ObjectId, ref: "Publisher" },
  messages: [{ type: mongoose.Schema.ObjectId, ref: "Message" }],
  connections: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  noOfFollowers: { type: Number, default: 0 },
  noOfFollowings: { type: Number, default: 0 },
  followers: [String],
  followings: [String],
  posts: [{ type: mongoose.Schema.ObjectId, ref: "Post" }],
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete the password confirm
  this.passwordConfirm = undefined;
  next();
});
userSchema.pre(/^find/, function (next) {
  this.populate({
    path: "books",
    // select:''
  });
  next();
});

userSchema.methods.updateBookId = async function (bookId) {
  // 1. Get the bookId
  const newBookId = bookId;
  // 2. Update the bookId
  this.books.push(bookId);
  // 3. Save the document
  await this.save();
};

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 100, 10);
    console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
