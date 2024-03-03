const mongoose = require("mongoose");
const validator = require("validator");

const publisherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name of publication house"],
  },
  subtitle: {
    type: String,
    required: [true, "Please provide subtitle of your publication house"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email address"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  address: {
    type: String,
    required: [true, "Please provide address"],
  },
  phone: {
    type: String,
    required: [true, "Please provide phone number"],
  },
  img: {
    type: String,
    default: "Coverimg.jpg",
  },
  bookSend : [{type: mongoose.Schema.ObjectId, ref: "Book"}]
});

publisherSchema.pre(/^find/, function (next) {
  this.populate({
    path: "bookSend",
    // select:''
  });
  next();
});

const Publisher = mongoose.model("Publisher", publisherSchema);

module.exports = Publisher;
