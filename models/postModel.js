const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, "Content post missing"],
  },
  //   comments: [{type: mongoose.Schema.ObjectId, ref: "Comment" }],
  photo: {
    type: String,
  },
  user: { type: mongoose.Schema.ObjectId, ref: "User" },
  likes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  noOfLikes: { type: Number, default: 0 },
});

postSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    // select:''
  });
  next();
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
